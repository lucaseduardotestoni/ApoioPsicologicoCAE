from rest_framework.viewsets import ModelViewSet
from .models import RegistroAtendimento
from .serializers import AtendimentoSerializer


class AtendimentoViewSet(ModelViewSet):
    queryset = RegistroAtendimento.objects.all()
    serializer_class = AtendimentoSerializer