# Guía para Despliegue Local

Esta guía te ayudará a configurar y ejecutar la aplicación de logística localmente. La aplicación utiliza una arquitectura de tres capas con React frontend, Django backend y PostgreSQL base de datos.

## Requisitos Previos

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Git

## Configuración de la Base de Datos

1. **Instalar y configurar PostgreSQL**:
   ```bash
   # Crear base de datos
   createdb logistics_db
   
   # Crear usuario (o usar uno existente)
   CREATE USER admin WITH PASSWORD '123456';
   GRANT ALL PRIVILEGES ON DATABASE logistics_db TO admin;
   ```

   La configuración de la base de datos está definida en `backend/logistics_core/settings.py` [1](#0-0) .

## Configuración del Backend

1. **Navegar al directorio del backend**:
   ```bash
   cd backend
   ```

2. **Crear entorno virtual**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Aplicar migraciones**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Crear superusuario (opcional)**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Iniciar servidor de desarrollo**:
   ```bash
   python manage.py runserver
   ```

   El backend estará disponible en `http://localhost:8000` con las rutas API definidas en `backend/logistics_core/urls.py` [2](#0-1) .

## Configuración del Frontend

1. **Navegar al directorio del frontend**:
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

   El frontend estará disponible en `http://localhost:5173` y se conectará al backend a través del cliente API configurado en `frontend/src/api/endpoint.ts` [3](#0-2) .

## Verificación del Despliegue

1. **Acceder a la aplicación**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000/api/`
   - Admin de Django: `http://localhost:8000/admin/`

2. **Probar autenticación**:
   - Regístrate en `http://localhost:5173/registro`
   - Inicia sesión en `http://localhost:5173/login`

   El flujo de autenticación utiliza JWT tokens como se configura en `backend/logistics_core/settings.py` [4](#0-3) .

## Notas de Configuración

- **CORS**: La configuración permite todos los orígenes para desarrollo (`CORS_ALLOW_ALL_ORIGINS = True`) [5](#0-4) .
- **Debug mode**: Está activado (`DEBUG = True`) [6](#0-5) .
- **Base de datos**: Usa PostgreSQL con credenciales de desarrollo [1](#0-0) .

## Estructura de la Aplicación

La aplicación React utiliza rutas protegidas y un layout principal como se define en `frontend/src/App.tsx` [7](#0-6) . Las rutas principales incluyen envíos, clientes, productos, bodegas y puertos.



