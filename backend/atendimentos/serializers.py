from rest_framework import serializers
from .models import RegistroAtendimento

class AtendimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroAtendimento
        fields = '__all__'