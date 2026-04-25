from rest_framework.routers import SimpleRouter
from .views import ComunicadoViewSet, GrupoComunicadoViewSet

router = SimpleRouter()
router.register(r'comunicados', ComunicadoViewSet)
router.register(r'gruposcomunicados', GrupoComunicadoViewSet)

urlpatterns = router.urls