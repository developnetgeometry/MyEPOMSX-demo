#!/usr/bin/env node

// Simple JavaScript seeder script for EPOMS-X database
// Run with: node scripts/seed-database.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
function loadEnv() {
    try {
        const envPath = join(__dirname, '..', '.env');
        const envFile = readFileSync(envPath, 'utf8');
        const envVars = {};

        envFile.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                envVars[key.trim()] = value.replace(/^["']|["']$/g, ''); // Remove quotes
            }
        });

        // Set environment variables
        Object.assign(process.env, envVars);

        return envVars;
    } catch (error) {
        console.error('Error loading .env file:', error.message);
        process.exit(1);
    }
}

loadEnv();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables:');
    console.error('- VITE_SUPABASE_URL:', !!supabaseUrl);
    console.error('- VITE_SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

console.log('🌱 Starting EPOMS-X Database Seeding...');

// Seeder functions
async function seedUserTypes() {
    console.log('📝 Seeding user types...');

    const { error } = await supabase.from('user_type').upsert([
        {
            id: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Admin',
            description: 'System Administrator',
            is_active: true
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440002',
            name: 'Engineer',
            description: 'Maintenance Engineer',
            is_active: true
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440003',
            name: 'Technician',
            description: 'Field Technician',
            is_active: true
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440004',
            name: 'Supervisor',
            description: 'Maintenance Supervisor',
            is_active: true
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440005',
            name: 'Planner',
            description: 'Maintenance Planner',
            is_active: true
        }
    ], { onConflict: 'id' });

    if (error) {
        console.error('❌ Error seeding user types:', error);
        throw error;
    }
    console.log('✅ User types seeded successfully');
}

async function seedClients() {
    console.log('🏢 Seeding clients...');

    const { error } = await supabase.from('e_client').upsert([
        { id: 1, name: 'PETRONAS' },
        { id: 2, name: 'ExxonMobil' },
        { id: 3, name: 'Shell' },
        { id: 4, name: 'TotalEnergies' },
        { id: 5, name: 'Chevron' }
    ], { onConflict: 'id' });

    if (error) {
        console.error('❌ Error seeding clients:', error);
        throw error;
    }
    console.log('✅ Clients seeded successfully');
}

async function seedProjects() {
    console.log('🏗️ Seeding projects...');

    // First seed project types
    const { error: projectTypeError } = await supabase.from('e_project_type').upsert([
        { name: 'Oil & Gas Production' },
        { name: 'Refinery Operations' },
        { name: 'Petrochemical Plant' },
        { name: 'LNG Terminal' },
        { name: 'Offshore Platform' }
    ], { onConflict: 'name' });

    if (projectTypeError) {
        console.error('❌ Error seeding project types:', projectTypeError);
        throw projectTypeError;
    }

    // Then seed projects
    const { error } = await supabase.from('e_project').upsert([
        {
            id: 1,
            project_name: 'Kimanis Gas Terminal',
            project_code: 'KGT-2024',
            client_id: 1,
            project_type: 1,
            start_date: '2024-01-01',
            end_date: '2026-12-31',
            is_active: true
        },
        {
            id: 2,
            project_name: 'Melaka Refinery Upgrade',
            project_code: 'MRU-2024',
            client_id: 1,
            project_type: 2,
            start_date: '2024-03-01',
            end_date: '2025-12-31',
            is_active: true
        },
        {
            id: 3,
            project_name: 'Pengerang Integrated Complex',
            project_code: 'PIC-2024',
            client_id: 1,
            project_type: 3,
            start_date: '2024-02-01',
            end_date: '2027-06-30',
            is_active: true
        }
    ], { onConflict: 'id' });

    if (error) {
        console.error('❌ Error seeding projects:', error);
        throw error;
    }
    console.log('✅ Projects seeded successfully');
}

async function seedFacilities() {
    console.log('🏭 Seeding facilities...');

    const { error } = await supabase.from('e_facility').upsert([
        {
            id: 1,
            location_code: 'KGT-MAIN',
            location_name: 'Kimanis Gas Terminal - Main Area',
            address: 'Kimanis, Sabah, Malaysia',
            is_active: true,
            project_id: 1
        },
        {
            id: 2,
            location_code: 'KGT-UTIL',
            location_name: 'Kimanis Gas Terminal - Utilities',
            address: 'Kimanis, Sabah, Malaysia',
            is_active: true,
            project_id: 1
        },
        {
            id: 3,
            location_code: 'MRU-PROC',
            location_name: 'Melaka Refinery - Process Unit',
            address: 'Melaka, Malaysia',
            is_active: true,
            project_id: 2
        }
    ], { onConflict: 'id' });

    if (error) {
        console.error('❌ Error seeding facilities:', error);
        throw error;
    }
    console.log('✅ Facilities seeded successfully');
}

async function seedSystems() {
    console.log('⚙️ Seeding systems...');

    const { error } = await supabase.from('e_system').upsert([
        { id: 1, facility_id: 1, system_code: 'SYS-01', system_no: '01', system_name: 'Gas Reception System', is_active: true },
        { id: 2, facility_id: 1, system_code: 'SYS-02', system_no: '02', system_name: 'Gas Processing System', is_active: true },
        { id: 3, facility_id: 1, system_code: 'SYS-03', system_no: '03', system_name: 'Compression System', is_active: true },
        { id: 4, facility_id: 2, system_code: 'SYS-04', system_no: '04', system_name: 'Power Generation System', is_active: true },
        { id: 5, facility_id: 2, system_code: 'SYS-05', system_no: '05', system_name: 'Water Treatment System', is_active: true },
        { id: 6, facility_id: 3, system_code: 'SYS-06', system_no: '06', system_name: 'Crude Distillation Unit', is_active: true }
    ], { onConflict: 'id' });

    if (error) {
        console.error('❌ Error seeding systems:', error);
        throw error;
    }
    console.log('✅ Systems seeded successfully');
}

async function seedPackages() {
    console.log('📦 Seeding packages...');

    // First seed package types
    const { error: packageTypeError } = await supabase.from('e_package_type').upsert([
        { name: 'Mechanical Package' },
        { name: 'Electrical Package' },
        { name: 'Instrumentation Package' },
        { name: 'Piping Package' },
        { name: 'Civil Package' }
    ], { onConflict: 'name' });

    if (packageTypeError) {
        console.error('❌ Error seeding package types:', packageTypeError);
        throw packageTypeError;
    }

    // Then seed packages
    const { error } = await supabase.from('e_package').upsert([
        { id: 1, system_id: 1, package_code: 'PKG-01A', package_name: 'Gas Metering Package A', package_type_id: 3, is_active: true },
        { id: 2, system_id: 1, package_code: 'PKG-01B', package_name: 'Gas Separator Package B', package_type_id: 1, is_active: true },
        { id: 3, system_id: 2, package_code: 'PKG-02A', package_name: 'Dehydration Package', package_type_id: 1, is_active: true },
        { id: 4, system_id: 3, package_code: 'PKG-03A', package_name: 'Compressor Package A', package_type_id: 1, is_active: true },
        { id: 5, system_id: 3, package_code: 'PKG-03B', package_name: 'Compressor Package B', package_type_id: 1, is_active: true }
    ], { onConflict: 'id' });

    if (error) {
        console.error('❌ Error seeding packages:', error);
        throw error;
    }
    console.log('✅ Packages seeded successfully');
}

async function seedAssetMasterData() {
    console.log('🏭 Seeding asset master data...');

    // Asset Status
    const { error: statusError } = await supabase.from('e_asset_status').upsert([
        { name: 'Operational', is_active: true },
        { name: 'Under Maintenance', is_active: true },
        { name: 'Out of Service', is_active: true },
        { name: 'Decommissioned', is_active: true },
        { name: 'Standby', is_active: true },
        { name: 'Testing', is_active: true }
    ], { onConflict: 'name' });

    if (statusError) {
        console.error('❌ Error seeding asset status:', statusError);
        throw statusError;
    }

    // Asset Tags
    const { error: tagError } = await supabase.from('e_asset_tag').upsert([
        { name: 'Critical Equipment', is_active: true },
        { name: 'Safety Critical', is_active: true },
        { name: 'High Priority', is_active: true },
        { name: 'Standard', is_active: true },
        { name: 'Low Priority', is_active: true },
        { name: 'Spare Equipment', is_active: true }
    ], { onConflict: 'name' });

    if (tagError) {
        console.error('❌ Error seeding asset tags:', tagError);
        throw tagError;
    }

    // Manufacturers
    const { error: mfgError } = await supabase.from('e_manufacturer').upsert([
        { name: 'Flowserve' },
        { name: 'KSB' },
        { name: 'Grundfos' },
        { name: 'Sulzer' },
        { name: 'Weir' },
        { name: 'Atlas Copco' },
        { name: 'Ingersoll Rand' },
        { name: 'Siemens' },
        { name: 'ABB' },
        { name: 'Schneider Electric' }
    ], { onConflict: 'name' });

    if (mfgError) {
        console.error('❌ Error seeding manufacturers:', mfgError);
        throw mfgError;
    }

    console.log('✅ Asset master data seeded successfully');
}

async function seedSampleAssets() {
    console.log('🔧 Seeding sample assets...');

    const { error } = await supabase.from('e_asset').upsert([
        {
            id: 1,
            facility_id: 1,
            system_id: 1,
            package_id: 1,
            asset_no: 'P-101A',
            asset_name: 'Main Gas Booster Pump A',
            asset_tag_id: 2,
            status_id: 1,
            commission_date: '2024-06-01',
            is_active: true
        },
        {
            id: 2,
            facility_id: 1,
            system_id: 1,
            package_id: 1,
            asset_no: 'P-101B',
            asset_name: 'Main Gas Booster Pump B',
            asset_tag_id: 2,
            status_id: 5,
            commission_date: '2024-06-01',
            is_active: true
        },
        {
            id: 3,
            facility_id: 1,
            system_id: 2,
            package_id: 3,
            asset_no: 'C-201A',
            asset_name: 'Gas Dehydration Compressor A',
            asset_tag_id: 2,
            status_id: 1,
            commission_date: '2024-07-15',
            is_active: true
        }
    ], { onConflict: 'id' });

    if (error) {
        console.error('❌ Error seeding sample assets:', error);
        throw error;
    }
    console.log('✅ Sample assets seeded successfully');
}

async function showSummary() {
    console.log('\n📊 Database Seeding Summary:');
    console.log('='.repeat(40));

    const tables = [
        { name: 'user_type', label: 'User Types' },
        { name: 'e_client', label: 'Clients' },
        { name: 'e_project', label: 'Projects' },
        { name: 'e_facility', label: 'Facilities' },
        { name: 'e_system', label: 'Systems' },
        { name: 'e_package', label: 'Packages' },
        { name: 'e_asset', label: 'Assets' },
        { name: 'e_asset_status', label: 'Asset Status' },
        { name: 'e_asset_tag', label: 'Asset Tags' },
        { name: 'e_manufacturer', label: 'Manufacturers' }
    ];

    for (const table of tables) {
        try {
            const { count, error } = await supabase
                .from(table.name)
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.log(`❌ ${table.label}: Error - ${error.message}`);
            } else {
                console.log(`✅ ${table.label}: ${count} records`);
            }
        } catch (error) {
            console.log(`❌ ${table.label}: Error accessing table`);
        }
    }
    console.log('='.repeat(40));
}

// Main seeding function
async function seedDatabase() {
    try {
        console.log('🚀 Starting database seeding process...\n');

        await seedUserTypes();
        await seedClients();
        await seedProjects();
        await seedFacilities();
        await seedSystems();
        await seedPackages();
        await seedAssetMasterData();
        await seedSampleAssets();

        console.log('\n🎉 Database seeding completed successfully!\n');

        await showSummary();

    } catch (error) {
        console.error('\n💥 Database seeding failed:', error);
        process.exit(1);
    }
}

// CLI commands
const command = process.argv[2] || 'seed';

switch (command) {
    case 'seed':
        seedDatabase();
        break;
    case 'summary':
        showSummary();
        break;
    case 'test':
        console.log('🧪 Testing database connection...');
        supabase.from('user_type').select('count', { count: 'exact', head: true })
            .then(({ count, error }) => {
                if (error) {
                    console.error('❌ Database connection failed:', error);
                    process.exit(1);
                } else {
                    console.log(`✅ Database connection successful! Found ${count} user types.`);
                }
            });
        break;
    default:
        console.log(`
Usage: node scripts/seed-database.js [command]

Commands:
  seed      Seed the database with initial data (default)
  summary   Show summary of current data
  test      Test database connection

Examples:
  node scripts/seed-database.js
  node scripts/seed-database.js summary
  node scripts/seed-database.js test
    `);
        break;
}
