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

---

## Notes

Esta guía asume que estás utilizando las credenciales de base de datos predeterminadas. Para producción, considera cambiar las credenciales y configurar variables de entorno. La aplicación está diseñada para desarrollo local con CORS habilitado para todos los orígenes y modo debug activado.

Wiki pages you might want to explore:
- [System Architecture (santi1428/prueba-tecnica-logistica)](/wiki/santi1428/prueba-tecnica-logistica#1.2)

### Citations

**File:** backend/logistics_core/settings.py (L27-27)
```python
DEBUG = True
```

**File:** backend/logistics_core/settings.py (L32-34)
```python
CORS_ALLOW_ALL_ORIGINS = True  

CORS_ALLOW_CREDENTIALS = True
```

**File:** backend/logistics_core/settings.py (L89-98)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'logistics_db',
        'USER': 'admin',
        'PASSWORD': '123456',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

**File:** backend/logistics_core/settings.py (L113-121)
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),  # Extendido a 2 horas
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),  # Por defecto es 1 día (puedes cambiarlo si quieres)
    
    # Opcionales pero recomendados para seguridad
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,
}
```

**File:** backend/logistics_core/urls.py (L22-32)
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    
        # Rutas de Autenticación
    path('api/auth/registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    path('api/auth/login/', MiTokenPersonalizadoView.as_view(), name='token_obtain_pair'), # Devuelve el Token
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Refresca el Token
    
    # Rutas de tu CRUD Logístico 
    path('api/logistica/', include('envios.urls')), 
]
```

**File:** frontend/src/api/endpoint.ts (L28-34)
```typescript
export const api = {
  // ----- AUTENTICACIÓN -----
  auth: {
    login: (data: LoginPayload) => apiClient.post("/auth/login/", data),
    registro: (data: RegisterPayload) =>
      apiClient.post("/auth/registro/", data),
  },
```

**File:** frontend/src/App.tsx (L21-33)
```typescript
const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```
