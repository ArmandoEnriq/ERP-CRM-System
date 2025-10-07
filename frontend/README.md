# 🎨 ERP/CRM Frontend

Frontend del sistema ERP/CRM construido con React, Vite y Tailwind CSS v4.

## 🚀 Stack Tecnológico

- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **React Router v6** - Navegación
- **Zustand** - Estado global
- **Axios** - Cliente HTTP
- **React Hook Form** - Gestión de formularios
- **Yup** - Validación de esquemas
- **Tailwind CSS v4** - Estilos
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones
- **Date-fns** - Manejo de fechas

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env.development

# Configurar variables de entorno
# Editar .env.development con la URL de tu backend
```

## 🏃 Ejecución

```bash
# Modo desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview
```

## 📁 Estructura de Carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes UI base
│   ├── layout/         # Componentes de layout
│   └── auth/           # Componentes de autenticación
├── pages/              # Páginas de la aplicación
│   ├── auth/           # Páginas de autenticación
│   └── dashboard/      # Páginas del dashboard
├── services/           # Servicios API
├── store/              # Estado global (Zustand)
├── hooks/              # Custom hooks
├── utils/              # Utilidades y helpers
├── styles/             # Estilos globales
├── assets/             # Recursos estáticos
├── routes.jsx          # Configuración de rutas
├── App.jsx             # Componente principal
└── main.jsx            # Entry point
```

## 🔑 Variables de Entorno

```bash
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_APP_NAME=ERP/CRM System
```

## 🎨 Componentes UI Disponibles

- **Button** - Botones con variantes
- **Input** - Inputs con validación
- **Select** - Selects personalizados
- **Badge** - Etiquetas de estado
- **Card** - Tarjetas de contenido
- **Modal** - Modales y diálogos
- **Spinner** - Indicadores de carga

## 🛣️ Rutas Principales

- `/login` - Inicio de sesión
- `/register` - Registro
- `/dashboard` - Panel principal
- `/users` - Gestión de usuarios
- `/companies` - Gestión de empresas
- `/profile` - Perfil de usuario
- `/settings` - Configuración

## 🔐 Autenticación

El sistema utiliza JWT tokens con las siguientes características:

- Access Token (7 días)
- Refresh Token (30 días)
- Renovación automática de tokens
- Protección de rutas por roles
- Persistencia en localStorage

## 🎯 Estado Global (Zustand)

### Auth Store

```javascript
-user - isAuthenticated - login() - logout() - register() - updateProfile();
```

### UI Store

```javascript
-sidebarOpen - theme - toggleSidebar() - setPageTitle();
```

## 📱 Responsive Design

La aplicación está optimizada para:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🚧 Desarrollo

### Agregar nueva página

1. Crear componente en `src/pages/`
2. Agregar ruta en `src/routes.jsx`
3. Actualizar sidebar en `src/utils/constants.js`

### Agregar nuevo servicio API

1. Crear servicio en `src/services/`
2. Importar y usar en componentes

### Agregar nuevo componente UI

1. Crear en `src/components/ui/`
2. Exportar desde index si es necesario

## 🔧 Tailwind CSS v4

Esta aplicación usa Tailwind CSS v4 con la nueva configuración:

```bash
npm install tailwindcss@next @tailwindcss/vite
```

En `vite.config.js`:

```javascript
import tailwindcss from "@tailwindcss/vite";

export default {
  plugins: [tailwindcss()],
};
```

En `src/styles/index.css`:

```css
@import "tailwindcss";
```

## 📝 Notas Importantes

- Los tokens se almacenan en localStorage
- Las sesiones expiran automáticamente
- Los errores se manejan globalmente con interceptors
- Las notificaciones usan react-hot-toast

## 🐛 Debugging

```bash
# Ver logs en consola
VITE_ENABLE_DEBUG=true npm run dev

# Build con sourcemaps
npm run build -- --sourcemap
```

## 📄 Licencia

Propiedad de ERP/CRM System © 2025
