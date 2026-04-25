from rest_framework.viewsets import ModelViewSet
from .models import HorarioAtendimento, AgendamentoEstudante
from .serializers import HorarioAtendimentoSerializer, AgendamentoSerializer

class HorarioAtendimentoViewSet(ModelViewSet):
    queryset = HorarioAtendimento.objects.all()
    serializer_class = HorarioAtendimentoSerializer

class AgendamentoViewSet(ModelViewSet):
    queryset = AgendamentoEstudante.objects.all()
    serializer_class = AgendamentoSerializer