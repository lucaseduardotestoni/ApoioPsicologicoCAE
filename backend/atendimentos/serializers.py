from rest_framework import serializers
from .models import RegistroAtendimento

class AtendimentoSerializer(serializers.ModelSerializer):
    estudante_nome = serializers.CharField(source='estudante_id.nome', read_only=True)

    class Meta:
        model = RegistroAtendimento
        fields = '__all__'
