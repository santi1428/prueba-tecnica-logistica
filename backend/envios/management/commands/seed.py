from django.core.management.base import BaseCommand
from django.utils import timezone
from envios.models import TipoDocumento, TipoProducto, TipoLogistica, Bodega, Puerto, Cliente, Envio

class Command(BaseCommand):
    help = 'Carga los datos iniciales (seeds) completos para el sistema de envíos'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Iniciando carga de datos iniciales...'))

        # 1. Seeders para Tipo de Documento
        documentos = [
            {'nombre': 'Cédula de Ciudadanía', 'abreviatura': 'CC'},
            {'nombre': 'Cédula de Extranjería', 'abreviatura': 'CE'},
            {'nombre': 'Pasaporte', 'abreviatura': 'PA'},
            {'nombre': 'NIT', 'abreviatura': 'NIT'}
        ]
        for doc in documentos:
            TipoDocumento.objects.get_or_create(nombre=doc['nombre'], defaults={'abreviatura': doc['abreviatura']})
        self.stdout.write(self.style.SUCCESS('Tipos de Documentos cargados.'))

        # 2. Seeders para Tipo de Producto
        productos = [
            {'nombre': 'Equipos Electrónicos', 'descripcion': 'Computadores, celulares, tablets.'},
            {'nombre': 'Alimentos Perecederos', 'descripcion': 'Frutas, verduras, carnes refrigeradas.'},
            {'nombre': 'Materiales de Construcción', 'descripcion': 'Cemento, varillas, ladrillos.'},
            {'nombre': 'Textiles y Ropa', 'descripcion': 'Prendas de vestir y telas en general.'}
        ]
        for prod in productos:
            TipoProducto.objects.get_or_create(nombre=prod['nombre'], defaults={'descripcion': prod['descripcion']})
        self.stdout.write(self.style.SUCCESS('Tipos de Productos cargados.'))

        # 3. Seeders para Tipo de Logística
        logisticas = [
            {'nombre': 'Terrestre', 'descuento_porcentaje': 5.00, 'cantidad_minima_descuento': 10},
            {'nombre': 'Marítima', 'descuento_porcentaje': 3.00, 'cantidad_minima_descuento': 10}
        ]
        for log in logisticas:
            TipoLogistica.objects.get_or_create(
                nombre=log['nombre'],
                defaults={
                    'descuento_porcentaje': log['descuento_porcentaje'],
                    'cantidad_minima_descuento': log['cantidad_minima_descuento']
                }
            )
        self.stdout.write(self.style.SUCCESS('Tipos de Logística cargados.'))

        # 4. Seeders para Bodegas
        bodegas = [
            {'nombre': 'Bodega Central Bogotá', 'ubicacion': 'Calle 13 # 65-10, Bogotá'},
            {'nombre': 'Bodega Norte Medellín', 'ubicacion': 'Carrera 50 # 10-20, Medellín'}
        ]
        for bod in bodegas:
            Bodega.objects.get_or_create(nombre=bod['nombre'], defaults={'ubicacion': bod['ubicacion']})
        self.stdout.write(self.style.SUCCESS('Bodegas cargadas.'))

        # 5. Seeders para Puertos
        puertos = [
            {'nombre': 'Puerto de Buenaventura', 'pais': 'Colombia'},
            {'nombre': 'Puerto de Cartagena', 'pais': 'Colombia'}
        ]
        for pto in puertos:
            Puerto.objects.get_or_create(nombre=pto['nombre'], defaults={'pais': pto['pais']})
        self.stdout.write(self.style.SUCCESS('Puertos cargados.'))

        # 6. Seeders para Clientes
        tipo_doc_cc = TipoDocumento.objects.get(abreviatura='CC')
        tipo_doc_nit = TipoDocumento.objects.get(abreviatura='NIT')
        
        clientes = [
            {'nombre': 'Juan Pérez', 'correo_electronico': 'juan@correo.com', 'telefono': '3001234567', 'direccion': 'Av Siempre Viva 123', 'tipo_documento': tipo_doc_cc, 'documento': '1000200030'},
            {'nombre': 'Empresa Logística S.A.', 'correo_electronico': 'contacto@empresa.com', 'telefono': '6015555555', 'direccion': 'Zona Franca, Lote 4', 'tipo_documento': tipo_doc_nit, 'documento': '900123456-7'}
        ]
        for cli in clientes:
            Cliente.objects.get_or_create(
                correo_electronico=cli['correo_electronico'],
                defaults={
                    'nombre': cli['nombre'],
                    'telefono': cli['telefono'],
                    'direccion': cli['direccion'],
                    'tipo_documento': cli['tipo_documento'],
                    'documento': cli['documento']
                }
            )
        self.stdout.write(self.style.SUCCESS('Clientes cargados.'))

        # 7. Seeders para Envíos (Uno Terrestre y Uno Marítimo)
        cliente_1 = Cliente.objects.get(correo_electronico='juan@correo.com')
        cliente_2 = Cliente.objects.get(correo_electronico='contacto@empresa.com')
        
        prod_electronicos = TipoProducto.objects.get(nombre='Equipos Electrónicos')
        prod_construccion = TipoProducto.objects.get(nombre='Materiales de Construcción')
        
        log_terrestre = TipoLogistica.objects.get(nombre='Terrestre')
        log_maritima = TipoLogistica.objects.get(nombre='Marítima')
        
        bodega_entrega = Bodega.objects.first()
        puerto_entrega = Puerto.objects.first()

        envios = [
            {
                'numero_guia': 'G-TERR0001',
                'cliente': cliente_1,
                'tipo_producto': prod_electronicos,
                'cantidad_producto': 15, # Mayor a 10 para probar el descuento del 5%
                'fecha_entrega': timezone.now() + timezone.timedelta(days=3),
                'precio_envio': 100000.00,
                'tipo_logistica': log_terrestre,
                'placa_vehiculo': 'ABC123',
                'bodega_entrega': bodega_entrega,
                'precio_final': 95000.00 # 100000 - 5%
            },
            {
                'numero_guia': 'G-MARI0001',
                'cliente': cliente_2,
                'tipo_producto': prod_construccion,
                'cantidad_producto': 500, # Mayor a 10 para probar el descuento del 3%
                'fecha_entrega': timezone.now() + timezone.timedelta(days=15),
                'precio_envio': 5000000.00,
                'tipo_logistica': log_maritima,
                'numero_flota': 'FLT98765',
                'puerto_entrega': puerto_entrega,
                'precio_final': 4850000.00 # 5000000 - 3%
            }
        ]

        for env in envios:
            Envio.objects.get_or_create(
                numero_guia=env['numero_guia'],
                defaults={
                    'cliente': env['cliente'],
                    'tipo_producto': env['tipo_producto'],
                    'cantidad_producto': env['cantidad_producto'],
                    'fecha_entrega': env['fecha_entrega'],
                    'precio_envio': env['precio_envio'],
                    'tipo_logistica': env['tipo_logistica'],
                    'placa_vehiculo': env.get('placa_vehiculo'),
                    'numero_flota': env.get('numero_flota'),
                    'bodega_entrega': env.get('bodega_entrega'),
                    'puerto_entrega': env.get('puerto_entrega'),
                    'precio_final': env['precio_final']
                }
            )
        self.stdout.write(self.style.SUCCESS('Envíos cargados.'))

        self.stdout.write(self.style.SUCCESS('\n¡Proceso de seeding completado exitosamente!'))
