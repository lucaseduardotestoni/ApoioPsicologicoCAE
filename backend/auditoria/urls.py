from rest_framework.routers import SimpleRouter
from .views import AuditoriaViewSet

router = SimpleRouter()
router.register(r'auditoria', AuditoriaViewSet)

urlpatterns = router.urls