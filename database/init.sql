-- =====================================================
-- Sistema ERP/CRM - Script de Inicialización de Base de Datos
-- Configuramos la bse de datos postgres para el proyecto
-- =====================================================

-- Configura la zona horaria y la codificación de caracteres de la sesión
SET timezone = 'UTC'; -- Para la sesión actual usaremos la zona horaria UTC
SET client_encoding = 'UTF8'; -- Para la sesión actual usaremos la codificación UTF8

-- Crea extensiones útiles si no existen:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- Extensión para generación de UUIDs (ids únicos 550e8400-e29b-41d4-a716-446655440000 )
CREATE EXTENSION IF NOT EXISTS "citext";    -- Extensión para hacer texto insensible a mayúsculas/minúsculas (Ejemplo: 'Hola' = 'hola' devuelve true)
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";    -- Extensión para monitoreo de consultas SQL y métricas de consultas para monitoreo ver el rendimiento
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- Extensión para hacer búsqueda por similitud de texto (ejemplo posgress=posgrass)

-- =====================================================
-- CREACIÓN DE ESQUEMAS (Sudbases de datos ejemplo auth.jefes, auth.empleados, etc.)
-- =====================================================

CREATE SCHEMA IF NOT EXISTS auth;      -- Autenticación y usuarios
CREATE SCHEMA IF NOT EXISTS companies; -- Empresas y datos generales
CREATE SCHEMA IF NOT EXISTS crm;       -- Módulo de gestión de clientes
CREATE SCHEMA IF NOT EXISTS erp;       -- Módulo de operaciones/ERP
CREATE SCHEMA IF NOT EXISTS reports;   -- Reportes y analítica
CREATE SCHEMA IF NOT EXISTS audit;     -- Auditoría y bitácora de acciones

-- =====================================================
-- CREACIÓN DE TIPOS PERSONALIZADOS
-- =====================================================

-- Enum de roles de usuario
DO $$ BEGIN -- bloque de pl/pgsql 
    CREATE TYPE user_role AS ENUM ( -- Creamos un nuevo tipo de dato llamado user_role con las siguientes opciones
        'super_admin',  -- Control total del sistema
        'admin',        -- Admin de empresa
        'manager',      -- Responsable de un equipo o área
        'employee',     -- Usuario normal
        'viewer'        -- Solo lectura
    );
EXCEPTION -- manejo de errores
    WHEN duplicate_object THEN null; -- si el tipo de dato ya existe, no hacemos nada
END $$; -- fin del bloque

-- Enum de estado de usuario
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ( -- Creamos un nuevo tipo de dato llamado user_status con las siguientes opciones
        'active',    -- Usuario activo
        'inactive',  -- Usuario deshabilitado
        'pending',   -- Aún no ha activado su cuenta
        'suspended'  -- Bloqueado por el sistema
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum de estado de empresa
DO $$ BEGIN 
    CREATE TYPE company_status AS ENUM ( -- Creamos un nuevo tipo de dato llamado company_status con las siguientes opciones
        'active',    -- Empresa activa
        'inactive',  -- Empresa deshabilitada
        'trial',     -- Periodo de prueba
        'suspended'  -- Suspendida por incumplimiento
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum de estado de lead (oportunidad de venta)
DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ( -- Creamos un nuevo tipo de dato llamado lead_status con las siguientes opciones
        'new',           -- Recién creado
        'contacted',     -- Contactado
        'qualified',     -- Validado como oportunidad real
        'proposal',      -- Se le envió propuesta
        'negotiation',   -- En negociación
        'closed_won',    -- Venta cerrada con éxito
        'closed_lost'    -- Venta perdida
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum de estado de orden/pedido
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ( -- Creamos un nuevo tipo de dato llamado order_status con las siguientes opciones
        'draft',      -- Borrador, aún no confirmado
        'pending',    -- Esperando aprobación o pago
        'confirmed',  -- Confirmado
        'processing', -- En preparación
        'shipped',    -- Enviado
        'delivered',  -- Entregado
        'cancelled',  -- Cancelado
        'returned'    -- Devuelto
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum de estado de pago
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ( -- Creamos un nuevo tipo de dato llamado payment_status con las siguientes opciones
        'pending',   -- Aún no pagado
        'paid',      -- Pagado completamente
        'partial',   -- Pagado parcialmente
        'overdue',   -- Vencido
        'cancelled'  -- Cancelado
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- TABLAS DE AUDITORÍA
-- =====================================================

CREATE TABLE IF NOT EXISTS audit.activity_logs ( -- Creamos la tabla activity_logs en audit solo si no existe
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- identificador unico UUID
    user_id UUID,                       -- Usuario que realizó la acción
    company_id UUID,                    -- Empresa en la que ocurrió
    entity_type VARCHAR(100) NOT NULL,  -- Ej. 'users', 'orders'
    entity_id UUID,                     -- ID del registro afectado
    action VARCHAR(50) NOT NULL,        -- INSERT, UPDATE, DELETE
    old_values JSONB,                   -- Valores antes del cambio
    new_values JSONB,                   -- Valores después del cambio
    ip_address INET,                    -- IP de quien hizo la acción
    user_agent TEXT,                    -- Navegador/dispositivo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON audit.activity_logs(user_id); -- Hara que busque por la columna user_id y no toda la tabla
CREATE INDEX IF NOT EXISTS idx_activity_logs_company_id ON audit.activity_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON audit.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON audit.activity_logs(created_at);

-- =====================================================
-- TABLAS DEL ESQUEMA DE EMPRESAS
-- =====================================================

CREATE TABLE IF NOT EXISTS companies.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,  -- Nombre amigable para URL
    email CITEXT UNIQUE,
    phone VARCHAR(50),
    website VARCHAR(255),
    tax_id VARCHAR(100),                -- RFC o número fiscal
    address JSONB,                      -- Dirección en formato JSON
    logo_url VARCHAR(500),
    settings JSONB DEFAULT '{}',        -- Configuración personalizada
    status company_status DEFAULT 'trial',
    subscription_plan VARCHAR(50) DEFAULT 'basic',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies.companies(slug); -- Si se busca por slug, no se busca toda la tabla solo en la columna slug
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies.companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_subscription ON companies.companies(subscription_plan);

-- =====================================================
-- TABLAS DEL ESQUEMA DE AUTENTICACIÓN
-- =====================================================

CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies.companies(id) ON DELETE CASCADE,
    email CITEXT UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    avatar_url VARCHAR(500),
    role user_role DEFAULT 'employee',
    status user_status DEFAULT 'pending',
    settings JSONB DEFAULT '{}',
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS auth.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance en autenticación
CREATE INDEX IF NOT EXISTS idx_users_company_id ON auth.users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON auth.users(status);

-- =====================================================
-- TRIGGERS (comando que se ejecuta despues de una accion) PARA updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ -- Funcion que sera usada por el trigger
BEGIN
    NEW.updated_at = NOW(); -- Actualizamos el campo updated_at por la fecha y hora actual
    RETURN NEW;
END;
$$ language 'plpgsql'; -- le decimos que es un lenguaje de programación

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies.companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); -- cada que se actualice una empresa, se llama a la funcion update_updated_at_column para actualizar el campo updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); -- aqui cada que se actualice un usuario
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON auth.user_sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); -- aqui cada que se actualice una sesion

-- =====================================================
-- PERMISOS Y SEGURIDAD
-- =====================================================

DO
$do$
BEGIN -- Creamos un usuario especial llamado que se podra usar para el acceso a la base de datos
IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'erp_crm_app') THEN
      CREATE ROLE erp_crm_app LOGIN PASSWORD 'app_password_change_in_production';
   END IF;
END
$do$;

GRANT CONNECT ON DATABASE erp_crm_db TO erp_crm_app; -- le damos permiso para conectarse a la base de datos
GRANT USAGE ON SCHEMA auth, companies, crm, erp, reports, audit TO erp_crm_app; -- le damos permiso para ver las tablas de los esquemas
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth, companies, crm, erp, reports, audit TO erp_crm_app; -- le damos permiso (select, insert, update, delete) para todas las tablas
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth, companies, crm, erp, reports, audit TO erp_crm_app; -- le damos los mismos permisos para las secuencias

ALTER DEFAULT PRIVILEGES IN SCHEMA auth, companies, crm, erp, reports, audit GRANT ALL ON TABLES TO erp_crm_app; -- si se llega a crear una nueva tabla, le damos los mismos permisos
ALTER DEFAULT PRIVILEGES IN SCHEMA auth, companies, crm, erp, reports, audit GRANT ALL ON SEQUENCES TO erp_crm_app; -- si se llega a crear una nueva secuencia, le damos los mismos permisos

-- =====================================================
-- OPTIMIZACIONES DE RENDIMIENTO
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- Monitorea consultas para detectar lentas
SELECT pg_reload_conf(); -- Recarga configuración de PostgreSQL
COMMENT ON DATABASE erp_crm_db IS 'Base de datos del sistema ERP/CRM - Preparada para producción';

