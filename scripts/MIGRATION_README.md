# Database Migration Guide

This document explains how to run database migrations for EPOMS-X against your local PostgreSQL database.

## Overview

The migration system allows you to run SQL migration files directly against your PostgreSQL database without using the Supabase CLI.

## Database Configuration

The migration script is configured to connect to your local PostgreSQL database with these credentials:

- **Host:** 127.0.0.1
- **Port:** 5432
- **User:** postgres.myepomsx-1
- **Password:** P9kL2mN8qX7vB4hR6tE3wY5uI1oA0sD9fG8jH7kL2mN6qX9vB4hR8tE1wY5uI0oA
- **Database:** postgres

## Available Commands

### Test Database Connection
```bash
npm run migrate:test
```
Tests the connection to your PostgreSQL database.

### Check Migration Status
```bash
npm run migrate:status
```
Shows which migrations have been applied and which are pending.

### Run Migrations
```bash
npm run migrate
```
Runs all pending migrations in order.

### Reset Database
```bash
npm run migrate:reset
```
⚠️ **WARNING:** This will drop all tables in the database! Use with caution.

## Migration Files

Migration files are stored in `supabase/migrations/` and follow this naming convention:
- `{timestamp}_{description}.sql`

Currently applied migrations:
- ✅ `1750750310_initial_public_schema.sql` - Creates all database tables and functions
- ✅ `1750750500_minimal_seed.sql` - Adds basic seed data (user types, clients)

## How It Works

1. **Migration Tracking**: The system creates a `supabase_migrations.schema_migrations` table to track which migrations have been applied.

2. **Transaction Safety**: Each migration runs in its own transaction and will rollback on error.

3. **Order Enforcement**: Migrations are applied in filename order (timestamp-based).

4. **Idempotency**: You can safely run the migrate command multiple times - it will only apply pending migrations.

## Troubleshooting

### Connection Issues
If you get connection errors, verify:
- PostgreSQL is running on the specified host/port
- Credentials are correct
- Database exists

### Migration Failures
If a migration fails:
1. Check the error message for details
2. Fix the SQL in the migration file
3. The migration will automatically retry on next run

### Schema Mismatches
If seed data doesn't match the schema:
1. Check the actual table structure in your database
2. Update the seed data to match column names and constraints
3. Test with a minimal dataset first

## Adding New Migrations

1. Create a new SQL file in `supabase/migrations/`
2. Use timestamp prefix: `YYYYMMDDHHMM_description.sql`
3. Write idempotent SQL (use `IF NOT EXISTS`, `ON CONFLICT`, etc.)
4. Test the migration with `npm run migrate`

## Example Usage

```bash
# Check what needs to be migrated
npm run migrate:status

# Run all pending migrations
npm run migrate

# Verify everything worked
npm run migrate:status
```

## Seeder Scripts

In addition to SQL migrations, you can also use the programmatic seeder:

```bash
# Run additional seeding (employees, work order statuses, etc.)
npm run seed

# Check database summary
npm run seed:summary

# Clean all seed data
npm run seed:clean
```

The seeder scripts work with your existing migrated database to add supplementary data that's easier to manage programmatically.
