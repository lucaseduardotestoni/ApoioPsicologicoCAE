from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from usuarios.models import Usuario
from permissoes.models import GrupoUsuario
from .models import Comunicado, GrupoComunicado


class ComunicadoSerializer(serializers.ModelSerializer):
    grupos = serializers.SerializerMethodField(read_only=True)
    grupo_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Comunicado
        fields = [
            'id',
            'titulo',
            'mensagem',
            'data_em',
            'usuario_id',
            'ativo',
            'grupos',
            'grupo_ids',
        ]
        read_only_fields = ['id', 'grupos']
        extra_kwargs = {
            'usuario_id': {'required': False},
            'data_em': {'required': False},
        }

    def get_grupos(self, obj):
        vinculos = GrupoComunicado.objects.filter(comunicado_id=obj).select_related('grupo_usuario_id')
        return [
            {
                'id': vinculo.grupo_usuario_id.id,
                'nome': vinculo.grupo_usuario_id.nome,
            }
            for vinculo in vinculos
        ]

    def validate_grupo_ids(self, value):
        ids_unicos = list(dict.fromkeys(value))
        grupos_existentes = GrupoUsuario.objects.filter(id__in=ids_unicos).count()

        if grupos_existentes != len(ids_unicos):
            raise serializers.ValidationError('Um ou mais grupos informados não existem.')

        return ids_unicos

    def validate(self, attrs):
        if self.instance is None and not attrs.get('grupo_ids'):
            raise serializers.ValidationError({'grupo_ids': 'Informe ao menos um grupo destinatário.'})

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        grupo_ids = validated_data.pop('grupo_ids', [])

        if 'data_em' not in validated_data:
            validated_data['data_em'] = timezone.now()

        if 'usuario_id' not in validated_data:
            usuario = Usuario.objects.order_by('id').first()
            if usuario is None:
                raise serializers.ValidationError({'usuario_id': 'Nenhum usuário disponível para registrar o comunicado.'})
            validated_data['usuario_id'] = usuario

        comunicado = Comunicado.objects.create(**validated_data)
        self._sincronizar_grupos(comunicado, grupo_ids)
        return comunicado

    @transaction.atomic
    def update(self, instance, validated_data):
        grupo_ids = validated_data.pop('grupo_ids', None)

        for campo, valor in validated_data.items():
            setattr(instance, campo, valor)

        instance.save()

        if grupo_ids is not None:
            self._sincronizar_grupos(instance, grupo_ids)

        return instance

    def _sincronizar_grupos(self, comunicado, grupo_ids):
        GrupoComunicado.objects.filter(comunicado_id=comunicado).delete()
        GrupoComunicado.objects.bulk_create([
            GrupoComunicado(
                comunicado_id=comunicado,
                grupo_usuario_id_id=grupo_id,
            )
            for grupo_id in grupo_ids
        ])


class GrupoComunicadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoComunicado
        fields = '__all__'
