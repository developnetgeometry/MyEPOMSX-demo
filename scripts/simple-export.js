#!/usr/bin/env node
/**
 * Simple Supabase Data Exporter using REST API
 * 
 * This script exports data from your Supabase database using the REST API
 * which is more reliable than direct PostgreSQL connections.
 * 
 * Usage:
 *   node scripts/simple-export.js [options]
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Remote Supabase configuration
const REMOTE_CONFIG = {
  url: 'https://tkkvtfrpujxkznatclpq.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRra3Z0ZnJwdWp4a3puYXRjbHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzEyODY3OSwiZXhwIjoyMDU4NzA0Njc5fQ.QsxUe6J1MCSYpWhnR53x5VauYveREOv9N0uBstf0QAQ'
};

// Common table names in EPOMS-X
const PUBLIC_TABLES = [
  'user_type',
  'e_client',
  'e_project',
  'e_facility', 
  'e_system',
  'e_package',
  'e_asset',
  'e_asset_detail',
  'e_manufacturer',
  'e_employee',
  'e_pm_work_order_status',
  'e_asset_status',
  'e_asset_tag',
  'e_asset_class',
  'e_asset_area',
  'e_asset_category_group',
  'e_asset_category',
  'e_asset_type_group',
  'e_asset_type'
];

class SimpleExporter {
  constructor() {
    this.supabase = createClient(REMOTE_CONFIG.url, REMOTE_CONFIG.serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    this.exportedData = {
      public: {},
      auth: {},
      metadata: {
        exportedAt: new Date().toISOString(),
        tables: []
      }
    };
  }

  log(message) {
    console.log(`[SIMPLE-EXPORTER] ${message}`);
  }

  async testConnection() {
    try {
      const { data, error } = await this.supabase
        .from('user_type')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      this.log('✅ Connected to Supabase successfully');
      return true;
    } catch (error) {
      this.log(`❌ Connection test failed: ${error.message}`);
      return false;
    }
  }

  async exportTable(tableName) {
    try {
      this.log(`📤 Exporting table: ${tableName}...`);
      
      const { data, error } = await this.supabase
        .from(tableName)
        .select('*');
      
      if (error) {
        if (error.message.includes('does not exist') || error.message.includes('not found')) {
          this.log(`ℹ️  Table ${tableName} does not exist, skipping...`);
          return null;
        }
        throw error;
      }
      
      if (!data || data.length === 0) {
        this.log(`ℹ️  Table ${tableName} is empty`);
        return { count: 0, data: [] };
      }
      
      this.log(`✅ Exported ${data.length} records from ${tableName}`);
      return { count: data.length, data };
      
    } catch (error) {
      this.log(`❌ Failed to export ${tableName}: ${error.message}`);
      return null;
    }
  }

  async exportAuthUsers() {
    try {
      this.log('📤 Exporting auth users...');
      
      const { data: { users }, error } = await this.supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      this.log(`✅ Exported ${users.length} auth users`);
      return { count: users.length, data: users };
      
    } catch (error) {
      this.log(`❌ Failed to export auth users: ${error.message}`);
      return null;
    }
  }

  async exportAllTables() {
    this.log('🚀 Starting data export...');
    
    // Test connection
    const connected = await this.testConnection();
    if (!connected) {
      throw new Error('Failed to connect to Supabase');
    }
    
    // Export public tables
    this.log('\n📋 Exporting public schema tables...');
    for (const tableName of PUBLIC_TABLES) {
      const result = await this.exportTable(tableName);
      if (result) {
        this.exportedData.public[tableName] = result;
        this.exportedData.metadata.tables.push(`public.${tableName}`);
      }
    }
    
    // Export auth users
    this.log('\n👥 Exporting auth users...');
    const authResult = await this.exportAuthUsers();
    if (authResult) {
      this.exportedData.auth.users = authResult;
      this.exportedData.metadata.tables.push('auth.users');
    }
  }

  generateSQL() {
    let sql = [];
    
    // Header
    sql.push('-- ============================================================================');
    sql.push('-- EPOMS-X Simple Data Export');
    sql.push(`-- Exported at: ${this.exportedData.metadata.exportedAt}`);
    sql.push('-- ============================================================================\n');
    
    sql.push('-- Disable triggers for faster inserts');
    sql.push('SET session_replication_role = \'replica\';');
    sql.push('BEGIN;\n');
    
    // Export public schema data
    sql.push('-- ============================================================================');
    sql.push('-- PUBLIC SCHEMA DATA');
    sql.push('-- ============================================================================\n');
    
    for (const [tableName, tableData] of Object.entries(this.exportedData.public)) {
      if (tableData.count > 0) {
        sql.push(`-- Table: ${tableName} (${tableData.count} records)`);
        sql.push(`TRUNCATE TABLE public.${tableName} RESTART IDENTITY CASCADE;`);
        
        const records = tableData.data;
        if (records.length > 0) {
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
        }
        sql.push('');
      }
    }
    
    // Export auth users (as comments for reference)
    if (this.exportedData.auth.users && this.exportedData.auth.users.count > 0) {
      sql.push('-- ============================================================================');
      sql.push('-- AUTH USERS (Reference - Recreate via Supabase Admin API)');
      sql.push('-- ============================================================================\n');
      
      this.exportedData.auth.users.data.forEach(user => {
        sql.push(`-- User: ${user.email}`);
        sql.push(`--   ID: ${user.id}`);
        sql.push(`--   Created: ${user.created_at}`);
        sql.push(`--   Role: ${user.role || 'authenticated'}`);
        sql.push(`--   Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
        if (user.user_metadata && Object.keys(user.user_metadata).length > 0) {
          sql.push(`--   Metadata: ${JSON.stringify(user.user_metadata)}`);
        }
        sql.push('');
      });
    }
    
    sql.push('-- Re-enable triggers');
    sql.push('SET session_replication_role = \'origin\';');
    sql.push('COMMIT;');
    
    return sql.join('\n');
  }

  generateJSON() {
    return JSON.stringify(this.exportedData, null, 2);
  }

  async saveToFile(format = 'sql') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `simple-export-${timestamp}.${format}`;
    const outputPath = path.join(__dirname, '..', 'exports', filename);
    
    // Ensure exports directory exists
    const exportsDir = path.dirname(outputPath);
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    let content;
    if (format === 'sql') {
      content = this.generateSQL();
    } else {
      content = this.generateJSON();
    }
    
    fs.writeFileSync(outputPath, content, 'utf8');
    this.log(`💾 Export saved to: ${outputPath}`);
    
    return outputPath;
  }

  async export(format = 'sql') {
    await this.exportAllTables();
    
    // Save to file
    const outputPath = await this.saveToFile(format);
    
    // Summary
    this.log('\n📊 Export Summary:');
    this.log('=================');
    
    let totalRecords = 0;
    for (const [tableName, tableData] of Object.entries(this.exportedData.public)) {
      this.log(`   ${tableName}: ${tableData.count} records`);
      totalRecords += tableData.count;
    }
    
    if (this.exportedData.auth.users) {
      this.log(`   auth.users: ${this.exportedData.auth.users.count} records`);
      totalRecords += this.exportedData.auth.users.count;
    }
    
    this.log('=================');
    this.log(`📋 Total: ${totalRecords} records exported`);
    this.log(`💾 Output: ${outputPath}`);
    
    return outputPath;
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  const format = args.includes('--json') ? 'json' : 'sql';
  
  if (args.includes('--help')) {
    console.log('Usage: node scripts/simple-export.js [options]');
    console.log('Options:');
    console.log('  --json    Export as JSON instead of SQL');
    console.log('  --help    Show this help message');
    return;
  }
  
  try {
    const exporter = new SimpleExporter();
    await exporter.export(format);
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
