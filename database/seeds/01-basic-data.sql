-- =====================================================
-- ERP/CRM System - Basic Seed Data
-- =====================================================

-- Insert default company
INSERT INTO companies.companies (
    id,
    name,
    slug,
    email,
    phone,
    website,
    address,
    settings,
    status,
    subscription_plan,
    subscription_expires_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo Company',
    'demo-company',
    'admin@democompany.com',
    '+1-555-0123',
    'https://democompany.com',
    '{
        "street": "123 Business St",
        "city": "Business City",
        "state": "BC",
        "country": "US",
        "postal_code": "12345"
    }'::jsonb,
    '{
        "currency": "USD",
        "timezone": "America/New_York",
        "date_format": "MM/DD/YYYY",
        "fiscal_year_start": "01-01"
    }'::jsonb,
    'active',
    'premium',
    NOW() + INTERVAL '1 year'
) ON CONFLICT (id) DO NOTHING;

-- Insert super admin user
INSERT INTO auth.users (
    id,
    company_id,
    email,
    password_hash,
    first_name,
    last_name,
    phone,
    role,
    status,
    email_verified_at,
    settings
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin@democompany.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewAx2v7QP9YJ.q5K', -- password: admin123
    'System',
    'Administrator',
    '+1-555-0123',
    'super_admin',
    'active',
    NOW(),
    '{
        "theme": "light",
        "language": "en",
        "notifications": {
            "email": true,
            "push": true
        }
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Insert demo manager user
INSERT INTO auth.users (
    id,
    company_id,
    email,
    password_hash,
    first_name,
    last_name,
    phone,
    role,
    status,
    email_verified_at
) VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'manager@democompany.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewAx2v7QP9YJ.q5K', -- password: admin123
    'John',
    'Manager',
    '+1-555-0124',
    'manager',
    'active',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert demo employee user
INSERT INTO auth.users (
    id,
    company_id,
    email,
    password_hash,
    first_name,
    last_name,
    phone,
    role,
    status,
    email_verified_at
) VALUES (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'employee@democompany.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewAx2v7QP9YJ.q5K', -- password: admin123
    'Jane',
    'Employee',
    '+1-555-0125',
    'employee',
    'active',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Log seed execution
INSERT INTO audit.activity_logs (
    entity_type,
    action,
    new_values,
    ip_address,
    created_at
) VALUES (
    'database',
    'SEED',
    '{
        "message": "Basic seed data inserted",
        "companies": 1,
        "users": 3
    }'::jsonb,
    '127.0.0.1',
    NOW()
);

-- Display seed completion message
DO $$
BEGIN
    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE 'Default company: Demo Company';
    RAISE NOTICE 'Super Admin: admin@democompany.com / admin123';
    RAISE NOTICE 'Manager: manager@democompany.com / admin123';
    RAISE NOTICE 'Employee: employee@democompany.com / admin123';
END $$;