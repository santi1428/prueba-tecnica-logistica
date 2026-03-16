"""
URL configuration for logistics_core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from envios.views import RegistroUsuarioView, MiTokenPersonalizadoView
urlpatterns = [
    path('admin/', admin.site.urls),
    
        # Rutas de Autenticación
    path('api/auth/registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    path('api/auth/login/', MiTokenPersonalizadoView.as_view(), name='token_obtain_pair'), # Devuelve el Token
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Refresca el Token
    
    # Rutas de tu CRUD Logístico 
    path('api/logistica/', include('envios.urls')), 
]
