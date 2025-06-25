-- ============================================================================
-- EPOMS-X Database Seeder
-- This file seeds the database with initial master data and sample records
-- ============================================================================

-- Disable triggers temporarily for faster inserts
SET session_replication_role = 'replica';

-- ============================================================================
-- 1. USER TYPES AND AUTHENTICATION SETUP
-- ============================================================================

-- Insert User Types
INSERT INTO public.user_type (id, name, description, is_active, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Admin', 'System Administrator', true, now()),
('550e8400-e29b-41d4-a716-446655440002', 'Engineer', 'Maintenance Engineer', true, now()),
('550e8400-e29b-41d4-a716-446655440003', 'Technician', 'Field Technician', true, now()),
('550e8400-e29b-41d4-a716-446655440004', 'Supervisor', 'Maintenance Supervisor', true, now()),
('550e8400-e29b-41d4-a716-446655440005', 'Planner', 'Maintenance Planner', true, now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. CLIENT AND PROJECT SETUP
-- ============================================================================

-- Insert Clients
INSERT INTO public.e_client (id, name, created_at) VALUES
(1, 'PETRONAS', now()),
(2, 'ExxonMobil', now()),
(3, 'Shell', now()),
(4, 'TotalEnergies', now()),
(5, 'Chevron', now())
ON CONFLICT (id) DO NOTHING;

-- Insert Project Types
INSERT INTO public.e_project_type (name, created_at) VALUES
('Oil & Gas Production'),
('Refinery Operations'),
('Petrochemical Plant'),
('LNG Terminal'),
('Offshore Platform')
ON CONFLICT (name) DO NOTHING;

-- Insert Projects
INSERT INTO public.e_project (id, project_name, project_code, client_id, project_type, start_date, end_date, is_active, created_at) VALUES
(1, 'Kimanis Gas Terminal', 'KGT-2024', 1, 1, '2024-01-01', '2026-12-31', true, now()),
(2, 'Melaka Refinery Upgrade', 'MRU-2024', 1, 2, '2024-03-01', '2025-12-31', true, now()),
(3, 'Pengerang Integrated Complex', 'PIC-2024', 1, 3, '2024-02-01', '2027-06-30', true, now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. FACILITIES AND LOCATIONS
-- ============================================================================

-- Insert Facilities
INSERT INTO public.e_facility (id, location_code, location_name, address, is_active, project_id, created_at) VALUES
(1, 'KGT-MAIN', 'Kimanis Gas Terminal - Main Area', 'Kimanis, Sabah, Malaysia', true, 1, now()),
(2, 'KGT-UTIL', 'Kimanis Gas Terminal - Utilities', 'Kimanis, Sabah, Malaysia', true, 1, now()),
(3, 'MRU-PROC', 'Melaka Refinery - Process Unit', 'Melaka, Malaysia', true, 2, now()),
(4, 'PIC-AROM', 'Pengerang - Aromatics Complex', 'Pengerang, Johor, Malaysia', true, 3, now()),
(5, 'PIC-OLEF', 'Pengerang - Olefins Complex', 'Pengerang, Johor, Malaysia', true, 3, now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. SYSTEMS AND PACKAGES
-- ============================================================================

-- Insert Systems
INSERT INTO public.e_system (id, facility_id, system_code, system_no, system_name, is_active, created_at) VALUES
(1, 1, 'SYS-01', '01', 'Gas Reception System', true, now()),
(2, 1, 'SYS-02', '02', 'Gas Processing System', true, now()),
(3, 1, 'SYS-03', '03', 'Compression System', true, now()),
(4, 2, 'SYS-04', '04', 'Power Generation System', true, now()),
(5, 2, 'SYS-05', '05', 'Water Treatment System', true, now()),
(6, 3, 'SYS-06', '06', 'Crude Distillation Unit', true, now()),
(7, 4, 'SYS-07', '07', 'Benzene Production Unit', true, now()),
(8, 5, 'SYS-08', '08', 'Ethylene Cracker Unit', true, now())
ON CONFLICT (id) DO NOTHING;

-- Insert Package Types
INSERT INTO public.e_package_type (name, created_at) VALUES
('Mechanical Package'),
('Electrical Package'),
('Instrumentation Package'),
('Piping Package'),
('Civil Package')
ON CONFLICT (name) DO NOTHING;

-- Insert Packages
INSERT INTO public.e_package (id, system_id, package_code, package_name, package_type_id, is_active, created_at) VALUES
(1, 1, 'PKG-01A', 'Gas Metering Package A', 3, true, now()),
(2, 1, 'PKG-01B', 'Gas Separator Package B', 1, true, now()),
(3, 2, 'PKG-02A', 'Dehydration Package', 1, true, now()),
(4, 3, 'PKG-03A', 'Compressor Package A', 1, true, now()),
(5, 3, 'PKG-03B', 'Compressor Package B', 1, true, now()),
(6, 4, 'PKG-04A', 'Generator Package A', 2, true, now()),
(7, 5, 'PKG-05A', 'Water Treatment Package', 1, true, now()),
(8, 6, 'PKG-06A', 'Distillation Column Package', 1, true, now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. ASSET MASTER DATA
-- ============================================================================

-- Insert Asset Areas
INSERT INTO public.e_asset_area (name, created_at) VALUES
('Process Area'),
('Utilities Area'),
('Storage Area'),
('Control Room'),
('Maintenance Workshop'),
('Administration Area'),
('Safety Area'),
('Loading/Unloading Area')
ON CONFLICT (name) DO NOTHING;

-- Insert Asset Category Groups
INSERT INTO public.e_asset_category_group (name, created_at) VALUES
('Rotating Equipment'),
('Static Equipment'),
('Electrical Equipment'),
('Instrumentation'),
('Safety Systems'),
('Civil Structures')
ON CONFLICT (name) DO NOTHING;

-- Insert Asset Categories
INSERT INTO public.e_asset_category (name, asset_category_group_id, created_at) VALUES
-- Rotating Equipment
('Centrifugal Pumps', 1, now()),
('Reciprocating Pumps', 1, now()),
('Centrifugal Compressors', 1, now()),
('Reciprocating Compressors', 1, now()),
('Gas Turbines', 1, now()),
('Electric Motors', 1, now()),
('Fans and Blowers', 1, now()),
-- Static Equipment
('Pressure Vessels', 2, now()),
('Heat Exchangers', 2, now()),
('Storage Tanks', 2, now()),
('Piping Systems', 2, now()),
('Valves', 2, now()),
('Filters', 2, now()),
-- Electrical Equipment
('Transformers', 3, now()),
('Switchgear', 3, now()),
('Control Panels', 3, now()),
('Emergency Generators', 3, now()),
-- Instrumentation
('Flow Meters', 4, now()),
('Pressure Transmitters', 4, now()),
('Temperature Sensors', 4, now()),
('Level Indicators', 4, now()),
('Control Valves', 4, now()),
-- Safety Systems
('Fire Detection Systems', 5, now()),
('Gas Detection Systems', 5, now()),
('Emergency Shutdown Systems', 5, now()),
('Safety Relief Valves', 5, now())
ON CONFLICT (name) DO NOTHING;

-- Insert Asset Type Groups
INSERT INTO public.e_asset_type_group (name, created_at) VALUES
('Pumps'),
('Compressors'),
('Vessels'),
('Heat Transfer'),
('Instrumentation'),
('Electrical'),
('Safety')
ON CONFLICT (name) DO NOTHING;

-- Insert Asset Types
INSERT INTO public.e_asset_type (name, asset_category_id, asset_type_group_id, created_at) VALUES
-- Pumps
('Centrifugal Pump - Single Stage', 1, 1, now()),
('Centrifugal Pump - Multi Stage', 1, 1, now()),
('Reciprocating Pump - Triplex', 2, 1, now()),
('Reciprocating Pump - Quintuplex', 2, 1, now()),
-- Compressors
('Centrifugal Compressor - Single Stage', 3, 2, now()),
('Centrifugal Compressor - Multi Stage', 3, 2, now()),
('Reciprocating Compressor - Double Acting', 4, 2, now()),
('Screw Compressor', 4, 2, now()),
-- Vessels
('Vertical Pressure Vessel', 8, 3, now()),
('Horizontal Pressure Vessel', 8, 3, now()),
('Separator Vessel', 8, 3, now()),
-- Heat Transfer
('Shell and Tube Heat Exchanger', 9, 4, now()),
('Plate Heat Exchanger', 9, 4, now()),
('Air Cooled Heat Exchanger', 9, 4, now())
ON CONFLICT (name) DO NOTHING;

-- Insert Asset Status
INSERT INTO public.e_asset_status (name, is_active, created_at) VALUES
('Operational', true, now()),
('Under Maintenance', true, now()),
('Out of Service', true, now()),
('Decommissioned', true, now()),
('Standby', true, now()),
('Testing', true, now())
ON CONFLICT (name) DO NOTHING;

-- Insert Asset Tags
INSERT INTO public.e_asset_tag (name, is_active, created_at) VALUES
('Critical Equipment', true, now()),
('Safety Critical', true, now()),
('High Priority', true, now()),
('Standard', true, now()),
('Low Priority', true, now()),
('Spare Equipment', true, now())
ON CONFLICT (name) DO NOTHING;

-- Insert Asset Classes
INSERT INTO public.e_asset_class (name, created_at) VALUES
('Class A - Critical'),
('Class B - Important'),
('Class C - Standard'),
('Class D - Minor')
ON CONFLICT (name) DO NOTHING;

-- Insert Manufacturers
INSERT INTO public.e_manufacturer (name, created_at) VALUES
('Flowserve'),
('KSB'),
('Grundfos'),
('Sulzer'),
('Weir'),
('Atlas Copco'),
('Ingersoll Rand'),
('Siemens'),
('ABB'),
('Schneider Electric'),
('Emerson'),
('Honeywell'),
('Yokogawa'),
('Endress+Hauser'),
('Rosemount'),
('Fisher'),
('Cameron'),
('Baker Hughes'),
('Schlumberger'),
('Halliburton')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 6. SAMPLE ASSETS
-- ============================================================================

-- Insert Sample Assets with Details
-- First, insert basic asset records
INSERT INTO public.e_asset (id, facility_id, system_id, package_id, asset_no, asset_name, asset_tag_id, status_id, commission_date, is_active, created_at) VALUES
(1, 1, 1, 1, 'P-101A', 'Main Gas Booster Pump A', 2, 1, '2024-06-01', true, now()),
(2, 1, 1, 1, 'P-101B', 'Main Gas Booster Pump B', 2, 5, '2024-06-01', true, now()),
(3, 1, 2, 3, 'C-201A', 'Gas Dehydration Compressor A', 2, 1, '2024-07-15', true, now()),
(4, 1, 3, 4, 'C-301A', 'Main Gas Compressor A', 1, 1, '2024-08-01', true, now()),
(5, 1, 3, 5, 'C-301B', 'Main Gas Compressor B', 1, 5, '2024-08-01', true, now()),
(6, 2, 4, 6, 'G-401A', 'Emergency Generator A', 2, 1, '2024-05-15', true, now()),
(7, 2, 5, 7, 'V-501A', 'Water Storage Tank A', 4, 1, '2024-04-01', true, now()),
(8, 3, 6, 8, 'T-601A', 'Crude Distillation Tower', 1, 1, '2024-09-01', true, now()),
(9, 1, 1, 2, 'V-102A', 'Gas Separator Vessel A', 2, 1, '2024-06-15', true, now()),
(10, 1, 1, 2, 'V-102B', 'Gas Separator Vessel B', 2, 1, '2024-06-15', true, now())
ON CONFLICT (id) DO NOTHING;

-- Insert Asset Details
INSERT INTO public.e_asset_detail (id, asset_id, category_id, type_id, manufacturer_id, model, serial_number, area_id, asset_class_id, specification, is_integrity, is_reliability, is_active, created_at) VALUES
-- Pumps
(1, 1, 1, 1, 1, 'VSC-200', 'FSV-2024-001', 1, 1, 'Centrifugal pump, 50 m3/h, 150 bar', true, true, true, now()),
(2, 2, 1, 1, 1, 'VSC-200', 'FSV-2024-002', 1, 1, 'Centrifugal pump, 50 m3/h, 150 bar', true, true, true, now()),
-- Compressors
(3, 3, 3, 5, 6, 'ZR-315', 'AC-2024-001', 1, 1, 'Centrifugal compressor, 1000 kW, 50 bar', true, true, true, now()),
(4, 4, 3, 6, 7, 'MSG-C200', 'IR-2024-001', 1, 1, 'Multi-stage centrifugal compressor, 2000 kW', true, true, true, now()),
(5, 5, 3, 6, 7, 'MSG-C200', 'IR-2024-002', 1, 1, 'Multi-stage centrifugal compressor, 2000 kW', true, true, true, now()),
-- Generator
(6, 6, 16, NULL, 8, 'SGT-800', 'SIE-2024-001', 2, 1, 'Gas turbine generator, 50 MW', true, true, true, now()),
-- Storage Tank
(7, 7, 10, NULL, NULL, 'Custom', 'TANK-001', 3, 2, 'Water storage tank, 1000 m3', false, true, true, now()),
-- Distillation Tower
(8, 8, 8, 9, NULL, 'Custom', 'TOWER-001', 1, 1, 'Crude distillation tower, 50000 bpd', true, true, true, now()),
-- Separators
(9, 9, 8, 11, NULL, 'Custom', 'SEP-001', 1, 1, 'Three-phase separator, 10 bar', true, true, true, now()),
(10, 10, 8, 11, NULL, 'Custom', 'SEP-002', 1, 1, 'Three-phase separator, 10 bar', true, true, true, now())
ON CONFLICT (id) DO NOTHING;

-- Update assets with asset_detail_id
UPDATE public.e_asset SET asset_detail_id = 1 WHERE id = 1;
UPDATE public.e_asset SET asset_detail_id = 2 WHERE id = 2;
UPDATE public.e_asset SET asset_detail_id = 3 WHERE id = 3;
UPDATE public.e_asset SET asset_detail_id = 4 WHERE id = 4;
UPDATE public.e_asset SET asset_detail_id = 5 WHERE id = 5;
UPDATE public.e_asset SET asset_detail_id = 6 WHERE id = 6;
UPDATE public.e_asset SET asset_detail_id = 7 WHERE id = 7;
UPDATE public.e_asset SET asset_detail_id = 8 WHERE id = 8;
UPDATE public.e_asset SET asset_detail_id = 9 WHERE id = 9;
UPDATE public.e_asset SET asset_detail_id = 10 WHERE id = 10;

-- Insert Asset SCE Codes
INSERT INTO public.e_asset_sce (id, group_name, sce_code, asset_detail_id, created_at) VALUES
(1, 'Main Pumps', 'P-101', 1, now()),
(2, 'Main Pumps', 'P-101', 2, now()),
(3, 'Compressors', 'C-201', 3, now()),
(4, 'Main Compressors', 'C-301', 4, now()),
(5, 'Main Compressors', 'C-301', 5, now()),
(6, 'Generators', 'G-401', 6, now()),
(7, 'Storage', 'V-501', 7, now()),
(8, 'Process Towers', 'T-601', 8, now()),
(9, 'Separators', 'V-102', 9, now()),
(10, 'Separators', 'V-102', 10, now())
ON CONFLICT (id) DO NOTHING;

-- Update assets with SCE IDs
UPDATE public.e_asset SET asset_sce_id = 1 WHERE id = 1;
UPDATE public.e_asset SET asset_sce_id = 2 WHERE id = 2;
UPDATE public.e_asset SET asset_sce_id = 3 WHERE id = 3;
UPDATE public.e_asset SET asset_sce_id = 4 WHERE id = 4;
UPDATE public.e_asset SET asset_sce_id = 5 WHERE id = 5;
UPDATE public.e_asset SET asset_sce_id = 6 WHERE id = 6;
UPDATE public.e_asset SET asset_sce_id = 7 WHERE id = 7;
UPDATE public.e_asset SET asset_sce_id = 8 WHERE id = 8;
UPDATE public.e_asset SET asset_sce_id = 9 WHERE id = 9;
UPDATE public.e_asset SET asset_sce_id = 10 WHERE id = 10;

-- ============================================================================
-- 7. MAINTENANCE MASTER DATA
-- ============================================================================

-- Insert Disciplines
INSERT INTO public.e_discipline (name, is_active, created_at) VALUES
('Mechanical'),
('Electrical'),
('Instrumentation'),
('Process'),
('Civil'),
('Safety'),
('Operations')
ON CONFLICT (name) DO NOTHING;

-- Insert Work Centers
INSERT INTO public.e_work_center (name, is_active, created_at) VALUES
('Main Workshop'),
('Field Maintenance'),
('Electrical Workshop'),
('Instrument Workshop'),
('Emergency Response'),
('Operations Center')
ON CONFLICT (name) DO NOTHING;

-- Insert Priorities
INSERT INTO public.e_priority (priority_no, name, color_code, is_active, created_at) VALUES
(1, 'Emergency', '#FF0000', true, now()),
(2, 'Urgent', '#FF8800', true, now()),
(3, 'High', '#FFAA00', true, now()),
(4, 'Medium', '#00AA00', true, now()),
(5, 'Low', '#0088FF', true, now())
ON CONFLICT (priority_no) DO NOTHING;

-- Insert Frequency Types
INSERT INTO public.e_frequency_type (name, created_at) VALUES
('Calendar Based'),
('Running Hours Based'),
('Cycle Based'),
('Condition Based'),
('On Demand')
ON CONFLICT (name) DO NOTHING;

-- Insert Frequencies
INSERT INTO public.e_frequency (frequency_no, frequency_name, frequency_type_id, is_active, created_at) VALUES
('DAILY', 'Daily', 1, true, now()),
('WEEKLY', 'Weekly', 1, true, now()),
('MONTHLY', 'Monthly', 1, true, now()),
('QUARTERLY', 'Quarterly', 1, true, now()),
('SEMI-ANNUAL', 'Semi-Annual', 1, true, now()),
('ANNUAL', 'Annual', 1, true, now()),
('500H', '500 Running Hours', 2, true, now()),
('1000H', '1000 Running Hours', 2, true, now()),
('2000H', '2000 Running Hours', 2, true, now()),
('5000H', '5000 Running Hours', 2, true, now()),
('8760H', '8760 Running Hours (1 Year)', 2, true, now())
ON CONFLICT (frequency_no) DO NOTHING;

-- Insert Maintenance Types
INSERT INTO public.e_maintenance_type (name, is_active, created_at) VALUES
('Preventive Maintenance'),
('Corrective Maintenance'),
('Predictive Maintenance'),
('Condition Based Maintenance'),
('Emergency Maintenance'),
('Shutdown Maintenance')
ON CONFLICT (name) DO NOTHING;

-- Insert Maintenance Categories
INSERT INTO public.e_maintenance (name, maintenance_type_id, is_active, created_at) VALUES
('Lubrication', 1, true, now()),
('Inspection', 1, true, now()),
('Calibration', 1, true, now()),
('Overhaul', 1, true, now()),
('Replacement', 1, true, now()),
('Cleaning', 1, true, now()),
('Testing', 1, true, now()),
('Adjustment', 1, true, now()),
('Repair', 2, true, now()),
('Troubleshooting', 2, true, now()),
('Vibration Analysis', 3, true, now()),
('Thermography', 3, true, now()),
('Oil Analysis', 3, true, now()),
('Ultrasonic Testing', 3, true, now())
ON CONFLICT (name) DO NOTHING;

-- Insert Tasks
INSERT INTO public.e_task (task_code, task_name, discipline_id, is_active, created_at) VALUES
('TASK-001', 'Visual Inspection', 1, true, now()),
('TASK-002', 'Lubrication', 1, true, now()),
('TASK-003', 'Vibration Check', 1, true, now()),
('TASK-004', 'Electrical Testing', 2, true, now()),
('TASK-005', 'Calibration Check', 3, true, now()),
('TASK-006', 'Pressure Test', 4, true, now()),
('TASK-007', 'Performance Test', 4, true, now()),
('TASK-008', 'Safety System Test', 6, true, now()),
('TASK-009', 'Functional Test', 7, true, now()),
('TASK-010', 'Cleaning and Washing', 1, true, now())
ON CONFLICT (task_code) DO NOTHING;

-- ============================================================================
-- 8. INVENTORY MASTER DATA
-- ============================================================================

-- Insert Units
INSERT INTO public.e_unit (name, symbol, created_at) VALUES
('Each', 'EA', now()),
('Meter', 'M', now()),
('Kilogram', 'KG', now()),
('Liter', 'L', now()),
('Square Meter', 'M2', now()),
('Cubic Meter', 'M3', now()),
('Hour', 'HR', now()),
('Set', 'SET', now()),
('Pair', 'PAIR', now()),
('Roll', 'ROLL', now())
ON CONFLICT (name) DO NOTHING;

-- Insert Criticalities
INSERT INTO public.e_criticality (name, created_at) VALUES
('Critical'),
('Important'),
('Standard'),
('Non-Critical')
ON CONFLICT (name) DO NOTHING;

-- Insert Item Categories
INSERT INTO public.e_item_category (name, created_at) VALUES
('Spare Parts'),
('Consumables'),
('Tools'),
('Safety Equipment'),
('Instrumentation'),
('Electrical Components'),
('Mechanical Components'),
('Chemicals'),
('Lubricants'),
('Gaskets and Seals')
ON CONFLICT (name) DO NOTHING;

-- Insert Item Types
INSERT INTO public.e_item_type (name, created_at) VALUES
('Rotating Parts'),
('Static Parts'),
('Electrical Parts'),
('Electronic Parts'),
('Instrumentation Parts'),
('Safety Parts'),
('Consumable Items'),
('Chemical Products'),
('Lubricating Products'),
('Sealing Products')
ON CONFLICT (name) DO NOTHING;

-- Insert Item Groups
INSERT INTO public.e_item_group (name, created_at) VALUES
('Pump Parts'),
('Compressor Parts'),
('Valve Parts'),
('Motor Parts'),
('Instrument Parts'),
('Safety Parts'),
('General Consumables'),
('Lubricants'),
('Chemicals'),
('Tools and Equipment')
ON CONFLICT (name) DO NOTHING;

-- Insert Sample Items
INSERT INTO public.e_item_master (id, item_no, item_name, category_id, type_id, item_group, manufacturer, specification, unit_id, criticality_id, is_active, created_at) VALUES
(1, 'ITM-001', 'Pump Impeller - VSC-200', 1, 1, 1, 1, 'Stainless Steel 316L', 1, 1, true, now()),
(2, 'ITM-002', 'Motor Bearing - 6312', 1, 1, 4, 8, 'Deep groove ball bearing', 1, 1, true, now()),
(3, 'ITM-003', 'Seal Kit - Mechanical', 1, 1, 1, 1, 'PTFE/Carbon/SiC', 8, 1, true, now()),
(4, 'ITM-004', 'Engine Oil - SAE 15W40', 9, 9, 8, NULL, 'Synthetic blend', 4, 2, true, now()),
(5, 'ITM-005', 'Grease - Lithium Complex', 9, 9, 8, NULL, 'High temperature grease', 3, 2, true, now()),
(6, 'ITM-006', 'Control Valve Actuator', 5, 5, 5, 11, 'Pneumatic actuator', 1, 1, true, now()),
(7, 'ITM-007', 'Pressure Transmitter', 5, 5, 5, 15, '4-20mA, 0-100 bar', 1, 1, true, now()),
(8, 'ITM-008', 'Safety Valve', 6, 6, 6, 16, 'Spring loaded, 50 bar set', 1, 1, true, now()),
(9, 'ITM-009', 'Gasket - Spiral Wound', 10, 10, 6, NULL, 'SS316L/Graphite', 1, 2, true, now()),
(10, 'ITM-010', 'V-Belt', 7, 7, 10, NULL, 'Industrial V-belt', 1, 3, true, now())
ON CONFLICT (id) DO NOTHING;

-- Insert Stores
INSERT INTO public.e_store (id, store_code, store_name, is_active, created_at) VALUES
(1, 'MAIN-01', 'Main Warehouse', true, now()),
(2, 'FIELD-01', 'Field Store Room', true, now()),
(3, 'CHEM-01', 'Chemical Storage', true, now()),
(4, 'TOOL-01', 'Tool Crib', true, now()),
(5, 'SPARE-01', 'Spare Parts Store', true, now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 9. WORK ORDER STATUS AND WORKFLOW
-- ============================================================================

-- Insert Work Order Status
INSERT INTO public.e_work_order_status (name, is_active, created_at) VALUES
('Draft'),
('Planned'),
('Approved'),
('Released'),
('In Progress'),
('Completed'),
('Closed'),
('Cancelled')
ON CONFLICT (name) DO NOTHING;

-- Insert CM Status
INSERT INTO public.e_cm_status (name, created_at) VALUES
('Open'),
('In Progress'),
('On Hold'),
('Completed'),
('Closed'),
('Cancelled')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 10. SAMPLE PM SCHEDULES
-- ============================================================================

-- Insert Sample PM Schedules
INSERT INTO public.e_pm_schedule (id, due_date, maintenance_id, priority_id, work_center_id, discipline_id, frequency_id, asset_id, system_id, package_id, facility_id, is_active, created_at) VALUES
(1, '2024-12-01', 1, 4, 1, 1, 3, 1, 1, 1, 1, true, now()), -- Monthly lubrication for Pump A
(2, '2024-12-01', 2, 4, 1, 1, 3, 2, 1, 1, 1, true, now()), -- Monthly inspection for Pump B
(3, '2024-12-15', 4, 3, 1, 1, 4, 4, 3, 4, 1, true, now()), -- Quarterly overhaul for Compressor A
(4, '2025-01-01', 1, 4, 1, 1, 3, 6, 4, 6, 2, true, now()), -- Monthly lubrication for Generator
(5, '2024-12-31', 2, 4, 1, 2, 6, 6, 4, 6, 2, true, now())  -- Annual electrical inspection for Generator
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 11. SAMPLE EMPLOYEES
-- ============================================================================

-- Insert Sample Employees
INSERT INTO public.e_employee (id, employee_no, first_name, last_name, email, phone, discipline_id, is_active, created_at) VALUES
(1, 'EMP-001', 'Ahmad', 'Ibrahim', 'ahmad.ibrahim@company.com', '+60123456789', 1, true, now()),
(2, 'EMP-002', 'Siti', 'Nuraini', 'siti.nuraini@company.com', '+60123456790', 2, true, now()),
(3, 'EMP-003', 'Raj', 'Kumar', 'raj.kumar@company.com', '+60123456791', 3, true, now()),
(4, 'EMP-004', 'Lim', 'Wei Ming', 'lim.weiming@company.com', '+60123456792', 1, true, now()),
(5, 'EMP-005', 'Fatimah', 'Zahra', 'fatimah.zahra@company.com', '+60123456793', 4, true, now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 12. RESET SEQUENCES
-- ============================================================================

-- Reset sequences to continue from the last inserted value
SELECT setval('public.e_client_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.e_client));
SELECT setval('public.e_project_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.e_project));
SELECT setval('public.e_facility_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.e_facility));
SELECT setval('public.e_system_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.e_system));
SELECT setval('public.e_package_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.e_package));
SELECT setval('public.e_asset_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.e_asset));
SELECT setval('public.e_asset_detail_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.e_asset_detail));
SELECT setval('public.e_pm_sce_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.e_asset_sce));
SELECT setval('public.e_item_master_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.e_item_master));
SELECT setval('public.e_pm_schedule_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.e_pm_schedule));
SELECT setval('public.e_employee_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.e_employee));

-- Re-enable triggers
SET session_replication_role = 'origin';

-- ============================================================================
-- SEEDING COMPLETE
-- ============================================================================

-- Display summary of seeded data
DO $$
BEGIN
    RAISE NOTICE '=== EPOMS-X Database Seeding Complete ===';
    RAISE NOTICE 'Clients: %', (SELECT COUNT(*) FROM public.e_client);
    RAISE NOTICE 'Projects: %', (SELECT COUNT(*) FROM public.e_project);
    RAISE NOTICE 'Facilities: %', (SELECT COUNT(*) FROM public.e_facility);
    RAISE NOTICE 'Systems: %', (SELECT COUNT(*) FROM public.e_system);
    RAISE NOTICE 'Packages: %', (SELECT COUNT(*) FROM public.e_package);
    RAISE NOTICE 'Assets: %', (SELECT COUNT(*) FROM public.e_asset);
    RAISE NOTICE 'Asset Categories: %', (SELECT COUNT(*) FROM public.e_asset_category);
    RAISE NOTICE 'Asset Types: %', (SELECT COUNT(*) FROM public.e_asset_type);
    RAISE NOTICE 'Item Masters: %', (SELECT COUNT(*) FROM public.e_item_master);
    RAISE NOTICE 'PM Schedules: %', (SELECT COUNT(*) FROM public.e_pm_schedule);
    RAISE NOTICE 'Employees: %', (SELECT COUNT(*) FROM public.e_employee);
    RAISE NOTICE '==========================================';
END $$;
