from rest_framework import serializers

from usuarios.models import Usuario
from .models import HorarioAtendimento, AgendamentoEstudante


class HorarioAtendimentoSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.CharField(source='usuario_id.nome', read_only=True)

    class Meta:
        model = HorarioAtendimento
        fields = '__all__'
        extra_kwargs = {
            'usuario_id': {'required': False},
        }

    def create(self, validated_data):
        if 'usuario_id' not in validated_data:
            usuario = Usuario.objects.order_by('id').first()
            if usuario is None:
                raise serializers.ValidationError({'usuario_id': 'Nenhum usuário disponível para registrar o horário.'})
            validated_data['usuario_id'] = usuario

        return super().create(validated_data)


class AgendamentoSerializer(serializers.ModelSerializer):
    estudante_nome = serializers.CharField(source='estudante_id.nome', read_only=True)

    class Meta:
        model = AgendamentoEstudante
        fields = '__all__'
