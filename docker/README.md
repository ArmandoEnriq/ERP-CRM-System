# ERP/CRM System - Docker Configuration

Este directorio contiene todas las configuraciones necesarias para ejecutar el sistema ERP/CRM usando Docker.

## 🐳 Arquitectura de Contenedores

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │    Frontend     │    │    Backend      │
│  (Prod Only)    │    │     React       │    │     NestJS      │
│   Port: 80/443  │    │   Port: 5173    │    │   Port: 3000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │   PostgreSQL    │    │      Redis      │    │     Adminer     │
    │   Port: 5432    │    │   Port: 6379    │    │   Port: 8080    │
    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Inicio Rápido

### Desarrollo

```bash
# Clonar el repositorio
git clone <repository-url>
cd erp-crm-system

# Ejecutar setup automático
make setup

# O manualmente:
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

### Producción

```bash
# Configurar variables de entorno de producción
cp .env.example .env.production
# Editar .env.production con valores reales

# Iniciar en producción
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## 📋 Servicios Disponibles

### Base de Datos (PostgreSQL)

- **Puerto:** 5432
- **Usuario:** postgres
- **Contraseña:** password (desarrollo)
- **Base de datos:** erp_crm_db
- **Backup automático:** Configurado en producción

### Cache (Redis)

- **Puerto:** 6379
- **Contraseña:** redispassword
- **Uso:** Sessions, cache, queues

### Administración BD (Adminer)

- **URL:** http://localhost:8080
- **Usuario:** postgres
- **Contraseña:** password
- **Servidor:** database

### Proxy Reverso (Nginx - Solo Producción)

- **Puerto HTTP:** 80
- **Puerto HTTPS:** 443
- **Configuración:** Rate limiting, compression, security headers

## 🔧 Comandos Útiles

### Gestión de Contenedores

```bash
# Iniciar servicios
make dev                    # Desarrollo
make prod                   # Producción

# Detener servicios
make stop                   # Todos los servicios
make prod-stop             # Solo producción

# Ver estado
make status                 # Estado de contenedores
make stats                  # Uso de recursos
```

### Base de Datos

```bash
# Solo base de datos
make db-up                  # Iniciar BD y Redis

# Backup
make db-backup             # Crear backup

# Reset (¡CUIDADO!)
make db-reset              # Eliminar todos los datos

# Acceso directo
make shell-db              # Consola PostgreSQL
```

### Logs

```bash
# Ver logs
make logs                  # Todos los servicios
make logs-backend          # Solo backend
make logs-frontend         # Solo frontend
make db-logs              # Solo base de datos
```

### Limpieza

```bash
make clean                 # Limpiar contenedores e imágenes
make clean-all            # Limpieza completa (¡ELIMINA DATOS!)
```

## 🔒 Seguridad

### Desarrollo

- Contraseñas por defecto
- CORS permisivo
- Debug habilitado
- Rate limiting relajado

### Producción

- Variables de entorno seguras
- HTTPS obligatorio
- Rate limiting estricto
- Logs de seguridad
- Headers de seguridad configurados

## 📊 Monitoreo

### Health Checks

Todos los servicios tienen health checks configurados:

```bash
# Ver salud de servicios
docker compose ps

# Health check manual
curl http://localhost:3000/health
curl http://localhost/health  # Producción
```

### Métricas

- PostgreSQL: pg_stat_statements habilitado
- Redis: INFO stats disponible
- Nginx: Access/error logs

## 🔄 Backup y Restauración

### Backup Automático (Producción)

```bash
# Crear backup manual
make db-backup

# Backups se guardan en ./database/backups/
# Retención: 30 días automática
```

### Restauración

```bash
# Desde backup comprimido
gunzip backup.sql.gz
docker compose exec database psql -U postgres -d erp_crm_db < backup.sql

# O usando script
docker compose exec database /scripts/restore.sh backup_file.sql.gz
```

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. Puerto ya en uso

```bash
# Cambiar puertos en docker-compose.yml
ports:
  - "5433:5432"  # PostgreSQL
  - "6380:6379"  # Redis
```

#### 2. Permisos en Windows

```bash
# En PowerShell como administrador
Set-ExecutionPolicy RemoteSigned
```

#### 3. Memoria insuficiente

```bash
# Aumentar memoria de Docker Desktop
# Settings > Resources > Memory: 4GB+
```

#### 4. Base de datos no inicia

```bash
# Ver logs detallados
docker compose logs database

# Verificar volúmenes
docker volume ls | grep postgres

# Reset completo si es necesario
make db-reset
```

### Comandos de Diagnóstico

```bash
# Verificar red
docker network inspect erp-crm-system_erp-crm-network

# Ver volúmenes
docker volume ls

# Estadísticas de contenedores
docker stats

# Inspeccionar servicios
docker compose config
```

## 🔧 Configuración Avanzada

### Variables de Entorno Importantes

```env
# Base de datos
DB_HOST=database
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=secure_password_here
DB_NAME=erp_crm_db

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=secure_redis_password

# Seguridad
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://yourdomain.com

# Recursos
DB_MAX_CONNECTIONS=200
REDIS_MAX_MEMORY=256mb
```

### Personalización de Nginx (Producción)

Editar `nginx/nginx.conf` para:

- Configurar SSL
- Ajustar rate limiting
- Configurar compresión
- Headers de seguridad personalizados

### Escalabilidad Horizontal

```yaml
# En docker-compose.prod.yml
backend:
  deploy:
    replicas: 3
  # Usar load balancer externo
```

## 📚 Referencias

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)
