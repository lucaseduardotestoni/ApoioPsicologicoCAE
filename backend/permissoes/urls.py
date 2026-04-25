from rest_framework.routers import SimpleRouter
from .views import GrupoPermissaoViewSet, NivelPermissaoViewSet, PermissaoViewSet

router = SimpleRouter()
router.register(r'grupospermissoes', GrupoPermissaoViewSet)
router.register(r'nivelpermissoes', NivelPermissaoViewSet)
router.register(r'permissoes', PermissaoViewSet)

urlpatterns = router.urls