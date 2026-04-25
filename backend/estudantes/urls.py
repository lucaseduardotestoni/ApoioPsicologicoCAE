from rest_framework.routers import SimpleRouter
from .views import EstudanteViewSet

router = SimpleRouter()
router.register(r'estudantes', EstudanteViewSet)

urlpatterns = router.urls
