// Constantes globales de la aplicación
// QUÉ HACE: Define todas las constantes de la aplicación
// PARA QUÉ:
// - API_CONFIG: URLs, endpoints, timeouts
// - UI_CONFIG: Dimensiones, breakpoints
// - STATUS: Estados de entities (activo, inactivo, etc.)
// - USER_ROLES: Roles de usuarios (admin, user, etc.)
// - CRM_CONFIG: Estados de leads, clientes, ventas
// - ERP_CONFIG: Estados de productos, pedidos, facturas
// - VALIDATION_RULES: Reglas de validación (email, teléfono, RFC)

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      REFRESH: "/auth/refresh",
      LOGOUT: "/auth/logout",
      PROFILE: "/auth/profile",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
    },
    USERS: {
      BASE: "/users",
      PROFILE: "/users/profile",
      AVATAR: "/users/avatar",
    },
    COMPANIES: {
      BASE: "/companies",
      CURRENT: "/companies/current",
    },
    CRM: {
      CUSTOMERS: "/crm/customers",
      LEADS: "/crm/leads",
      SALES: "/crm/sales",
      CONTACTS: "/crm/contacts",
    },
    ERP: {
      PRODUCTS: "/erp/products",
      INVENTORY: "/erp/inventory",
      ORDERS: "/erp/orders",
      INVOICES: "/erp/invoices",
      ACCOUNTING: "/erp/accounting",
    },
    REPORTS: "/reports",
    NOTIFICATIONS: "/notifications",
  },
};

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || "ERP/CRM System",
  VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  DESCRIPTION:
    import.meta.env.VITE_APP_DESCRIPTION || "Sistema ERP/CRM integral",
  ENVIRONMENT: import.meta.env.VITE_NODE_ENV || "development",
  DEBUG: import.meta.env.VITE_DEBUG === "true",
};

// UI Constants
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 256,
  SIDEBAR_COLLAPSED_WIDTH: 64,
  HEADER_HEIGHT: 64,
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    "2XL": 1536,
  },
};

// Pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: "dd/MM/yyyy",
  LONG: "dd 'de' MMMM 'de' yyyy",
  TIME: "HH:mm",
  DATETIME: "dd/MM/yyyy HH:mm",
  ISO: "yyyy-MM-dd",
};

// Status Constants
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  DRAFT: "draft",
};

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
  VIEWER: "viewer",
};

// CRM Constants
export const CRM_CONFIG = {
  LEAD_STATUS: {
    NEW: "new",
    CONTACTED: "contacted",
    QUALIFIED: "qualified",
    CONVERTED: "converted",
    LOST: "lost",
  },
  CUSTOMER_TYPES: {
    INDIVIDUAL: "individual",
    COMPANY: "company",
    GOVERNMENT: "government",
  },
  SALES_STAGES: {
    PROSPECTING: "prospecting",
    QUALIFICATION: "qualification",
    PROPOSAL: "proposal",
    NEGOTIATION: "negotiation",
    CLOSED_WON: "closed_won",
    CLOSED_LOST: "closed_lost",
  },
};

// ERP Constants
export const ERP_CONFIG = {
  PRODUCT_TYPES: {
    PHYSICAL: "physical",
    DIGITAL: "digital",
    SERVICE: "service",
  },
  ORDER_STATUS: {
    DRAFT: "draft",
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
  },
  INVOICE_STATUS: {
    DRAFT: "draft",
    SENT: "sent",
    PAID: "paid",
    OVERDUE: "overdue",
    CANCELLED: "cancelled",
  },
  PAYMENT_METHODS: {
    CASH: "cash",
    CREDIT_CARD: "credit_card",
    DEBIT_CARD: "debit_card",
    BANK_TRANSFER: "bank_transfer",
    CHECK: "check",
    OTHER: "other",
  },
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  TAX_ID: /^[A-Z]{4}\d{6}[A-Z\d]{3}$/, // RFC México
};

// File Upload
export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ["image/jpeg", "image/png", "image/webp"],
    DOCUMENTS: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    SPREADSHEETS: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
  LANGUAGE: "language",
  SIDEBAR_COLLAPSED: "sidebar_collapsed",
};
