from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, ClienteViewSet, PuertoViewSet, BodegaViewSet, EnvioViewSet, TipoDocumentoViewSet

router = DefaultRouter()

router.register(r'productos', ProductoViewSet, basename='productos')
router.register(r'clientes', ClienteViewSet, basename='clientes')
router.register(r'puertos', PuertoViewSet, basename='puertos')
router.register(r'bodegas', BodegaViewSet, basename='bodegas')
router.register(r'envios', EnvioViewSet, basename='envios')
router.register(r'tipos-documento', TipoDocumentoViewSet, basename='tipos-documento') 

urlpatterns = [
    path('', include(router.urls)),
]
