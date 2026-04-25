from rest_framework.routers import SimpleRouter
from .views import UsuarioViewSet, GrupoUsuarioViewSet

router = SimpleRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'gruposusuarios', GrupoUsuarioViewSet)

urlpatterns = router.urls