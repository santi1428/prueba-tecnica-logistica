from django.core.management.base import BaseCommand
from envios.models import TipoDocumento, TipoProducto, TipoLogistica

class Command(BaseCommand):
    help = 'Carga los datos iniciales (seeds) para Tipos de Documento, Productos y Logística'

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
            obj, creado = TipoDocumento.objects.get_or_create(
                nombre=doc['nombre'],
                defaults={'abreviatura': doc['abreviatura']}
            )
            if creado:
                self.stdout.write(self.style.SUCCESS(f'Creado: {obj.nombre}'))

        # 2. Seeders para Tipo de Producto
        productos = [
            {'nombre': 'Equipos Electrónicos', 'descripcion': 'Computadores, celulares, tablets.'},
            {'nombre': 'Alimentos Perecederos', 'descripcion': 'Frutas, verduras, carnes refrigeradas.'},
            {'nombre': 'Materiales de Construcción', 'descripcion': 'Cemento, varillas, ladrillos.'},
            {'nombre': 'Textiles y Ropa', 'descripcion': 'Prendas de vestir y telas en general.'}
        ]
        for prod in productos:
            obj, creado = TipoProducto.objects.get_or_create(
                nombre=prod['nombre'],
                defaults={'descripcion': prod['descripcion']}
            )
            if creado:
                self.stdout.write(self.style.SUCCESS(f'Creado: {obj.nombre}'))

        # 3. Seeders para Tipo de Logística (Reglas de tu prueba técnica)
        logisticas = [
            {'nombre': 'Terrestre', 'descuento_porcentaje': 5.00, 'cantidad_minima_descuento': 10},
            {'nombre': 'Marítima', 'descuento_porcentaje': 3.00, 'cantidad_minima_descuento': 10}
        ]
        for log in logisticas:
            obj, creado = TipoLogistica.objects.get_or_create(
                nombre=log['nombre'],
                defaults={
                    'descuento_porcentaje': log['descuento_porcentaje'],
                    'cantidad_minima_descuento': log['cantidad_minima_descuento']
                }
            )
            if creado:
                self.stdout.write(self.style.SUCCESS(f'Creado: {obj.nombre}'))

        self.stdout.write(self.style.SUCCESS('¡Proceso de seeding completado exitosamente!'))
