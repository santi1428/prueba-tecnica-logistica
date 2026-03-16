import re
from rest_framework import serializers
from .models import TipoProducto, Envio, Cliente, Puerto, Bodega, TipoDocumento, TipoLogistica
from django.contrib.auth.models import User


class TipoProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoProducto
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class PuertoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Puerto
        fields = '__all__'

class BodegaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bodega
        fields = '__all__'
        
class TipoDocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDocumento
        fields = '__all__'

class EnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Envio
        fields = '__all__'
        read_only_fields = ('precio_final', 'numero_guia')

    # REGLAS DE NEGOCIO: Validaciones de Placas y Flotas
    def validate(self, data):
        # Obtenemos el tipo de logística de la petición
        tipo_logistica = data.get('tipo_logistica')
        if not tipo_logistica and self.instance: # En caso de un PUT parcial
            tipo_logistica = self.instance.tipo_logistica

        if tipo_logistica:
            nombre_logistica = tipo_logistica.nombre.upper()
            
            # Validación Logística Terrestre (3 letras, 3 números)
            if nombre_logistica == 'TERRESTRE':
                placa = data.get('placa_vehiculo')
                if not placa or not re.match(r'^[A-Za-z]{3}\d{3}$', placa):
                    raise serializers.ValidationError(
                        {"placa_vehiculo": "Debe contener 3 letras iniciales y 3 números finales (Ej: AAA123)"}
                    )
            
            # Validación Logística Marítima (3 letras, 4 números, 1 letra)
            elif nombre_logistica in ['MARÍTIMA', 'MARITIMA']:
                flota = data.get('numero_flota')
                if not flota or not re.match(r'^[A-Za-z]{3}\d{4}[A-Za-z]{1}$', flota):
                    raise serializers.ValidationError(
                        {"numero_flota": "Debe contener 3 letras, 4 números y 1 letra (Ej: AAA1234A)"}
                    )

        return data

    # REGLAS DE NEGOCIO: Cálculo de descuentos
    def _calcular_precio_final(self, data):
        tipo_logistica = data.get('tipo_logistica')
        cantidad = data.get('cantidad_producto', 0)
        precio = data.get('precio_envio', 0)

        if tipo_logistica and cantidad > tipo_logistica.cantidad_minima_descuento:
            descuento = (tipo_logistica.descuento_porcentaje / 100) * precio
            return precio - descuento
        return precio

    def create(self, validated_data):
        validated_data['precio_final'] = self._calcular_precio_final(validated_data)

        import string, random
        validated_data['numero_guia'] = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        return super().create(validated_data)

    def update(self, instance, validated_data):

        datos_completos = {**serializers.ModelSerializer.to_representation(self, instance), **validated_data}
        validated_data['precio_final'] = self._calcular_precio_final(datos_completos)
        return super().update(instance, validated_data)


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}} # Para que la contraseña no se devuelva en la respuesta

    def create(self, validated_data):
        # Usamos create_user para que la contraseña se guarde encriptada (hasheada)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        
        #
        return user
    
    
    # envios/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MiTokenPersonalizado(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Agregamos el nombre de usuario al payload del token
        token['username'] = user.username 
        return token
