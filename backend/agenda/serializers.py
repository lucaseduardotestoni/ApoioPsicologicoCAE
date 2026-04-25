from rest_framework import serializers
from .models import HorarioAtendimento, AgendamentoEstudante

class HorarioAtendimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorarioAtendimento
        fields = '__all__'

class AgendamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgendamentoEstudante
        fields = '__all__'