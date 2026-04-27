from rest_framework.viewsets import ModelViewSet
from .models import RegistroAtendimento
from .serializers import AtendimentoSerializer


class AtendimentoViewSet(ModelViewSet):
    queryset = RegistroAtendimento.objects.select_related('estudante_id').all()
    serializer_class = AtendimentoSerializer

    def get_queryset(self):
        queryset = self.queryset.order_by('-data', '-id')
        estudante_id = self.request.query_params.get('estudante_id')

        if estudante_id:
            queryset = queryset.filter(estudante_id_id=estudante_id)

        return queryset
