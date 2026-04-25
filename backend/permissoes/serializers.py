from rest_framework import serializers
from .models import GrupoPermissao, NivelPermissao, Permissao  

class GrupoPermissaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoPermissao
        fields = '__all__'

class NivelPermissaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = NivelPermissao
        fields = '__all__'
        
class PermissaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permissao
        fields = '__all__'