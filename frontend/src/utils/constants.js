// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const API_VERSION = import.meta.env.VITE_API_VERSION || "v1";
export const API_BASE_URL = `${API_URL}/api/`;

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || "ERP/CRM System";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";

// Auth Configuration
export const TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user_data";
export const SESSION_TIMEOUT = parseInt(
  import.meta.env.VITE_SESSION_TIMEOUT || "30"
);
export const MAX_LOGIN_ATTEMPTS = parseInt(
  import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || "5"
);

// Pagination
export const DEFAULT_PAGE_SIZE = parseInt(
  import.meta.env.VITE_DEFAULT_PAGE_SIZE || "10"
);
export const MAX_PAGE_SIZE = parseInt(
  import.meta.env.VITE_MAX_PAGE_SIZE || "100"
);
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// User Roles
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Administrador",
  [ROLES.ADMIN]: "Administrador",
  [ROLES.MANAGER]: "Gerente",
  [ROLES.USER]: "Usuario",
};

export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 4,
  [ROLES.ADMIN]: 3,
  [ROLES.MANAGER]: 2,
  [ROLES.USER]: 1,
};

// User Status
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  SUSPENDED: "suspended",
};

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: "Activo",
  [USER_STATUS.INACTIVE]: "Inactivo",
  [USER_STATUS.PENDING]: "Pendiente",
  [USER_STATUS.SUSPENDED]: "Suspendido",
};

export const USER_STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: "success",
  [USER_STATUS.INACTIVE]: "gray",
  [USER_STATUS.PENDING]: "warning",
  [USER_STATUS.SUSPENDED]: "danger",
};

// Company Status
export const COMPANY_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  TRIAL: "trial",
};

export const COMPANY_STATUS_LABELS = {
  [COMPANY_STATUS.ACTIVE]: "Activa",
  [COMPANY_STATUS.INACTIVE]: "Inactiva",
  [COMPANY_STATUS.SUSPENDED]: "Suspendida",
  [COMPANY_STATUS.TRIAL]: "Prueba",
};

export const COMPANY_STATUS_COLORS = {
  [COMPANY_STATUS.ACTIVE]: "success",
  [COMPANY_STATUS.INACTIVE]: "gray",
  [COMPANY_STATUS.SUSPENDED]: "danger",
  [COMPANY_STATUS.TRIAL]: "info",
};

// Company Sizes
export const COMPANY_SIZES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  ENTERPRISE: "enterprise",
};

export const COMPANY_SIZE_LABELS = {
  [COMPANY_SIZES.SMALL]: "Pequeña (1-10 empleados)",
  [COMPANY_SIZES.MEDIUM]: "Mediana (11-50 empleados)",
  [COMPANY_SIZES.LARGE]: "Grande (51-200 empleados)",
  [COMPANY_SIZES.ENTERPRISE]: "Empresa (200+ empleados)",
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: "free",
  BASIC: "basic",
  PROFESSIONAL: "professional",
  ENTERPRISE: "enterprise",
};

export const PLAN_LABELS = {
  [SUBSCRIPTION_PLANS.FREE]: "Gratuito",
  [SUBSCRIPTION_PLANS.BASIC]: "Básico",
  [SUBSCRIPTION_PLANS.PROFESSIONAL]: "Profesional",
  [SUBSCRIPTION_PLANS.ENTERPRISE]: "Empresarial",
};

export const PLAN_PRICES = {
  [SUBSCRIPTION_PLANS.FREE]: 0,
  [SUBSCRIPTION_PLANS.BASIC]: 499,
  [SUBSCRIPTION_PLANS.PROFESSIONAL]: 999,
  [SUBSCRIPTION_PLANS.ENTERPRISE]: 2499,
};

export const PLAN_MAX_USERS = {
  [SUBSCRIPTION_PLANS.FREE]: 3,
  [SUBSCRIPTION_PLANS.BASIC]: 10,
  [SUBSCRIPTION_PLANS.PROFESSIONAL]: 50,
  [SUBSCRIPTION_PLANS.ENTERPRISE]: 999,
};

// Date Formats
export const DATE_FORMAT = "dd/MM/yyyy";
export const DATETIME_FORMAT = "dd/MM/yyyy HH:mm";
export const TIME_FORMAT = "HH:mm";

// Toast Configuration
export const TOAST_DURATION = 3000;
export const TOAST_POSITION = "top-right";

// Table Configuration
export const DEFAULT_SORT_DIRECTION = "DESC";
export const DEBOUNCE_DELAY = 300;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  spreadsheets: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  all: ["*"],
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Error de conexión. Verifica tu internet.",
  UNAUTHORIZED: "No tienes autorización para realizar esta acción.",
  SESSION_EXPIRED:
    "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
  SERVER_ERROR: "Error del servidor. Intenta más tarde.",
  VALIDATION_ERROR: "Por favor, verifica los datos ingresados.",
  NOT_FOUND: "El recurso solicitado no fue encontrado.",
  RATE_LIMIT: "Demasiadas solicitudes. Por favor, espera un momento.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Inicio de sesión exitoso",
  LOGOUT: "Sesión cerrada correctamente",
  CREATED: "Registro creado exitosamente",
  UPDATED: "Registro actualizado exitosamente",
  DELETED: "Registro eliminado exitosamente",
  PASSWORD_CHANGED: "Contraseña cambiada exitosamente",
  EMAIL_SENT: "Correo enviado exitosamente",
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  RFC_PATTERN: /^([A-ZÑ&]{3,4}\d{6}[A-Z\d]{3})$/,
  PHONE_PATTERN: /^(\+\d{1,3}[- ]?)?\d{10}$/,
  POSTAL_CODE_PATTERN: /^\d{5}$/,
};

// Navigation
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",

  // Users
  USERS: "/users",
  USER_DETAIL: "/users/:id",
  USER_CREATE: "/users/new",

  // Companies
  COMPANIES: "/companies",
  COMPANY_DETAIL: "/companies/:id",
  COMPANY_CREATE: "/companies/new",

  // CRM
  CRM_CUSTOMERS: "/crm/customers",
  CRM_LEADS: "/crm/leads",
  CRM_SALES: "/crm/sales",

  // ERP
  ERP_PRODUCTS: "/erp/products",
  ERP_INVENTORY: "/erp/inventory",
  ERP_ORDERS: "/erp/orders",
  ERP_INVOICES: "/erp/invoices",

  // Reports
  REPORTS: "/reports",
};

// Sidebar Navigation Items
export const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    icon: "LayoutDashboard",
    path: ROUTES.DASHBOARD,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
  },
  {
    label: "Usuarios",
    icon: "Users",
    path: ROUTES.USERS,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Empresas",
    icon: "Building2",
    path: ROUTES.COMPANIES,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    label: "CRM",
    icon: "Contact",
    children: [
      {
        label: "Clientes",
        path: ROUTES.CRM_CUSTOMERS,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
      },
      {
        label: "Leads",
        path: ROUTES.CRM_LEADS,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
      },
      {
        label: "Ventas",
        path: ROUTES.CRM_SALES,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
    ],
  },
  {
    label: "ERP",
    icon: "Package",
    children: [
      {
        label: "Productos",
        path: ROUTES.ERP_PRODUCTS,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        label: "Inventario",
        path: ROUTES.ERP_INVENTORY,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        label: "Pedidos",
        path: ROUTES.ERP_ORDERS,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
      },
      {
        label: "Facturas",
        path: ROUTES.ERP_INVOICES,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
    ],
  },
  {
    label: "Reportes",
    icon: "BarChart3",
    path: ROUTES.REPORTS,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: "Configuración",
    icon: "Settings",
    path: ROUTES.SETTINGS,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
];
