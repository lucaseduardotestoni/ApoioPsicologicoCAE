from rest_framework.routers import SimpleRouter
from .views import AtendimentoViewSet

router = SimpleRouter()
router.register(r'atendimentos', AtendimentoViewSet)

urlpatterns = router.urls