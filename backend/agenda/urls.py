from rest_framework.routers import SimpleRouter
from .views import HorarioAtendimentoViewSet, AgendamentoViewSet

router = SimpleRouter()
router.register(r'horarios', HorarioAtendimentoViewSet)
router.register(r'agendamentos', AgendamentoViewSet)

urlpatterns = router.urls