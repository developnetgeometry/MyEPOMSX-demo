#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://tkkvtfrpujxkznatclpq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRra3Z0ZnJwdWp4a3puYXRjbHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzEyODY3OSwiZXhwIjoyMDU4NzA0Njc5fQ.QsxUe6J1MCSYpWhnR53x5VauYveREOv9N0uBstf0QAQ'
);

const TABLES = [
  'user_type',
  'e_client', 
  'e_project',
  'e_facility',
  'e_system',
  'e_package',
  'e_asset',
  'e_asset_detail',
  'e_manufacturer',
  'e_employee'
];

async function exportData() {
  console.log('🚀 Starting export...');
  
  const exportData = {};
  let totalRecords = 0;
  
  for (const table of TABLES) {
    try {
      console.log(`📤 Exporting ${table}...`);
      const { data, error } = await supabase.from(table).select('*');
      
      if (error) {
        console.log(`⚠️  ${table}: ${error.message}`);
        continue;
      }
      
      exportData[table] = data || [];
      totalRecords += data?.length || 0;
      console.log(`✅ ${table}: ${data?.length || 0} records`);
      
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  // Export auth users
  try {
    console.log('📤 Exporting auth users...');
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (!error) {
      exportData.auth_users = users;
      totalRecords += users.length;
      console.log(`✅ auth_users: ${users.length} records`);
    }
  } catch (err) {
    console.log(`⚠️  auth_users: ${err.message}`);
  }
  
  // Generate SQL
  let sql = [];
  sql.push('-- EPOMS-X Data Export');
  sql.push(`-- Exported: ${new Date().toISOString()}`);
  sql.push('-- Total records: ' + totalRecords);
  sql.push('');
  sql.push('BEGIN;');
  sql.push('');
  
  for (const [tableName, records] of Object.entries(exportData)) {
    if (tableName === 'auth_users') continue; // Skip auth users in SQL
    
    if (records.length > 0) {
      sql.push(`-- ${tableName} (${records.length} records)`);
      sql.push(`TRUNCATE TABLE public.${tableName} RESTART IDENTITY CASCADE;`);
      
      const columns = Object.keys(records[0]);
      sql.push(`INSERT INTO public.${tableName} (${columns.map(c => `"${c}"`).join(', ')}) VALUES`);
      
      const values = records.map(record => {
        const vals = columns.map(col => {
          const val = record[col];
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
          if (typeof val === 'boolean') return val ? 'true' : 'false';
          if (val instanceof Date) return `'${val.toISOString()}'`;
          if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
          return val;
        }).join(', ');
        return `  (${vals})`;
      }).join(',\n');
      
      sql.push(values + ';');
      sql.push('');
    }
  }
  
  sql.push('COMMIT;');
  
  // Save files
  const timestamp = Date.now();
  
  // Save SQL
  const sqlFile = `exports/epoms-export-${timestamp}.sql`;
  fs.writeFileSync(sqlFile, sql.join('\n'));
  console.log(`💾 SQL saved: ${sqlFile}`);
  
  // Save JSON
  const jsonFile = `exports/epoms-export-${timestamp}.json`;
  fs.writeFileSync(jsonFile, JSON.stringify(exportData, null, 2));
  console.log(`💾 JSON saved: ${jsonFile}`);
  
  console.log(`\n📊 Export complete: ${totalRecords} total records`);
}

exportData().catch(console.error);
