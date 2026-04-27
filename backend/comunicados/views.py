from rest_framework.viewsets import ModelViewSet
from .models import Comunicado, GrupoComunicado
from .serializers import ComunicadoSerializer, GrupoComunicadoSerializer


class ComunicadoViewSet(ModelViewSet):
    queryset = Comunicado.objects.all().order_by('-data_em', '-id')
    serializer_class = ComunicadoSerializer


class GrupoComunicadoViewSet(ModelViewSet):
    queryset = GrupoComunicado.objects.all()
    serializer_class = GrupoComunicadoSerializer
