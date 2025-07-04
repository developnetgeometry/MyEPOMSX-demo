# Supabase Data Export/Import Guide

This guide explains how to export data from your hosted Supabase database and import it into your self-deployed server.

## Overview

The export/import system provides multiple ways to move your data:

1. **Quick Export** (`npm run export`) - Simple, reliable export using Supabase REST API
2. **Complete Export** (`npm run export:complete`) - Full schema + data export using direct PostgreSQL
3. **Import** (`npm run import`) - Import exported data into your local database

## Quick Start

### Step 1: Export Your Data
```bash
# Export all data from your hosted Supabase
npm run export
```

This creates two files in the `exports/` folder:
- `epoms-export-{timestamp}.sql` - SQL file ready for import
- `epoms-export-{timestamp}.json` - JSON backup for reference

### Step 2: Import to Local Database
```bash
# Import the latest export into your local database
npm run import
```

## Export Commands

### Basic Export
```bash
npm run export
```
Exports all public tables and auth users from your hosted Supabase database. This is the recommended method as it's fast and reliable.

**Exports:**
- ✅ All public schema tables with data
- ✅ Auth users (as reference comments)
- ✅ Ready-to-import SQL format
- ✅ JSON backup

### JSON Export
```bash
npm run export:json
```
Same as basic export but outputs JSON format only.

### Complete Export (Advanced)
```bash
npm run export:complete
```
Attempts full schema + data export including table structures, functions, and constraints. Requires direct PostgreSQL access.

### Schema-Only Export
```bash
npm run export:schema
```
Exports only table structures and schemas, no data.

### Data-Only Export
```bash
npm run export:data
```
Exports only data, assumes tables already exist.

## Import Commands

### Basic Import
```bash
npm run import
```
Imports the latest export file into your local PostgreSQL database. This command:
1. Runs any pending migrations first
2. Imports the latest SQL export file
3. Shows import summary

### Manual Import
```bash
node scripts/import-data.js exports/your-export-file.sql
```
Import a specific export file.

## What Gets Exported

### Public Schema Tables
- ✅ `user_type` - User roles and permissions
- ✅ `e_client` - Client information
- ✅ `e_project` - Project data
- ✅ `e_facility` - Facility information
- ✅ `e_system` - System configurations
- ✅ `e_package` - Package definitions
- ✅ `e_asset` - Asset inventory
- ✅ `e_asset_detail` - Detailed asset information
- ✅ `e_manufacturer` - Manufacturer data
- ✅ `e_employee` - Employee records
- ✅ And more...

### Auth Schema
- ✅ **Auth Users** - User accounts (exported as reference comments)
- ⚠️ **Note:** Auth users should be recreated via Supabase Admin API, not directly imported

## Export Results

Your last export contained:
- **243 total records** across all tables
- **8 auth users**
- **31 assets** with detailed specifications
- **21 projects** across multiple clients
- **67 asset details** with technical specifications

## File Structure

```
exports/
├── epoms-export-{timestamp}.sql    # Main import file
├── epoms-export-{timestamp}.json   # JSON backup
└── ...                            # Previous exports
```

## Import Process

The import script:
1. **Connects** to your local PostgreSQL database
2. **Clears** existing data (TRUNCATE with CASCADE)
3. **Imports** new data in proper order
4. **Handles** data type conversions
5. **Reports** success/failure for each table

## Database Configuration

### Source (Hosted Supabase)
- **URL:** `https://tkkvtfrpujxkznatclpq.supabase.co`
- **Connection:** REST API (reliable)

### Target (Local PostgreSQL)
- **Host:** `127.0.0.1:5432`
- **Database:** `postgres`
- **User:** `postgres.supabase-dev-tenant-2025`

## Troubleshooting

### Export Issues

**Connection Failed**
```bash
# Test Supabase connection
node -e "
import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://tkkvtfrpujxkznatclpq.supabase.co', 'your-service-key');
console.log(await sb.from('user_type').select('count'));
"
```

**Missing Tables**
- Tables that don't exist are automatically skipped
- Check the export log for warnings

### Import Issues

**Connection Refused**
- Ensure your local PostgreSQL is running
- Verify connection credentials
- Test with: `npm run migrate:test`

**Foreign Key Errors**
- Run migrations first: `npm run migrate`
- Import follows proper dependency order

**Data Conflicts**
- Import uses `TRUNCATE CASCADE` to clear existing data
- Backup your local database if needed

## Advanced Usage

### Custom Table Export
```bash
# Edit scripts/quick-export.js to modify TABLES array
const TABLES = [
  'user_type',
  'e_client',
  // Add or remove tables as needed
];
```

### Schedule Regular Exports
```bash
# Add to cron for regular backups
0 2 * * * cd /path/to/project && npm run export
```

### Export Validation
```bash
# Check export integrity
npm run export
npm run migrate:status  # Ensure local DB is ready
npm run import         # Test import
npm run seed:summary   # Verify data
```

## Best Practices

1. **Regular Exports** - Export your data regularly as backups
2. **Test Imports** - Always test imports in a development environment first
3. **Version Control** - Keep track of export timestamps
4. **Migration First** - Always run migrations before importing
5. **Auth Recreation** - Recreate auth users via Supabase Admin API, don't import directly

## Security Notes

- Export files contain sensitive data - store securely
- Service keys are embedded in scripts - protect your codebase
- Local database credentials are in migration scripts
- Consider encryption for export files in production

## Support

If you encounter issues:
1. Check the export/import logs for specific error messages
2. Verify database connections with test commands
3. Ensure all dependencies are installed (`npm install`)
4. Check that both source and target databases are accessible
