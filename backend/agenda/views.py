from rest_framework.viewsets import ModelViewSet
from .models import HorarioAtendimento, AgendamentoEstudante
from .serializers import HorarioAtendimentoSerializer, AgendamentoSerializer

class HorarioAtendimentoViewSet(ModelViewSet):
    queryset = HorarioAtendimento.objects.select_related('usuario_id').all().order_by('data', 'hora_inicio', 'id')
    serializer_class = HorarioAtendimentoSerializer

class AgendamentoViewSet(ModelViewSet):
    queryset = AgendamentoEstudante.objects.select_related('estudante_id', 'horario_id').all().order_by('-id')
    serializer_class = AgendamentoSerializer
