export const DATABASE_CONSTANTS = {
  // Límites de paginación
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
  },

  // Configuración de índices
  INDEXES: {
    // Índices comunes para BaseEntity
    COMMON_INDEXES: ['created_at', 'updated_at', 'is_active', 'created_by'],

    // Índices de texto completo
    FULL_TEXT_INDEXES: ['name', 'description', 'email'],
  },

  // Configuración de constraints
  CONSTRAINTS: {
    // Longitudes máximas comunes
    EMAIL_MAX_LENGTH: 320,
    NAME_MAX_LENGTH: 255,
    DESCRIPTION_MAX_LENGTH: 1000,
    PHONE_MAX_LENGTH: 20,
    CODE_MAX_LENGTH: 50,
    URL_MAX_LENGTH: 2048,

    // Validaciones regex comunes
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
    UUID_REGEX:
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },

  // Configuración de tipos de datos
  DATA_TYPES: {
    // Tipos monetarios (usando decimal para precisión)
    MONEY: 'decimal(15,2)',
    PERCENTAGE: 'decimal(5,4)', // Para porcentajes con 4 decimales
    QUANTITY: 'decimal(12,4)', // Para cantidades con 4 decimales

    // Tipos de fecha
    TIMESTAMP: 'timestamp with time zone',
    DATE_ONLY: 'date',
    TIME_ONLY: 'time',

    // Tipos de texto
    SHORT_TEXT: 'varchar(255)',
    MEDIUM_TEXT: 'varchar(1000)',
    LONG_TEXT: 'text',
    JSON_DATA: 'jsonb',
  },

  // Configuración de enums comunes
  ENUMS: {
    USER_STATUS: ['active', 'inactive', 'pending', 'suspended'],
    USER_ROLE: ['super_admin', 'admin', 'manager', 'user'],
    RECORD_STATUS: ['draft', 'active', 'inactive', 'archived'],
    PRIORITY: ['low', 'medium', 'high', 'urgent'],
    APPROVAL_STATUS: ['pending', 'approved', 'rejected'],
  },

  // Configuración de tablas del sistema
  SYSTEM_TABLES: {
    AUDIT_LOGS: 'audit_logs',
    USER_SESSIONS: 'user_sessions',
    SYSTEM_SETTINGS: 'system_settings',
    EMAIL_QUEUE: 'email_queue',
    FILE_UPLOADS: 'file_uploads',
  },
};
