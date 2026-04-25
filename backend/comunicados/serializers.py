from rest_framework import serializers
from .models import Comunicado, GrupoComunicado

class ComunicadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comunicado
        fields = '__all__'


class GrupoComunicadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoComunicado
        fields = '__all__'