from django.db import models

    
class TipoDocumento(models.Model):
    nombre = models.CharField(max_length=50, unique=True) # Ej: Cédula de Ciudadanía, Pasaporte
    abreviatura = models.CharField(max_length=10, blank=True, null=True) # Ej: CC, CE, PA

    class Meta:
        db_table = 'tipo_documento'
        
    def __str__(self):
        return self.nombre
    
class Cliente(models.Model):
    nombre = models.CharField(max_length=255)
    correo_electronico = models.EmailField(unique=True)
    telefono = models.CharField(max_length=17) 
    direccion = models.CharField(max_length=255)
    tipo_documento = models.ForeignKey(TipoDocumento, on_delete=models.PROTECT)
    documento = models.CharField(max_length=20, unique=True, help_text="Número del documento de identidad")

    class Meta:
       db_table = 'cliente'

    def __str__(self):
        return f"{self.nombre} - CC: {self.cedula}"
    

class Bodega(models.Model):
    nombre = models.CharField(max_length=255)
    ubicacion = models.CharField(max_length=255)
    
    class Meta:
        db_table = 'bodega'

    def __str__(self):
        return self.nombre

class Puerto(models.Model):
    nombre = models.CharField(max_length=255)
    pais = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'puerto'

    def __str__(self):
        return self.nombre

# 1. Nueva tabla para gestionar los tipos de productos
class TipoProducto(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True) # Opcional pero recomendado
    
    class Meta:
        db_table = 'tipo_producto'

    def __str__(self):
        return self.nombre
    
class TipoLogistica(models.Model):
    nombre = models.CharField(max_length=50, unique=True) # Ej: Terrestre, Marítima
    descuento_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # Ej: 5.00 o 3.00
    cantidad_minima_descuento = models.PositiveIntegerField(default=11)
    
    class Meta:
        db_table = 'tipo_logistica'

class Envio(models.Model):
    TIPOS_LOGISTICA = (
        ('TERRESTRE', 'Terrestre'),
        ('MARITIMA', 'Marítima')
    )
    
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    
    # 2. Relación con la nueva tabla TipoProducto
    tipo_producto = models.ForeignKey(TipoProducto, on_delete=models.PROTECT)
    
    cantidad_producto = models.PositiveIntegerField() # Regla: debe ser > 0
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_entrega = models.DateTimeField()
    precio_envio = models.DecimalField(max_digits=10, decimal_places=2)
    numero_guia = models.CharField(max_length=10, unique=True) # Regla: Campo único
    tipo_logistica = models.ForeignKey(TipoLogistica, on_delete=models.PROTECT)

    
    # Campos condicionales
    placa_vehiculo = models.CharField(max_length=6, blank=True, null=True)
    numero_flota = models.CharField(max_length=8, blank=True, null=True)
    bodega_entrega = models.ForeignKey(Bodega, on_delete=models.SET_NULL, null=True, blank=True)
    puerto_entrega = models.ForeignKey(Puerto, on_delete=models.SET_NULL, null=True, blank=True)
    precio_final = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True) # Precio con descuento
    
    class Meta:
        db_table = 'envio'

    def __str__(self):
        return f"Guía {self.numero_guia} - {self.cliente.nombre}"
