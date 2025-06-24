# EPOMS-X Database Seeder

This directory contains database seeding scripts to populate your EPOMS-X Supabase database with initial master data and sample records.

## Files

- `1750750400_seed_data.sql` - SQL migration file for comprehensive database seeding
- `seed-database.js` - JavaScript seeder script for programmatic seeding
- `seed-database.ts` - TypeScript seeder script (advanced)

## Quick Start

### Option 1: Using Supabase CLI (Recommended)

```bash
# Make sure you have Supabase CLI installed and logged in
supabase db reset

# Or apply the seed migration
supabase db push
```

### Option 2: Using JavaScript Seeder

```bash
# Test database connection
node scripts/seed-database.js test

# Run the seeder
node scripts/seed-database.js

# Show summary of seeded data
node scripts/seed-database.js summary
```

### Option 3: Using NPM Scripts

```bash
# Install dependencies (if using TypeScript version)
npm install

# Run seeder
npm run seed

# Force recreate data
npm run seed:force

# Clean all seeded data
npm run seed:clean

# Show summary
npm run seed:summary
```

## What Gets Seeded

### 1. User Management
- **User Types**: Admin, Engineer, Technician, Supervisor, Planner
- Sample user roles and permissions structure

### 2. Project Structure
- **Clients**: PETRONAS, ExxonMobil, Shell, TotalEnergies, Chevron
- **Project Types**: Oil & Gas Production, Refinery Operations, etc.
- **Projects**: Kimanis Gas Terminal, Melaka Refinery Upgrade, Pengerang Integrated Complex

### 3. Asset Hierarchy
- **Facilities**: Multiple locations across Malaysia
- **Systems**: Gas Reception, Processing, Compression, Power Generation, etc.
- **Packages**: Mechanical, Electrical, Instrumentation packages
- **Package Types**: Organized by discipline

### 4. Asset Master Data
- **Asset Areas**: Process Area, Utilities Area, Storage Area, etc.
- **Asset Category Groups**: Rotating Equipment, Static Equipment, Electrical, etc.
- **Asset Categories**: 25+ categories including pumps, compressors, vessels, etc.
- **Asset Types**: Specific equipment types within each category
- **Asset Status**: Operational, Under Maintenance, Out of Service, etc.
- **Asset Tags**: Critical Equipment, Safety Critical, etc.
- **Asset Classes**: Class A-D priority classification
- **Manufacturers**: 20+ major equipment manufacturers

### 5. Sample Assets
- **Assets**: 10 sample assets including pumps, compressors, generators
- **Asset Details**: Technical specifications for each asset
- **Asset SCE Codes**: Equipment identification codes
- **Asset Installation Data**: Installation and commissioning information

### 6. Maintenance Framework
- **Disciplines**: Mechanical, Electrical, Instrumentation, Process, etc.
- **Work Centers**: Main Workshop, Field Maintenance, etc.
- **Priorities**: Emergency (1) to Low (5) with color coding
- **Frequency Types**: Calendar, Running Hours, Cycle, Condition based
- **Frequencies**: Daily, Weekly, Monthly, etc. plus hour-based intervals
- **Maintenance Types**: Preventive, Corrective, Predictive, etc.
- **Maintenance Categories**: Lubrication, Inspection, Calibration, etc.
- **Tasks**: Common maintenance tasks by discipline

### 7. Inventory Management
- **Units**: Each, Meter, Kilogram, Liter, etc.
- **Criticalities**: Critical, Important, Standard, Non-Critical
- **Item Categories**: Spare Parts, Consumables, Tools, etc.
- **Item Types**: Rotating Parts, Static Parts, Electrical Parts, etc.
- **Item Groups**: Pump Parts, Compressor Parts, etc.
- **Sample Items**: 10 sample inventory items with specifications
- **Stores**: Main Warehouse, Field Store, Chemical Storage, etc.

### 8. Work Management
- **Work Order Status**: Draft, Planned, Approved, Released, etc.
- **CM Status**: Open, In Progress, On Hold, Completed, etc.
- **Sample PM Schedules**: 5 sample preventive maintenance schedules

### 9. Human Resources
- **Sample Employees**: 5 sample employees across different disciplines

## Environment Requirements

Make sure your `.env` file contains:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Data Relationships

The seeder creates a fully interconnected dataset:

```
Clients → Projects → Facilities → Systems → Packages → Assets
                                                   ↓
                                            Asset Details ← Manufacturers
                                                   ↓
                                              SCE Codes
                                                   ↓
                                           PM Schedules ← Tasks
                                                   ↓
                                            Work Orders
```

## Customization

### Modifying Seed Data

1. **SQL Version**: Edit `1750750400_seed_data.sql` directly
2. **JavaScript Version**: Modify the data arrays in `seed-database.js`
3. **TypeScript Version**: Update the data structures in `seed-database.ts`

### Adding New Data

To add new master data:

1. Add the data to the appropriate seeder function
2. Ensure foreign key relationships are correct
3. Update sequence resets if needed
4. Test with a fresh database

### Environment-Specific Seeding

You can create different seed files for different environments:

- `seed-development.sql` - Development data
- `seed-staging.sql` - Staging data with more realistic volumes
- `seed-production.sql` - Production master data only

## Troubleshooting

### Common Issues

1. **Foreign Key Violations**: Ensure master data is seeded in the correct order
2. **Duplicate Key Errors**: Use `ON CONFLICT` clauses or check existing data
3. **Permission Errors**: Make sure you're using the service role key
4. **Connection Issues**: Verify your Supabase URL and credentials

### Reset Database

To completely reset and reseed:

```bash
# Using Supabase CLI
supabase db reset

# Or manually
npm run seed:clean
npm run seed
```

### Verify Seeding

```bash
# Check connection
node scripts/seed-database.js test

# Show data summary
node scripts/seed-database.js summary
```

## Production Notes

### Before Production Use

1. **Review Data**: Ensure all seeded data is appropriate for production
2. **Update Credentials**: Use production-specific Supabase credentials
3. **Backup**: Always backup before running seeders in production
4. **Test**: Run on a staging environment first

### Security Considerations

1. **Service Role Key**: Keep your service role key secure
2. **Row Level Security**: Ensure RLS policies are in place
3. **Audit Trail**: Monitor who runs seeders and when
4. **Data Validation**: Validate seeded data meets business requirements

## Support

For issues or questions about the seeding process:

1. Check the console output for error details
2. Verify your environment variables
3. Ensure your Supabase project is properly configured
4. Check the database logs in Supabase dashboard

The seeder is designed to be idempotent - you can run it multiple times safely.
