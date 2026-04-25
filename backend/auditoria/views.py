from rest_framework.viewsets import ModelViewSet
from .models import Auditoria
from .serializers import AuditoriaSerializer

class AuditoriaViewSet(ModelViewSet):
    queryset = Auditoria.objects.all()
    serializer_class = AuditoriaSerializer