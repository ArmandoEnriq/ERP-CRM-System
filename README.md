# ERP/CRM System

Sistema ERP/CRM Full-Stack desarrollado con NestJS y React.

## Tecnologías

### Backend

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand

### DevOps

- Docker
- Docker Compose
- Nginx

## Instalación

```bash
# Clonar repositorio
git clone [URL_REPO]
cd erp-crm-system

# Instalar dependencias
npm run setup

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

## Estructura del Proyecto

```
erp-crm-system/
├── backend/          # API NestJS
├── frontend/         # App React
├── database/         # Scripts DB
├── docker/          # Configuraciones Docker
└── docs/            # Documentación
```

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run test` - Ejecutar tests
- `npm run docker:dev` - Ejecutar con Docker (desarrollo)

## Documentación

- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Development Guide](docs/DEVELOPMENT.md)

## Licencia

MIT
