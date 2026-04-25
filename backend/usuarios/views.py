from rest_framework.viewsets import ModelViewSet
from .models import Usuario, GrupoUsuario
from .serializers import UsuarioSerializer, GrupoUsuarioSerializer

class UsuarioViewSet(ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class GrupoUsuarioViewSet(ModelViewSet):
    queryset = GrupoUsuario.objects.all()
    serializer_class = GrupoUsuarioSerializer