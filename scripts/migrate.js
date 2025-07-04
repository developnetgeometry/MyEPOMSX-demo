#!/usr/bin/env node
/**
 * Direct PostgreSQL Migration Runner for EPOMS-X
 * 
 * This script runs migrations directly against a PostgreSQL database
 * without using the Supabase CLI.
 * 
 * Usage:
 *   node scripts/migrate.js [command]
 *   
 * Commands:
 *   migrate   - Run all pending migrations (default)
 *   status    - Show migration status
 *   reset     - Reset database (drops all tables)
 */

import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const dbConfig = {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres.myepomsx-1',
    password: 'P9kL2mN8qX7vB4hR6tE3wY5uI1oA0sD9fG8jH7kL2mN6qX9vB4hR8tE1wY5uI0oA',
    database: 'postgres'
};

const migrationsDir = path.join(__dirname, '../supabase/migrations');

/**
 * Create a database connection
 */
async function createConnection() {
    const client = new Client(dbConfig);
    await client.connect();
    return client;
}

/**
 * Create migrations tracking table if it doesn't exist
 */
async function createMigrationsTable(client) {
    const createTableSQL = `
    CREATE SCHEMA IF NOT EXISTS supabase_migrations;
    
    CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      statements TEXT[],
      name VARCHAR(255),
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

    await client.query(createTableSQL);
    console.log('✅ Migrations tracking table ready');
}

/**
 * Get list of applied migrations
 */
async function getAppliedMigrations(client) {
    const result = await client.query(
        'SELECT version FROM supabase_migrations.schema_migrations ORDER BY version'
    );
    return result.rows.map(row => row.version);
}

/**
 * Get list of available migration files
 */
function getAvailableMigrations() {
    if (!fs.existsSync(migrationsDir)) {
        console.error('❌ Migrations directory not found:', migrationsDir);
        return [];
    }

    return fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort()
        .map(file => ({
            version: file.replace('.sql', ''),
            filename: file,
            filepath: path.join(migrationsDir, file)
        }));
}

/**
 * Run a single migration file
 */
async function runMigration(client, migration) {
    console.log(`🔄 Running migration: ${migration.filename}`);

    try {
        // Read migration file
        const sql = fs.readFileSync(migration.filepath, 'utf8');

        // Begin transaction
        await client.query('BEGIN');

        // Execute migration
        await client.query(sql);

        // Record migration as applied
        await client.query(
            'INSERT INTO supabase_migrations.schema_migrations (version, name) VALUES ($1, $2)',
            [migration.version, migration.filename]
        );

        // Commit transaction
        await client.query('COMMIT');

        console.log(`✅ Migration completed: ${migration.filename}`);

    } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        console.error(`❌ Migration failed: ${migration.filename}`);
        console.error('Error:', error.message);

        // Stop on first error
        throw error;
    }
}

/**
 * Run all pending migrations
 */
async function runMigrations() {
    const client = await createConnection();

    try {
        console.log('🚀 Starting database migration...');

        // Create migrations table
        await createMigrationsTable(client);

        // Get applied and available migrations
        const appliedMigrations = await getAppliedMigrations(client);
        const availableMigrations = getAvailableMigrations();

        if (availableMigrations.length === 0) {
            console.log('ℹ️  No migration files found');
            return;
        }

        // Find pending migrations
        const pendingMigrations = availableMigrations.filter(
            migration => !appliedMigrations.includes(migration.version)
        );

        if (pendingMigrations.length === 0) {
            console.log('✅ All migrations are up to date');
            return;
        }

        console.log(`📋 Found ${pendingMigrations.length} pending migration(s)`);

        // Run each pending migration
        for (const migration of pendingMigrations) {
            await runMigration(client, migration);
        }

        console.log('🎉 All migrations completed successfully!');

    } catch (error) {
        console.error('❌ Migration process failed:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

/**
 * Show migration status
 */
async function showStatus() {
    const client = await createConnection();

    try {
        await createMigrationsTable(client);

        const appliedMigrations = await getAppliedMigrations(client);
        const availableMigrations = getAvailableMigrations();

        console.log('📊 Migration Status:');
        console.log('===================');

        if (availableMigrations.length === 0) {
            console.log('ℹ️  No migration files found');
            return;
        }

        availableMigrations.forEach(migration => {
            const isApplied = appliedMigrations.includes(migration.version);
            const status = isApplied ? '✅ Applied' : '⏳ Pending';
            console.log(`${status} - ${migration.filename}`);
        });

        const pendingCount = availableMigrations.filter(
            migration => !appliedMigrations.includes(migration.version)
        ).length;

        console.log('===================');
        console.log(`📋 Total: ${availableMigrations.length} migrations`);
        console.log(`✅ Applied: ${appliedMigrations.length} migrations`);
        console.log(`⏳ Pending: ${pendingCount} migrations`);

    } catch (error) {
        console.error('❌ Failed to get migration status:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

/**
 * Reset database (drops all tables)
 */
async function resetDatabase() {
    const client = await createConnection();

    try {
        console.log('⚠️  WARNING: This will drop all tables in the database!');

        // Drop all tables in public schema
        const dropTablesSQL = `
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
      
      -- Drop all sequences
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
          EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequence_name) || ' CASCADE';
        END LOOP;
      END $$;
      
      -- Drop all functions
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT proname, pg_get_function_identity_arguments(oid) as args FROM pg_proc WHERE pronamespace = 'public'::regnamespace) LOOP
          EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
        END LOOP;
      END $$;
      
      -- Drop migrations schema if exists
      DROP SCHEMA IF EXISTS supabase_migrations CASCADE;
    `;

        await client.query(dropTablesSQL);
        console.log('✅ Database reset completed');

    } catch (error) {
        console.error('❌ Database reset failed:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

/**
 * Test database connection
 */
async function testConnection() {
    console.log('🔌 Testing database connection...');

    try {
        const client = await createConnection();

        // Test query
        const result = await client.query('SELECT version()');
        console.log('✅ Connection successful!');
        console.log('📋 PostgreSQL version:', result.rows[0].version.split(' ')[1]);

        await client.end();

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('📋 Connection details:');
        console.error(`   Host: ${dbConfig.host}:${dbConfig.port}`);
        console.error(`   Database: ${dbConfig.database}`);
        console.error(`   User: ${dbConfig.user}`);
        process.exit(1);
    }
}

/**
 * Main function
 */
async function main() {
    const command = process.argv[2] || 'migrate';

    try {
        switch (command) {
            case 'migrate':
                await testConnection();
                await runMigrations();
                break;
            case 'status':
                await testConnection();
                await showStatus();
                break;
            case 'reset':
                await testConnection();
                await resetDatabase();
                break;
            case 'test':
                await testConnection();
                break;
            default:
                console.log('Usage:');
                console.log('  node scripts/migrate.js migrate  # Run all pending migrations');
                console.log('  node scripts/migrate.js status   # Show migration status');
                console.log('  node scripts/migrate.js reset    # Reset database (drops all tables)');
                console.log('  node scripts/migrate.js test     # Test database connection');
                break;
        }
    } catch (error) {
        console.error('❌ Command failed:', error.message);
        process.exit(1);
    }
}

// Run the main function
main();
