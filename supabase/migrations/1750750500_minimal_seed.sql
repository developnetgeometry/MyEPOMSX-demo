-- ============================================================================
-- EPOMS-X Database Minimal Seeder
-- This file seeds the database with basic required data
-- ============================================================================

-- Disable triggers temporarily for faster inserts
SET session_replication_role = 'replica';

-- ============================================================================
-- 1. USER TYPES
-- ============================================================================

-- Insert User Types (matching actual schema with created_when)
INSERT INTO public.user_type (id, name, description, is_active, created_when) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Admin', 'System Administrator', true, now()),
('550e8400-e29b-41d4-a716-446655440002', 'Engineer', 'Maintenance Engineer', true, now()),
('550e8400-e29b-41d4-a716-446655440003', 'Technician', 'Field Technician', true, now()),
('550e8400-e29b-41d4-a716-446655440004', 'Supervisor', 'Maintenance Supervisor', true, now()),
('550e8400-e29b-41d4-a716-446655440005', 'Planner', 'Maintenance Planner', true, now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. CLIENTS
-- ============================================================================

-- Insert Clients (with required code field)
INSERT INTO public.e_client (code, name, type, created_at) VALUES
('PETRONAS', 'PETRONAS', 'Oil & Gas', now()),
('EXXON', 'ExxonMobil', 'Oil & Gas', now()),
('SHELL', 'Shell', 'Oil & Gas', now()),
('TOTAL', 'TotalEnergies', 'Oil & Gas', now()),
('CHEVRON', 'Chevron', 'Oil & Gas', now())
ON CONFLICT (code) DO NOTHING;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Commit the transaction
COMMIT;
