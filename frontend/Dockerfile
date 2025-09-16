# Dockerfile para el frontend React + Vite
# Multi-stage build para optimizar el tamaño de la imagen

# =============================================
# Stage 1: Build
# =============================================
FROM node:18-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production --silent

# Copiar código fuente
COPY . .

# Build arguments para variables de entorno
ARG VITE_API_URL
ARG VITE_APP_NAME
ARG VITE_NODE_ENV=production

# Variables de entorno para el build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_NODE_ENV=$VITE_NODE_ENV

# Construir la aplicación
RUN npm run build

# =============================================
# Stage 2: Production
# =============================================
FROM nginx:alpine AS production

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar configuración personalizada de nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copiar archivos construidos desde el stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cambiar ownership de los archivos
RUN chown -R nextjs:nodejs /usr/share/nginx/html
RUN chown -R nextjs:nodejs /var/cache/nginx
RUN chown -R nextjs:nodejs /var/log/nginx
RUN chown -R nextjs:nodejs /etc/nginx/conf.d
RUN chown -R nextjs:nodejs /var/run

# Crear directorio para el PID de nginx
RUN mkdir -p /var/run/nginx
RUN chown -R nextjs:nodejs /var/run/nginx

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]