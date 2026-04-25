from rest_framework.viewsets import ModelViewSet
from .models import GrupoPermissao, NivelPermissao, Permissao
from .serializers import GrupoPermissaoSerializer, NivelPermissaoSerializer ,PermissaoSerializer


class GrupoPermissaoViewSet(ModelViewSet):
    queryset = GrupoPermissao.objects.all()
    serializer_class = GrupoPermissaoSerializer

class NivelPermissaoViewSet(ModelViewSet):
    queryset = NivelPermissao.objects.all()
    serializer_class = NivelPermissaoSerializer

class PermissaoViewSet(ModelViewSet):
    queryset = Permissao.objects.all()
    serializer_class = PermissaoSerializer