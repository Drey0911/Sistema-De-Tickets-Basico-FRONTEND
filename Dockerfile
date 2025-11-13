# BUILDER (Compilación de la aplicación React) 
FROM node:20-alpine AS builder

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package.json ./

# Instalar las dependencias de la aplicación con silent para mejorar tamaño
RUN npm install --silent

# Copiar el resto del código fuente de la aplicación
COPY . .

# Compilar la aplicación React (crea la carpeta 'build' o 'dist')
RUN npm run build

# Servir los archivos con Nginx
FROM nginx:alpine AS production-stage

# Copiar el archivo de configuración de Nginx personalizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos compilados desde la fase 'builder'
COPY --from=builder /app/dist /usr/share/nginx/html

# El puerto 80 es el puerto por defecto para Nginx en esta imagen
EXPOSE 80

# El comando por defecto de Nginx ya está configurado en la imagen base
CMD ["nginx", "-g", "daemon off;"]