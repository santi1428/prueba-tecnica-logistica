from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import TipoProducto, Envio, Cliente, Puerto, Bodega, TipoDocumento
from .serializers import (
    TipoProductoSerializer, ClienteSerializer, PuertoSerializer, 
    BodegaSerializer, EnvioSerializer, TipoDocumentoSerializer
)
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .serializers import RegistroUsuarioSerializer
from rest_framework.response import Response
from rest_framework import status



class ProductoViewSet(viewsets.ModelViewSet):
    queryset = TipoProducto.objects.all()
    serializer_class = TipoProductoSerializer
    permission_classes = [IsAuthenticated]

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

class PuertoViewSet(viewsets.ModelViewSet):
    queryset = Puerto.objects.all()
    serializer_class = PuertoSerializer
    permission_classes = [IsAuthenticated]

class BodegaViewSet(viewsets.ModelViewSet):
    queryset = Bodega.objects.all()
    serializer_class = BodegaSerializer
    permission_classes = [IsAuthenticated]

class EnvioViewSet(viewsets.ModelViewSet):
    queryset = Envio.objects.all()
    serializer_class = EnvioSerializer
    permission_classes = [IsAuthenticated]

class TipoDocumentoViewSet(viewsets.ModelViewSet):
    queryset = TipoDocumento.objects.all()
    serializer_class = TipoDocumentoSerializer
    permission_classes = [IsAuthenticated]

class RegistroUsuarioView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistroUsuarioSerializer
    permission_classes = [AllowAny] # Permite registrarse sin token
    
    def create(self, request, *args, **kwargs):
    # 1. Pasamos los datos que envió el usuario al serializador
        serializer = self.get_serializer(data=request.data)
        
        # 2. Validamos los datos (si falta el password o el email, lanzará un error 400 automáticamente)
        serializer.is_valid(raise_exception=True)
        
        # 3. Guardamos el usuario en la base de datos
        self.perform_create(serializer)
        
        # 4. Construimos nuestro mensaje personalizado en formato JSON
        respuesta_personalizada = {
            "mensaje": "Usuario creado exitosamente",
            "datos_usuario": {
                "username": serializer.data.get('username'),
                "email": serializer.data.get('email')
            }
        }
        
        # 5. Retornamos la respuesta con el código HTTP 201 (Created)
        return Response(respuesta_personalizada, status=status.HTTP_201_CREATED)
    
    
# Importa la vista base de JWT
from rest_framework_simplejwt.views import TokenObtainPairView
# Importa tu serializador personalizado (asegúrate de que esté en serializers.py)
from .serializers import MiTokenPersonalizado

# Crea una nueva clase View que usa tu serializador
class MiTokenPersonalizadoView(TokenObtainPairView):
    serializer_class = MiTokenPersonalizado
