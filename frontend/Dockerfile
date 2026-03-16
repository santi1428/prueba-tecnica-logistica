# ETAPA 1: Construcción (Build)
# ACTUALIZADO: Se requiere Node 20 o superior para Vite 8
FROM node:22-alpine as builder 
WORKDIR /app
COPY package*.json ./

# Ignora los conflictos estrictos de dependencias
RUN npm install --legacy-peer-deps

COPY . .
# Compilar el proyecto React
RUN npm run build

# ETAPA 2: Producción (Nginx)
FROM nginx:alpine
# Copiar el resultado de la compilación de Vite a la carpeta pública de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración básica de Nginx para Single Page Applications (React Router)
RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
