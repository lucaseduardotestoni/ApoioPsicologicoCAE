from rest_framework.viewsets import ModelViewSet
from .models import Estudante
from .serializers import EstudanteSerializer

class EstudanteViewSet(ModelViewSet):
    queryset = Estudante.objects.all()
    serializer_class = EstudanteSerializer