-- EPOMS-X Data Export
-- Exported: 2025-07-03T08:39:56.894Z
-- Total records: 243

BEGIN;

-- user_type (6 records)
TRUNCATE TABLE public.user_type RESTART IDENTITY CASCADE;
INSERT INTO public.user_type ("id", "name", "created_when", "created_by", "updated_at", "updated_by", "priority", "description", "is_active") VALUES
  ('de858635-ff6a-4a69-a340-753ae57c483e', 'super admin', '2025-06-06T05:15:55+00:00', NULL, NULL, NULL, 1, NULL, true),
  ('1e7a5217-5271-4f3d-b242-858bc423f5e8', 'admin', '2025-06-06T05:20:26+00:00', NULL, NULL, NULL, 2, NULL, true),
  ('f21255f9-cda2-48f5-91c6-f91de5ca949b', 'technical specialist', '2025-06-06T05:20:46+00:00', NULL, NULL, NULL, 3, NULL, true),
  ('2522b102-e294-4b84-b7ee-105eab260fe8', 'technician', '2025-06-06T05:21:16+00:00', NULL, NULL, NULL, 4, NULL, true),
  ('c7b8d847-2154-4b3a-a946-d2f18eabc041', 'engineer', '2025-06-06T05:21:40.333332+00:00', NULL, NULL, NULL, 5, NULL, true),
  ('c6d2d88e-7b20-4e06-90a0-b6f1918af668', 'client', '2025-06-06T05:22:52.009175+00:00', NULL, NULL, NULL, 6, NULL, true);

-- e_client (5 records)
TRUNCATE TABLE public.e_client RESTART IDENTITY CASCADE;
INSERT INTO public.e_client ("id", "code", "type", "name", "onboard_date", "office_no", "email", "created_by", "created_at", "updated_by", "updated_at") VALUES
  (3, 'CL003', 'Corporate', 'Beta Industries', '2023-07-20T00:00:00', '1003', 'beta@industries.com', NULL, NULL, NULL, NULL),
  (4, 'CL004', 'Individual', 'Jane Smith', '2024-05-10T00:00:00', '1004', 'jane.smith@example.com', NULL, NULL, NULL, NULL),
  (5, 'CL005', 'Corporate', 'Gamma LLC', '2025-03-12T00:00:00', '1005', 'gamma.llc@example.com', NULL, NULL, NULL, NULL),
  (2, 'CL002', 'Individual', 'John Doe', '2025-01-13T00:00:00', '1002', 'john.doe@example.com', NULL, NULL, NULL, NULL),
  (6, 'CL006', 'Individual', 'Mustaqeem', '2025-05-12T00:00:00', 'neTgeO', 'mus@garu.garu', NULL, NULL, NULL, NULL);

-- e_project (21 records)
TRUNCATE TABLE public.e_project RESTART IDENTITY CASCADE;
INSERT INTO public.e_project ("id", "project_code", "client_id", "project_type", "project_name", "short_name", "start_date", "end_date", "fund_code", "project_purpose", "remark", "longitude", "latitude", "created_by", "created_at", "updated_by", "updated_at") VALUES
  (22, 'PRJ002', 2, 1, 'John Personal Website', 'JohnWeb', '2025-02-01T00:00:00', '2025-03-01T00:00:00', 'FUND1002', 'Online presence', 'Freelance work', NULL, NULL, NULL, NULL, NULL, NULL),
  (23, 'PRJ003', 3, 3, 'Beta Strategic Consulting', 'BetaConsult', '2023-09-01T00:00:00', '2023-12-20T00:00:00', 'FUND1003', 'Market entry strategy', 'Client workshops held', NULL, NULL, NULL, NULL, NULL, NULL),
  (24, 'PRJ004', 4, 4, 'Jane Research Study', 'JaneResearch', '2024-06-01T00:00:00', '2024-12-01T00:00:00', 'FUND1004', 'Feasibility analysis', 'Initial draft complete', NULL, NULL, NULL, NULL, NULL, NULL),
  (25, 'PRJ005', 5, 2, 'Gamma ERP Upgrade', 'GammaERP', '2024-04-10T00:00:00', '2025-01-10T00:00:00', 'FUND1005', 'System modernization', 'QA in progress', NULL, NULL, NULL, NULL, NULL, NULL),
  (27, 'PRJ007', 2, 5, 'Mobile App Dev', 'AppDev', '2024-08-01T00:00:00', '2024-12-15T00:00:00', 'FUND1007', 'Customer engagement', 'Design phase', NULL, NULL, NULL, NULL, NULL, NULL),
  (28, 'PRJ008', 3, 1, 'Server Migration', 'Migrate2024', '2024-02-15T00:00:00', '2024-03-20T00:00:00', 'FUND1008', 'Reduce downtime', 'None', NULL, NULL, NULL, NULL, NULL, NULL),
  (29, 'PRJ009', 4, 4, 'Health Impact Research', 'HImpact', '2023-11-01T00:00:00', '2024-05-01T00:00:00', 'FUND1009', 'Public health study', 'Ethics approved', NULL, NULL, NULL, NULL, NULL, NULL),
  (30, 'PRJ010', 5, 2, 'Client Portal Revamp', 'PortalV2', '2024-05-15T00:00:00', '2024-10-15T00:00:00', 'FUND1010', 'Improve UX', 'Testing underway', NULL, NULL, NULL, NULL, NULL, NULL),
  (32, 'PRJ012', 2, 5, 'Data Warehouse Setup', 'DWHSetup', '2023-10-01T00:00:00', '2024-02-01T00:00:00', 'FUND1012', 'Centralize reporting', 'ETL in place', NULL, NULL, NULL, NULL, NULL, NULL),
  (33, 'PRJ013', 3, 1, 'Product Launch Support', 'LaunchPad', '2024-07-01T00:00:00', '2024-11-01T00:00:00', 'FUND1013', 'Assist go-to-market', 'None', NULL, NULL, NULL, NULL, NULL, NULL),
  (34, 'PRJ014', 4, 2, 'E-Learning Platform', 'LearnX', '2024-03-15T00:00:00', '2024-09-15T00:00:00', 'FUND1014', 'Digital training delivery', 'Pending content', NULL, NULL, NULL, NULL, NULL, NULL),
  (35, 'PRJ015', 5, 4, 'Community Research', 'CommRes', '2023-12-01T00:00:00', '2024-06-01T00:00:00', 'FUND1015', 'Impact analysis', 'Surveys completed', NULL, NULL, NULL, NULL, NULL, NULL),
  (37, 'PRJ017', 2, 5, 'Customer Loyalty App', 'LoyaltyApp', '2024-06-01T00:00:00', '2024-11-01T00:00:00', 'FUND1017', 'Increase retention', 'None', NULL, NULL, NULL, NULL, NULL, NULL),
  (38, 'PRJ018', 3, 1, 'Internal Training Module', 'TrainMod', '2023-08-01T00:00:00', '2023-12-01T00:00:00', 'FUND1018', 'Staff upskilling', 'Content reviewed', NULL, NULL, NULL, NULL, NULL, NULL),
  (39, 'PRJ019', 4, 2, 'Digital Transformation', 'DigTrans', '2025-01-01T00:00:00', '2025-07-01T00:00:00', 'FUND1019', 'System overhaul', 'Approval pending', NULL, NULL, NULL, NULL, NULL, NULL),
  (21, 'PRJ001', NULL, 2, 'Alpha CRM Implementation', 'AlphaCRM', '2024-01-15T00:00:00', '2024-07-15T00:00:00', 'FUND1001', 'Improve client relationship management', 'Phase 1 complete', NULL, NULL, NULL, NULL, NULL, NULL),
  (26, 'PRJ006', NULL, 1, 'New Branch Setup', 'Branch2025', '2025-01-01T00:00:00', '2025-06-30T00:00:00', 'FUND1006', 'Expand operations', 'Pending approval', NULL, NULL, NULL, NULL, NULL, NULL),
  (31, 'PRJ011', NULL, 3, 'Corporate Tax Advisory', 'TaxAdvise', '2025-03-01T00:00:00', '2025-08-01T00:00:00', 'FUND1011', 'Optimize tax strategy', 'Phase 2', NULL, NULL, NULL, NULL, NULL, NULL),
  (36, 'PRJ016', NULL, 3, 'Sustainability Audit', 'SustAudit', '2024-10-01T00:00:00', '2025-01-01T00:00:00', 'FUND1016', 'Carbon footprint analysis', 'Initial data gathered', NULL, NULL, NULL, NULL, NULL, NULL),
  (42, 'LRT-023', 6, 3, 'Larut', 'LRT', '2025-05-11T00:00:00', '2025-05-19T00:00:00', 'FUND021', 'testing ..', 'no remark', '101.45495053587715', '3.227988295603193', NULL, NULL, NULL, NULL),
  (40, 'SPT-003', 6, 4, 'Sepat', 'Sepat', '2024-08-31T00:00:00', '2025-01-30T00:00:00', 'FUND1020', 'Equipment utilization', 'Procurement stage', '', '', NULL, NULL, NULL, NULL);

-- e_facility (14 records)
TRUNCATE TABLE public.e_facility RESTART IDENTITY CASCADE;
INSERT INTO public.e_facility ("id", "location_code", "location_name", "is_active", "project_id", "created_by", "created_at", "updated_by", "updated_at") VALUES
  (142, 'TEST', 'Test', true, 21, NULL, '2025-07-02T02:21:58.753416+00:00', NULL, NULL),
  (124, 'ytt', 'yyy', true, 21, NULL, '2025-07-01T09:00:58.721505+00:00', NULL, '2025-07-03T01:13:39.690504+00:00'),
  (123, 'y', 'yyy', true, 21, NULL, '2025-07-01T09:00:51.940848+00:00', NULL, '2025-07-03T01:13:41.628842+00:00'),
  (119, 'LAT', 'MAS', true, 21, NULL, '2025-06-25T03:25:52.360279+00:00', NULL, '2025-07-03T01:13:43.741972+00:00'),
  (112, 'HAI', 'HA ASA IAS', true, 21, NULL, '2025-06-25T03:24:36.490335+00:00', NULL, '2025-07-03T01:13:45.862747+00:00'),
  (110, 'HMU', 'JIA', true, 21, NULL, '2025-06-25T03:24:02.058211+00:00', NULL, '2025-07-03T01:13:48.07115+00:00'),
  (108, 'DCK', 'MAS', true, 21, NULL, '2025-06-25T03:23:43.992954+00:00', NULL, '2025-07-03T01:13:49.988295+00:00'),
  (98, 'LLL', 'MAS', true, 21, NULL, '2025-06-25T03:23:29.335962+00:00', NULL, '2025-07-03T01:13:51.975733+00:00'),
  (96, 'SVG', 'MAS', true, 21, NULL, '2025-06-25T03:23:19.251311+00:00', NULL, '2025-07-03T01:13:54.130917+00:00'),
  (90, 'SME', 'MSD', true, 21, NULL, '2025-06-25T03:22:51.278908+00:00', NULL, '2025-07-03T01:13:55.908408+00:00'),
  (82, 'EPO', 'Example Purpose Only', true, 21, NULL, '2025-06-10T06:56:45.22696+00:00', NULL, '2025-07-03T01:13:57.754439+00:00'),
  (80, 'FPS', 'Facility Processing Storage and Offloading', true, 21, NULL, '2025-06-09T07:40:39.872941+00:00', NULL, '2025-07-03T01:13:59.905343+00:00'),
  (79, 'FSO', 'Floating Storage Offloading', true, 21, NULL, '2025-06-09T07:40:23.680317+00:00', NULL, '2025-07-03T01:14:01.82036+00:00'),
  (34, 'CPP', 'TEST', false, 21, NULL, NULL, NULL, '2025-07-03T01:14:04.6152+00:00');

-- e_system (23 records)
TRUNCATE TABLE public.e_system RESTART IDENTITY CASCADE;
INSERT INTO public.e_system ("id", "facility_id", "system_code", "system_no", "system_name", "is_active", "created_by", "created_at", "updated_by", "updated_at") VALUES
  (110, 110, 'DRB-01', 'HMU-DRB-01', 'My System', true, NULL, '2025-06-25T03:56:58.372206+00:00', NULL, NULL),
  (113, 110, 'POV-01', 'HMU-POV-01', 'My System', true, NULL, '2025-06-25T03:57:20.237782+00:00', NULL, NULL),
  (115, 110, 'data-61', 'HMU-data-61', 'My System', true, NULL, '2025-06-25T03:57:31.861281+00:00', NULL, NULL),
  (47, 34, 'CPP-PCS', 'PCS', 'Process Control System/PCS/DCS', true, NULL, NULL, NULL, NULL),
  (124, 34, 'test-01', 'CPP-test-01', 'My System', true, NULL, '2025-06-25T03:58:04.948084+00:00', NULL, NULL),
  (126, 34, 'test-043', 'CPP-test-043', 'system test', true, NULL, '2025-06-25T03:58:21.15843+00:00', NULL, NULL),
  (68, 34, 'PCS', 'CPP-PCS', 'Process Control System/PCS/DCS', true, NULL, NULL, NULL, NULL),
  (69, 34, 'PRP', 'CPP-PRP', 'Process Piping', true, NULL, NULL, NULL, NULL),
  (70, 34, 'STR', 'CPP-STR', 'Structures', true, NULL, NULL, NULL, NULL),
  (74, 34, 'CHT', 'CPP-CHT', 'Chemical Treatment', true, NULL, NULL, NULL, NULL),
  (78, 79, 'OPC', 'FSO-OPC', 'Oil Processing', true, NULL, NULL, NULL, NULL),
  (84, 34, 'NAV', 'CPP-NAV', 'Navigational Aids', NULL, NULL, NULL, NULL, NULL),
  (85, 34, 'PWG', 'CPP-PWG', 'POWER GENERATION', NULL, NULL, NULL, NULL, NULL),
  (86, 34, 'GPC', 'CPP-GPC', 'GAS COMPRESSION', NULL, NULL, NULL, NULL, NULL),
  (87, 34, 'Module 1', 'CPP-Module 1', 'Production', NULL, NULL, NULL, NULL, NULL),
  (88, 34, 'CMA', 'CPP-CMA', 'COMPRESSED AIR', NULL, NULL, NULL, NULL, NULL),
  (89, 34, 'OPC', 'CPP-OPC', 'OIL PROCESSING', NULL, NULL, NULL, NULL, NULL),
  (90, 34, 'CRN', 'CPP-CRN', 'CRANE', NULL, NULL, NULL, NULL, NULL),
  (91, 34, 'WIS', 'CPP-WIS', 'Water Injection System', NULL, NULL, NULL, NULL, NULL),
  (92, 34, 'SVW', 'CPP-SVW', 'Service Waters testts', NULL, NULL, NULL, NULL, NULL),
  (93, 34, 'EPW', 'CPP-EPW', 'EMERGENCY POWER', NULL, NULL, NULL, NULL, NULL),
  (94, 34, 'SWA', 'CPP-SWA', 'SEA AND COOLING WATER SYSTEM', NULL, NULL, NULL, NULL, NULL),
  (95, 34, '001', 'CPP-001', 'VACUUM PUMP', NULL, NULL, NULL, NULL, NULL);

-- e_package (38 records)
TRUNCATE TABLE public.e_package RESTART IDENTITY CASCADE;
INSERT INTO public.e_package ("id", "system_id", "package_name", "package_tag", "package_type_id", "package_no", "is_active", "created_by", "created_at", "updated_by", "updated_at") VALUES
  (155, 47, 'Test', 'HYDINHB', 26, 'CPP-HYDINHB-PKG', true, NULL, NULL, NULL, NULL),
  (157, 47, 'HYDRATE INHIBITION', 'HYDINHB', 27, 'CPP-PCS-HYDINHB-ASY', true, NULL, '2025-06-04T09:07:05.888+00:00', NULL, '2025-06-04T09:07:05.888+00:00'),
  (159, 74, 'HYDRATE INHIBITION', 'HYDINHB', 26, 'CPP-HYDINHB-PKG', NULL, NULL, NULL, NULL, NULL),
  (181, 92, 'SEA WATER LIFT PUMP Y ASSY', 'P620C', 27, 'CPP-P620C-ASY', NULL, NULL, NULL, NULL, '2025-06-25T04:03:05.047627+00:00'),
  (160, 74, 'CORROSION INHIBITION', 'CORINHB', 26, 'CPP-CORINHB-PKG', NULL, NULL, NULL, NULL, NULL),
  (161, 74, 'DRA, PPD, SCALE INHIBITOR', 'PPD', 26, 'CPP-PPD-PKG', NULL, NULL, NULL, NULL, NULL),
  (162, 74, 'DEMULSIFIERS', 'DEMULSIFIER', 26, 'CPP-DEMULSIFIER-PKG', NULL, NULL, NULL, NULL, NULL),
  (163, 74, 'BIOCIDE, OXYGEN SCAVENGER, ANTIFOAM', 'OXYSCAV', 26, 'CPP-OXYSCAV-PKG', NULL, NULL, NULL, NULL, NULL),
  (164, 74, 'POLYELECTROLYTE', 'POLYELEC', 26, 'CPP-POLYELEC-PKG', NULL, NULL, NULL, NULL, NULL),
  (165, 74, 'CHEMICAL STORAGE TANK', 'CHEMTANK', 26, 'CPP-CHEMTANK-PKG', NULL, NULL, NULL, NULL, NULL),
  (166, 74, 'CORROSION PROTECTION', 'CORPROTEC', 26, 'CPP-CORPROTEC-PKG', NULL, NULL, NULL, NULL, NULL),
  (167, 93, 'EMERGENCY GENERATORS', 'G410', 26, 'CPP-G410-PKG', NULL, NULL, NULL, NULL, NULL),
  (168, 85, 'MAIN GENERATOR #1', 'G364', 26, 'CPP-G364-PKG', NULL, NULL, NULL, NULL, NULL),
  (169, 85, 'MAIN GENERATOR #2', 'G365', 26, 'CPP-G365-PKG', NULL, NULL, NULL, NULL, NULL),
  (170, 85, 'MAIN GENERATOR #3', 'G366', 26, 'CPP-G366-PKG', NULL, NULL, NULL, NULL, NULL),
  (171, 86, 'PACKAGE, GAS COMPRESSOR', 'C210', 26, 'CPP-C210-PKG', NULL, NULL, NULL, NULL, NULL),
  (172, 88, 'AIR COMPRESSOR A PACKAGE', 'ME375A', 26, 'CPP-ME375A-PKG', NULL, NULL, NULL, NULL, NULL),
  (173, 88, 'AIR COMPRESSOR B PACKAGE', 'ME375B', 26, 'CPP-ME375B-PKG', NULL, NULL, NULL, NULL, NULL),
  (174, 89, 'MOL PUMP A ASSEMBLY', 'P630A', 27, 'CPP-P630A-ASY', NULL, NULL, NULL, NULL, NULL),
  (175, 89, 'MOL PUMP B ASSEMBLY', 'P630B', 27, 'CPP-P630B-ASY', NULL, NULL, NULL, NULL, NULL),
  (176, 90, 'Crane', 'ME290', 26, 'CPP-ME290-PKG', NULL, NULL, NULL, NULL, NULL),
  (177, 91, 'WATER INJECTION PUMP A ASSY', 'P625A', 27, 'CPP-P625A-ASY', NULL, NULL, NULL, NULL, NULL),
  (178, 91, 'WATER INJECTION PUMP B ASSY', 'P625B', 27, 'CPP-P625B-ASY', NULL, NULL, NULL, NULL, NULL),
  (179, 91, 'WATER INJECTION PUMP ASSY', 'P625C', 27, 'CPP-P625C-ASY', NULL, NULL, NULL, NULL, NULL),
  (180, 92, 'SEA WATER LIFT PUMP B ASSY', 'P620B', 27, 'CPP-P620B-ASY', NULL, NULL, NULL, NULL, NULL),
  (182, 92, 'SEA WATER LIFT PUMP D ASSY', 'P620D', 27, 'CPP-P620D-ASY', NULL, NULL, NULL, NULL, NULL),
  (183, 94, 'COOLING WATER CIRCULATION PUMP B ASSY', 'P332B', 27, 'CPP-P332B-ASY', NULL, NULL, NULL, NULL, NULL),
  (184, 94, 'COOLING WATER CIRCULATION PUMP C ASSY', 'P332C', 27, 'CPP-P332C-ASY', NULL, NULL, NULL, NULL, NULL),
  (185, 91, 'DEARATOR VACUUM PUMP ASSEMBLY', 'P338A', 27, 'CPP-P338A-ASY', NULL, NULL, NULL, NULL, NULL),
  (186, 91, 'DEARATOR VACUUM PUMP ASSEMBLY', 'P338B', 27, 'CPP-P338B-ASY', NULL, NULL, NULL, NULL, NULL),
  (187, 90, 'Crane', 'COMAR', 27, 'CPP-COMAR-ASY', NULL, NULL, NULL, NULL, NULL),
  (188, 88, 'Compressed Air', 'COMAR', 27, 'CPP-COMAR-ASY', NULL, NULL, NULL, NULL, NULL),
  (189, 78, 'ABC Name', 'ABC', 27, 'FSO-ABC-ASY', NULL, NULL, NULL, NULL, NULL),
  (190, 74, 'HYDINHB', 'HYDRATE INHIBITI', 26, 'CPP-HYDRATE INHIBITI-PKG', NULL, NULL, NULL, NULL, NULL),
  (191, 74, 'CORROSION INHIBITION', 'CORINHB', 26, 'CHT-CORINHB-PKG', true, NULL, '2025-06-10T07:33:23.022+00:00', NULL, '2025-06-10T07:33:59.885771+00:00'),
  (194, 87, 'Prod Package', 'PROD', 26, 'Module 1-PROD-PKG', true, NULL, '2025-06-11T23:20:32.964+00:00', NULL, '2025-06-11T23:20:32.964+00:00'),
  (196, 95, 'Vacuum Pump', 'PMP', 27, 'CPP-PMP-ASY', true, NULL, '2025-06-16T02:05:12.108+00:00', NULL, '2025-06-25T04:02:19.712547+00:00'),
  (195, 95, 'tet', 'VTT', 26, 'CPP-VTT-PKG', true, NULL, '2025-06-13T10:05:49.054+00:00', NULL, '2025-06-25T04:02:30.429661+00:00');

-- e_asset (31 records)
TRUNCATE TABLE public.e_asset RESTART IDENTITY CASCADE;
INSERT INTO public.e_asset ("id", "facility_id", "system_id", "package_id", "asset_no", "asset_name", "asset_tag_id", "status_id", "asset_group_id", "commission_date", "asset_detail_id", "asset_sce_id", "created_by", "created_at", "updated_by", "updated_at", "parent_asset_id", "is_active") VALUES
  (170, 79, 78, 189, 'A-T01', 'Asset Testing', 8, 8, 2, '2025-06-11T00:00:00', 53, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-11T03:56:27.435+00:00', NULL, NULL, NULL, false),
  (171, 34, 87, 194, '1V-110', 'Test Separator', 10, 8, 6, '2025-06-12T00:00:00', 54, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-11T23:21:56.864+00:00', NULL, NULL, NULL, false),
  (172, 34, 86, 171, 'C-210', 'PACKAGE, GAS COMPRESSOR', 8, 8, 4, '2025-06-12T00:00:00', 55, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T11:51:18.827+00:00', NULL, NULL, NULL, false),
  (173, 34, 86, 171, 'C-220', 'COMPRESSOR, 1ST STAGE', 7, 8, 4, NULL, 56, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T11:52:30.859+00:00', NULL, NULL, NULL, false),
  (175, 34, 88, 172, ' C-377A', 'COMPRESSOR, INSTRUMENT AIR, ME-375A', 8, 8, 7, NULL, 58, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T11:55:47.338+00:00', NULL, NULL, NULL, false),
  (176, 34, 88, 173, 'C-377B', 'COMPRESSOR, INSTRUMENT AIR, ME-375B', 8, 8, 6, NULL, 59, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T11:58:57.531+00:00', NULL, NULL, NULL, false),
  (169, 34, 91, 179, 'P-625C', 'PUMP WATER INJECTION', 5, 8, 4, NULL, 52, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-10T17:06:42.133+00:00', NULL, NULL, 214, false),
  (174, 34, 86, 171, 'C-230', 'COMPRESSOR, 2ND STAGE', 8, 8, 6, NULL, 57, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T11:54:11.119+00:00', NULL, '2025-06-12T11:59:20.538+00:00', NULL, true),
  (177, 79, 78, 189, 'ASSET-001', 'TEST_ASSET', 1, 8, 1, '2025-06-11T00:00:00', 60, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T15:32:51.431+00:00', NULL, NULL, NULL, true),
  (178, 34, 92, 180, 'P-620B', 'P620B-PUMP SEAWATER LIFT', 2, 8, 3, NULL, 61, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T07:48:20.695+00:00', NULL, NULL, NULL, true),
  (179, 34, 92, 181, 'P-620C', 'P-620C-PUMP SEAWATER LIFT', 1, 8, 2, NULL, 62, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T07:53:57.119+00:00', NULL, NULL, NULL, true),
  (185, 34, 90, 176, 'ME290', 'ME290-(TOS)CRANE PEDESTAL', 2, 8, 3, NULL, 68, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:10:25.674+00:00', NULL, NULL, NULL, true),
  (186, 34, 89, 174, 'P-630A', ' P630A-PUMP MAIN OIL LINE', 3, 8, 1, NULL, 69, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:12:25.101+00:00', NULL, NULL, NULL, true),
  (187, 34, 89, 175, 'P-630B', 'P630B-PUMP MAIN OIL LINE', 1, 8, 2, NULL, 70, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:13:33.404+00:00', NULL, NULL, NULL, true),
  (188, 34, 88, 172, 'C-377A', 'C-377A-COMPRESSOR INSTRUMENT AIR ME-375A', 4, 8, 2, NULL, 71, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:14:56.724+00:00', NULL, NULL, NULL, true),
  (193, 34, 85, 170, 'G-366', 'G-366-GENERATOR TURBO 3500kW 4160V', 2, 8, NULL, NULL, 76, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:31:13.45+00:00', NULL, NULL, NULL, true),
  (194, 34, 85, 169, 'G-365', ' G-365-GENERATOR TURBO 3500kW 4160V', 4, 8, NULL, NULL, 77, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:33:03.302+00:00', NULL, NULL, NULL, true),
  (195, 34, 85, 168, 'G-364', ' G-364-GENERATOR TURBO 3500kW 4160V', 5, 8, NULL, NULL, 78, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:34:45.306+00:00', NULL, NULL, NULL, true),
  (196, 34, 93, 167, 'G-410', ' G-410-GENERATOR EMERGENCY DIESEL 1000kW 480V', 8, 8, NULL, NULL, 79, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:36:08.9+00:00', NULL, NULL, NULL, true),
  (197, 34, 95, 195, 'P-338A', 'PUMP, DEARATOR VACUUM', 5, 8, 1, NULL, 80, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T10:06:32.72+00:00', NULL, NULL, NULL, true),
  (180, 34, 92, 182, 'P-620D', 'P-620D-(TOS)PUMP SEAWATER LIFT', 3, 8, 1, NULL, 63, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T07:57:07.767+00:00', NULL, NULL, NULL, true),
  (198, 34, 94, 183, 'P-332B', 'PUMP, COOLING WATER CIRCULATION', 4, 8, 6, '2020-01-16T00:00:00', 81, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T02:00:01.654+00:00', NULL, NULL, NULL, true),
  (199, 34, 94, 184, 'P-332C', 'PUMP, COOLING WATER CIRCULATION', 5, 8, 4, '2025-06-16T00:00:00', 82, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T02:03:04.821+00:00', NULL, NULL, NULL, true),
  (200, 34, 95, 196, 'P-338B', 'PUMP, DEARATOR VACUUM', 8, 8, 4, '2025-06-17T00:00:00', 83, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T02:06:02.61+00:00', NULL, NULL, NULL, true),
  (214, 79, 78, 189, 'Test-165', 'Test-165', 2, 8, 1, '2025-06-15T00:00:00', 98, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T05:26:48+00:00', NULL, NULL, 165, true),
  (213, 79, 78, 161, 'Test2', 'TEst', 1, 8, 1, '2020-12-31T00:00:00', 97, 6, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:41:22.773+00:00', NULL, NULL, NULL, true),
  (201, 79, 78, 189, 'Test', 'TEst', 2, 7, 2, '2025-06-16T00:00:00', 84, 6, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:23:01.304+00:00', NULL, NULL, NULL, true),
  (168, 34, 91, 178, 'P-625B', 'PUMP WATER INJECTION', 4, 8, 6, '2025-06-11T00:00:00', 51, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-10T17:05:15.161+00:00', NULL, NULL, NULL, true),
  (165, 34, 47, 155, '1283091823091', 'test asset 2', 1, 8, 5, '2025-06-10T00:00:00', 48, 4, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-05-10T14:09:11.867+00:00', NULL, NULL, NULL, true),
  (166, 34, 86, 171, '90124901', 'Gas Test', 1, 8, 6, '2025-06-10T00:00:00', 49, 3, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-05-10T14:17:51.185+00:00', NULL, '2025-06-10T14:30:55.406+00:00', NULL, true),
  (167, 34, 91, 177, 'P-625A', 'PUMP WATER INJECTION', 2, 8, 4, '2025-06-04T00:00:00', 50, 3, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-05-10T17:03:13.302+00:00', NULL, '2025-06-12T01:59:41.898+00:00', NULL, true);

-- e_asset_detail (67 records)
TRUNCATE TABLE public.e_asset_detail RESTART IDENTITY CASCADE;
INSERT INTO public.e_asset_detail ("id", "category_id", "type_id", "manufacturer_id", "maker_no", "model", "hs_code", "serial_number", "area_id", "asset_class_id", "specification", "is_integrity", "is_reliability", "is_active", "iot_sensor_id", "created_by", "created_at", "updated_by", "updated_at", "bom_id", "drawing_no", "ex_class", "ex_certificate", "asset_image_path", "is_sce", "is_criticality", "criticality_id", "sce_id", "asset_id") VALUES
  (72, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:18:00.526+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, NULL),
  (73, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:22:02.699+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, NULL),
  (74, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:23:09.77+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, NULL),
  (75, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:29:14.724+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, NULL),
  (58, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T11:55:46.911+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 175),
  (45, 2, 1, 1, '320948093214', '09214109', '1204109', '1209489012', NULL, NULL, 'test', false, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-05T10:13:20.623+00:00', NULL, NULL, NULL, '21314', '1234123', '1232134', NULL, false, false, NULL, NULL, NULL),
  (47, 1, 2, 2, '32840982309', '12489012840912', '82390480923', '09238490238', NULL, NULL, 'mustaqeem', false, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-05T11:01:54.528+00:00', NULL, NULL, NULL, '3284092840923', '234234', '234234', NULL, false, false, NULL, NULL, NULL),
  (82, 1, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T02:03:04.713+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 199),
  (41, 2, 1, 2, '32098409238490', '80924890124', '3209482903', '09238409281349', NULL, NULL, 'This is a asset specification test', true, false, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-05T09:42:51.824+00:00', NULL, NULL, NULL, '32098409234', '235234213451', '2345124124', NULL, false, false, NULL, NULL, NULL),
  (42, 2, 1, 2, '32098409238490', '80924890124', '3209482903', '09238409281349', NULL, NULL, 'This is a asset specification test', true, false, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-05T09:43:15.39+00:00', NULL, NULL, NULL, '32098409234', '235234213451', '2345124124', NULL, false, false, NULL, NULL, NULL),
  (43, 2, 1, 2, '32098409238490', '80924890124', '3209482903', '09238409281349', NULL, NULL, 'This is a asset specification test', true, false, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-05T09:44:07.499+00:00', NULL, NULL, NULL, '32098409234', '235234213451', '2345124124', NULL, false, false, NULL, NULL, NULL),
  (44, 2, 1, 2, '32098409238490', '80924890124', '3209482903', '09238409281349', NULL, NULL, 'This is a asset specification test', true, false, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-05T09:44:58.03+00:00', NULL, NULL, NULL, '32098409234', '235234213451', '2345124124', NULL, false, false, NULL, NULL, NULL),
  (59, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T11:58:57.42+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 176),
  (61, 1, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T07:48:19.822+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 178),
  (83, 3, 7, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T02:06:02.45+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 200),
  (62, 1, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T07:53:56.937+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, 179),
  (1, 1, 1, 1, 'maker 1', 'model 1', 'hs1', 'serial 1', NULL, NULL, 'test specification', true, false, true, 1, NULL, NULL, NULL, NULL, 23, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (2, 1, 1, 2, 'maker 1', 'model 1', 'hs1', 'serial 1', NULL, NULL, 'test specification', true, false, true, 1, NULL, NULL, NULL, NULL, 23, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (3, 1, 2, 1, 'maker 1', 'model 1', 'hs1', 'serial 1', NULL, NULL, 'test specification', false, true, true, 1, NULL, NULL, NULL, NULL, 23, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (4, 1, 3, 2, 'maker 1', 'model 1', 'hs1', 'serial 1', NULL, NULL, 'test specification', false, true, true, 1, NULL, NULL, NULL, NULL, 23, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (63, 4, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T07:57:07.606+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, 180),
  (5, 1, 2, 1, 'maker 1', 'model 1', 'hs1', 'serial 1', NULL, NULL, 'test specification', false, false, true, 1, NULL, NULL, NULL, NULL, 23, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (68, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:10:25.448+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, 185),
  (6, 1, 3, 2, 'maker 1', 'model 1', 'hs1', 'serial 1', NULL, NULL, 'test specification', false, false, true, 1, NULL, NULL, NULL, NULL, 23, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (69, 3, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:12:24.932+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, 186),
  (64, 3, 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T08:00:01.654+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (65, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T08:09:23.26+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (66, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T08:16:42.187+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (67, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:08:31.071+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, NULL),
  (7, 1, 3, 2, 'maker 1', 'model 1', 'hs1', 'serial 1', NULL, NULL, 'test specification', false, false, true, 1, NULL, NULL, NULL, NULL, 23, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (8, 1, 2, 1, 'maker 1', 'model 1', 'hs1', 'serial 1', NULL, NULL, 'test specification', false, false, true, 1, NULL, NULL, NULL, NULL, 23, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (9, 1, 3, 2, 'maker 1', 'model 1', 'hs1', 'serial 1', NULL, NULL, 'test specification', false, false, true, 1, NULL, NULL, NULL, NULL, 23, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL),
  (51, 1, 4, 1, NULL, NULL, NULL, NULL, NULL, 5, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-10T17:05:14.716+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 168),
  (52, 1, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-10T17:06:42.027+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 169),
  (50, 1, 1, 1, NULL, NULL, NULL, NULL, 1, 4, NULL, false, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-10T17:03:13.213+00:00', NULL, '2025-06-12T01:59:41.943+00:00', NULL, NULL, NULL, NULL, NULL, true, false, NULL, 3, 167),
  (53, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-11T03:56:27.118+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 170),
  (54, 3, 11, 9, NULL, NULL, NULL, NULL, 1, 4, NULL, true, false, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-11T23:21:56.721+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, 2, NULL, 171),
  (70, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:13:33.076+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, 187),
  (57, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T11:54:10.928+00:00', NULL, '2025-06-12T11:59:20.62+00:00', NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 174),
  (55, 3, 6, NULL, NULL, NULL, NULL, NULL, 1, 2, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T11:51:18.674+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 172),
  (56, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T11:52:30.744+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 173),
  (71, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:14:56.561+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, 188),
  (76, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:31:13.343+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, 193),
  (77, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:33:02.818+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, 194),
  (78, 1, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:34:45.142+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, 195),
  (79, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T09:36:08.699+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, NULL, NULL, 196),
  (80, 3, 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-13T10:06:32.588+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 197),
  (81, 1, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, true, true, NULL, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T02:00:01.424+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, 198),
  (46, 2, 1, 1, '320948093214', '09214109', '1204109', '1209489012', NULL, NULL, 'test', false, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-05T10:16:42.442+00:00', NULL, NULL, NULL, '21314', '1234123', '1232134', NULL, false, false, NULL, NULL, NULL),
  (85, 2, 2, 4, 'MAKE-001', 'MOD-001', 'HS-001', 'SER-001', 2, 2, 'Spec', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:27:53.403+00:00', NULL, NULL, NULL, 'DRW-001', 'Clas-001', 'CErt-011', NULL, true, true, 1, 6, NULL),
  (86, 2, 2, 4, 'MAKE-001', 'MOD-001', 'HS-001', 'SER-001', 2, 2, 'Spec', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:28:03.769+00:00', NULL, NULL, NULL, 'DRW-001', 'Clas-001', 'CErt-011', NULL, true, true, 1, 6, NULL),
  (87, 2, 2, 4, 'MAKE-001', 'MOD-001', 'HS-001', 'SER-001', 2, 2, 'Spec', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:29:33.756+00:00', NULL, NULL, NULL, 'DRW-001', 'Clas-001', 'CErt-011', NULL, true, true, 1, 6, NULL),
  (88, 2, 1, 3, 'MAKE-001', 'ASSET-001', 'HS-001', 'SER-001', 1, 1, 'Spce', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:31:16.244+00:00', NULL, NULL, NULL, 'DRW-001', 'EX-001', 'CERT-001', NULL, true, true, 1, 6, NULL),
  (89, 2, 1, 3, 'MAKE-001', 'ASSET-001', 'HS-001', 'SER-001', 1, 1, 'Spce', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:33:30.895+00:00', NULL, NULL, NULL, 'DRW-001', 'EX-001', 'CERT-001', NULL, true, true, 1, 6, NULL),
  (90, 2, 1, 3, 'MAKE-001', 'ASSET-001', 'HS-001', 'SER-001', 1, 1, 'Spce', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:34:03.468+00:00', NULL, NULL, NULL, 'DRW-001', 'EX-001', 'CERT-001', NULL, true, true, 1, 6, NULL),
  (91, 2, 1, 3, 'MAKE-001', 'ASSET-001', 'HS-001', 'SER-001', 1, 1, 'Spce', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:34:19.144+00:00', NULL, NULL, NULL, 'DRW-001', 'EX-001', 'CERT-001', NULL, true, true, 1, 6, NULL),
  (92, 2, 1, 3, 'MAKE-001', 'ASSET-001', 'HS-001', 'SER-001', 1, 1, 'Spce', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:37:16.174+00:00', NULL, NULL, NULL, 'DRW-001', 'EX-001', 'CERT-001', NULL, true, true, 1, 6, NULL),
  (93, 2, 1, 3, 'MAKE-001', 'ASSET-001', 'HS-001', 'SER-001', 1, 1, 'Spce', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:37:44.814+00:00', NULL, NULL, NULL, 'DRW-001', 'EX-001', 'CERT-001', NULL, true, true, 1, 6, NULL),
  (94, 2, 1, 3, 'MAKE-001', 'ASSET-001', 'HS-001', 'SER-001', 1, 1, 'Spce', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:38:10.777+00:00', NULL, NULL, NULL, 'DRW-001', 'EX-001', 'CERT-001', NULL, true, true, 1, 6, NULL),
  (95, 2, 1, 3, 'MAKE-001', 'ASSET-001', 'HS-001', 'SER-001', 1, 1, 'Spce', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:39:55.079+00:00', NULL, NULL, NULL, 'DRW-001', 'EX-001', 'CERT-001', NULL, true, true, 1, 6, NULL),
  (96, 2, 1, 3, 'MAKE-001', 'ASSET-001', 'HS-001', 'SER-001', 1, 1, 'Spce', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:41:10.534+00:00', NULL, NULL, NULL, 'DRW-001', 'EX-001', 'CERT-001', NULL, true, true, 1, 6, NULL),
  (48, 3, 3, 1, '1290849129', 'test model', '019284901', '012948198940', 1, 1, 'test spreci', true, false, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-10T14:09:11.297+00:00', NULL, NULL, NULL, '901284901', 'A', 'B', NULL, true, false, NULL, NULL, 165),
  (49, 2, 6, 2, '12094810924', '90324890124', '012948190', '09124809124', 1, 2, '2309jfdisjf', false, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-10T14:17:51.069+00:00', NULL, '2025-06-10T14:30:55.926+00:00', NULL, '0912840921', 'A', 'B', NULL, true, true, 1, 3, 166),
  (98, 2, 1, 3, 'LK-001', 'MOD-001', 'KKSL-0019', 'LSL-001', 1, 2, 'Spec', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T05:26:44.085+00:00', NULL, NULL, 27, 'DRWK-012', 'TEST', 'TEST', NULL, false, false, NULL, NULL, 214),
  (60, 2, 2, 4, 'MAKE-0101', 'MOD-001', 'HS-0012', 'SER-0012', 1, 2, 'SPEC-001', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-12T15:32:50.607+00:00', NULL, NULL, NULL, 'TEST', 'TEST', 'TEST', NULL, false, false, NULL, NULL, 177),
  (84, 2, 3, 6, 'MAKE-001', 'MOD-001', 'HS001', 'SER-001', 2, 2, 'Spec', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:23:00.613+00:00', NULL, NULL, NULL, 'DRW-010', 'Test', 'TEst', NULL, true, true, 1, 6, 201),
  (97, 2, 1, 3, 'MAKE-001', 'ASSET-001', 'HS-001', 'SER-001', 1, 1, 'Spce', true, true, true, 1, '5495aba4-2446-41c3-a496-6502c0b10f4b', '2025-06-16T03:41:21.995+00:00', NULL, NULL, 39, 'DRW-001', 'EX-001', 'CERT-001', NULL, true, true, 1, 6, 213);

-- e_manufacturer (10 records)
TRUNCATE TABLE public.e_manufacturer RESTART IDENTITY CASCADE;
INSERT INTO public.e_manufacturer ("id", "name", "created_by", "created_at", "updated_by", "updated_at") VALUES
  (3, 'Baker Hughes', NULL, '2025-06-10T17:30:21.756193+00:00', NULL, NULL),
  (4, 'Halliburton', NULL, '2025-06-10T17:30:21.772308+00:00', NULL, NULL),
  (5, 'Weatherford', NULL, '2025-06-10T17:30:21.785619+00:00', NULL, NULL),
  (6, 'Emerson Automation Solutions', NULL, '2025-06-10T17:30:21.798502+00:00', NULL, NULL),
  (7, 'ABB', NULL, '2025-06-10T17:30:21.812028+00:00', NULL, NULL),
  (8, 'Siemens', NULL, '2025-06-10T17:30:21.825304+00:00', NULL, NULL),
  (9, 'Yokogawa', NULL, '2025-06-10T17:30:21.838904+00:00', NULL, NULL),
  (10, 'Schneider Electric', NULL, '2025-06-10T17:30:21.853859+00:00', NULL, NULL),
  (1, 'Cameron (Schlumberger)', NULL, NULL, NULL, '2025-06-10T17:30:21.867983+00:00'),
  (2, 'Flowserve', NULL, NULL, NULL, '2025-06-10T17:30:21.884795+00:00');

-- e_employee (20 records)
TRUNCATE TABLE public.e_employee RESTART IDENTITY CASCADE;
INSERT INTO public.e_employee ("id", "name", "uid_employee", "created_by", "created_at", "updated_by", "updated_at", "work_center_code") VALUES
  (81, 'Ahmad bin Abdullah', 'EMP10001', NULL, '2023-01-15T00:30:00+00:00', NULL, NULL, 1),
  (82, 'Siti binti Mohd Ali', 'EMP10002', NULL, '2023-01-16T01:15:00+00:00', NULL, NULL, 5),
  (83, 'Mohd Farid bin Ismail', 'EMP10003', NULL, '2023-01-17T02:20:00+00:00', NULL, NULL, 12),
  (84, 'Nor Aini binti Hassan', 'EMP10004', NULL, '2023-01-18T03:45:00+00:00', NULL, NULL, 8),
  (85, 'Abdul Rahman bin Osman', 'EMP10005', NULL, '2023-01-19T05:10:00+00:00', NULL, NULL, 3),
  (86, 'Fatimah binti Abu Bakar', 'EMP10006', NULL, '2023-01-20T06:25:00+00:00', NULL, NULL, 16),
  (87, 'Ismail bin Ibrahim', 'EMP10007', NULL, '2023-01-21T07:30:00+00:00', NULL, NULL, 7),
  (88, 'Nurul Huda binti Md Noor', 'EMP10008', NULL, '2023-01-22T08:45:00+00:00', NULL, NULL, 10),
  (89, 'Kamarul bin Ariffin', 'EMP10009', NULL, '2023-01-23T00:10:00+00:00', NULL, NULL, 2),
  (90, 'Sarah binti Ahmad', 'EMP10010', NULL, '2023-01-24T01:25:00+00:00', NULL, NULL, 14),
  (91, 'Zulkifli bin Hashim', 'EMP10011', NULL, '2023-01-25T02:40:00+00:00', NULL, NULL, 6),
  (92, 'Aishah binti Ramli', 'EMP10012', NULL, '2023-01-26T03:55:00+00:00', NULL, NULL, 9),
  (93, 'Azman bin Johari', 'EMP10013', NULL, '2023-01-27T05:20:00+00:00', NULL, NULL, 4),
  (94, 'Rohana binti Sulaiman', 'EMP10014', NULL, '2023-01-28T06:35:00+00:00', NULL, NULL, 11),
  (95, 'Hafiz bin Md Yusof', 'EMP10015', NULL, '2023-01-29T07:50:00+00:00', NULL, NULL, 15),
  (96, 'Norhayati binti Abdullah', 'EMP10016', NULL, '2023-01-30T08:05:00+00:00', NULL, NULL, 13),
  (97, 'Amir bin Mustafa', 'EMP10017', NULL, '2023-01-31T00:20:00+00:00', NULL, NULL, 1),
  (98, 'Zarina binti Kamarudin', 'EMP10018', NULL, '2023-02-01T01:35:00+00:00', NULL, NULL, 5),
  (99, 'Faizal bin Razak', 'EMP10019', NULL, '2023-02-02T02:50:00+00:00', NULL, NULL, 12),
  (100, 'Yusri bin Halim', 'EMP10020', NULL, '2023-02-03T04:05:00+00:00', NULL, NULL, 8);

COMMIT;