from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, ClienteViewSet, PuertoViewSet, BodegaViewSet, EnvioViewSet, TipoDocumentoViewSet

router = DefaultRouter()
# Al registrar el ViewSet se crean automáticamente las rutas GET, POST, PUT, DELETE
router.register(r'productos', ProductoViewSet, basename='productos')
router.register(r'clientes', ClienteViewSet, basename='clientes')
router.register(r'puertos', PuertoViewSet, basename='puertos')
router.register(r'bodegas', BodegaViewSet, basename='bodegas')
router.register(r'envios', EnvioViewSet, basename='envios')
router.register(r'tipos-documento', TipoDocumentoViewSet, basename='tipos-documento') # Nueva ruta para tipos de documento

urlpatterns = [
    path('', include(router.urls)),
]
