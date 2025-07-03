#!/usr/bin/env node
/**
 * Supabase Data Exporter
 * 
 * This script exports data from your hosted Supabase database
 * so you can import it into your self-deployed server.
 * 
 * Usage:
 *   node scripts/export-data.js [options]
 *   
 * Options:
 *   --source remote|local    Source database (default: remote)
 *   --tables table1,table2   Specific tables to export (default: all)
 *   --format sql|json        Output format (default: sql)
 *   --output filename        Output file (default: data-export.sql)
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

// Database configurations
const REMOTE_CONFIG = {
  url: 'https://tkkvtfrpujxkznatclpq.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRra3Z0ZnJwdWp4a3puYXRjbHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMjg2NzksImV4cCI6MjA1ODcwNDY3OX0.YwcLnLWpA3FzZkyQs3tZ1emQM1VBNd3fnsZV4tSmUWc',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRra3Z0ZnJwdWp4a3puYXRjbHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzEyODY3OSwiZXhwIjoyMDU4NzA0Njc5fQ.QsxUe6J1MCSYpWhnR53x5VauYveREOv9N0uBstf0QAQ'
};

const LOCAL_CONFIG = {
  url: process.env.VITE_SUPABASE_URL || 'http://localhost:8000',
  anonKey: process.env.VITE_SUPABASE_ANON_KEY,
  serviceKey: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
};

// Tables to export from public schema
const PUBLIC_TABLES = [
  'user_type',
  'e_client',
  'e_project_type', 
  'e_project',
  'e_facility',
  'e_system',
  'e_package_type',
  'e_package',
  'e_asset_area',
  'e_asset_category_group',
  'e_asset_category',
  'e_asset_type_group',
  'e_asset_type',
  'e_asset_status',
  'e_asset_tag',
  'e_asset_class',
  'e_manufacturer',
  'e_asset',
  'e_asset_detail',
  'e_asset_sce',
  'e_pm_work_order_status',
  'e_employee'
];

// Auth tables (these require special handling)
const AUTH_TABLES = [
  'users',
  'identities'
];

class DataExporter {
  constructor(source = 'remote', format = 'sql', outputFile = null) {
    this.source = source;
    this.format = format;
    this.outputFile = outputFile || `data-export-${Date.now()}.${format}`;
    
    // Initialize Supabase client
    const config = source === 'remote' ? REMOTE_CONFIG : LOCAL_CONFIG;
    this.supabase = createClient(config.url, config.serviceKey, {
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
        source: source,
        tables: []
      }
    };
  }

  log(message) {
    console.log(`[EXPORTER] ${message}`);
  }

  async testConnection() {
    try {
      const { data, error } = await this.supabase
        .from('user_type')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      this.log(`✅ Connected to ${this.source} database`);
      return true;
    } catch (error) {
      this.log(`❌ Connection failed: ${error.message}`);
      return false;
    }
  }

  async exportTable(tableName, schema = 'public') {
    try {
      this.log(`📤 Exporting ${schema}.${tableName}...`);
      
      const { data, error } = await this.supabase
        .from(tableName)
        .select('*');
      
      if (error) {
        if (error.message.includes('does not exist')) {
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
      this.log('📤 Exporting auth.users...');
      
      // Use admin API to get users
      const { data: { users }, error } = await this.supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      this.log(`✅ Exported ${users.length} users from auth.users`);
      return { count: users.length, data: users };
      
    } catch (error) {
      this.log(`❌ Failed to export auth users: ${error.message}`);
      return null;
    }
  }

  async exportPublicTables(specificTables = null) {
    const tablesToExport = specificTables || PUBLIC_TABLES;
    
    for (const table of tablesToExport) {
      const result = await this.exportTable(table, 'public');
      if (result) {
        this.exportedData.public[table] = result;
        this.exportedData.metadata.tables.push(`public.${table}`);
      }
    }
  }

  async exportAuthTables() {
    // Export users via admin API
    const usersResult = await this.exportAuthUsers();
    if (usersResult) {
      this.exportedData.auth.users = usersResult;
      this.exportedData.metadata.tables.push('auth.users');
    }
  }

  generateSQLOutput() {
    let sql = [];
    
    // Header
    sql.push('-- ============================================================================');
    sql.push('-- EPOMS-X Data Export');
    sql.push(`-- Exported from: ${this.source}`);
    sql.push(`-- Exported at: ${this.exportedData.metadata.exportedAt}`);
    sql.push('-- ============================================================================\n');
    
    // Disable triggers for faster inserts
    sql.push('SET session_replication_role = \'replica\';\n');
    
    // Export public tables
    sql.push('-- ============================================================================');
    sql.push('-- PUBLIC SCHEMA DATA');
    sql.push('-- ============================================================================\n');
    
    for (const [tableName, tableData] of Object.entries(this.exportedData.public)) {
      if (tableData.count > 0) {
        sql.push(`-- Table: ${tableName} (${tableData.count} records)`);
        sql.push(`DELETE FROM public.${tableName}; -- Clear existing data`);
        
        const records = tableData.data;
        if (records.length > 0) {
          const columns = Object.keys(records[0]).join(', ');
          sql.push(`INSERT INTO public.${tableName} (${columns}) VALUES`);
          
          const values = records.map(record => {
            const vals = Object.values(record).map(val => {
              if (val === null) return 'NULL';
              if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
              if (typeof val === 'boolean') return val ? 'true' : 'false';
              if (val instanceof Date) return `'${val.toISOString()}'`;
              return val;
            }).join(', ');
            return `  (${vals})`;
          }).join(',\n');
          
          sql.push(values + ';');
        }
        sql.push('');
      }
    }
    
    // Export auth data
    if (this.exportedData.auth.users && this.exportedData.auth.users.count > 0) {
      sql.push('-- ============================================================================');
      sql.push('-- AUTH SCHEMA DATA');
      sql.push('-- ============================================================================\n');
      
      sql.push('-- Note: Auth users should be recreated via Supabase Admin API');
      sql.push('-- This is for reference only\n');
      
      this.exportedData.auth.users.data.forEach(user => {
        sql.push(`-- User: ${user.email} (${user.id})`);
        sql.push(`-- Created: ${user.created_at}`);
        sql.push(`-- Role: ${user.role}`);
        sql.push('');
      });
    }
    
    // Re-enable triggers
    sql.push('SET session_replication_role = \'origin\';');
    sql.push('\nCOMMIT;');
    
    return sql.join('\n');
  }

  generateJSONOutput() {
    return JSON.stringify(this.exportedData, null, 2);
  }

  async saveToFile() {
    const outputPath = path.join(__dirname, '..', 'exports', this.outputFile);
    
    // Ensure exports directory exists
    const exportsDir = path.dirname(outputPath);
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    let content;
    if (this.format === 'sql') {
      content = this.generateSQLOutput();
    } else {
      content = this.generateJSONOutput();
    }
    
    fs.writeFileSync(outputPath, content, 'utf8');
    this.log(`💾 Exported data saved to: ${outputPath}`);
    
    return outputPath;
  }

  async export(specificTables = null) {
    this.log('🚀 Starting data export...');
    
    // Test connection
    const connected = await this.testConnection();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }
    
    // Export public tables
    await this.exportPublicTables(specificTables);
    
    // Export auth tables
    await this.exportAuthTables();
    
    // Save to file
    const outputPath = await this.saveToFile();
    
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
  
  let source = 'remote';
  let format = 'sql';
  let outputFile = null;
  let specificTables = null;
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--source':
        source = args[++i];
        break;
      case '--format':
        format = args[++i];
        break;
      case '--output':
        outputFile = args[++i];
        break;
      case '--tables':
        specificTables = args[++i].split(',');
        break;
      case '--help':
        console.log('Usage: node scripts/export-data.js [options]');
        console.log('Options:');
        console.log('  --source remote|local    Source database (default: remote)');
        console.log('  --tables table1,table2   Specific tables to export (default: all)');
        console.log('  --format sql|json        Output format (default: sql)');
        console.log('  --output filename        Output file (default: auto-generated)');
        return;
    }
  }
  
  try {
    const exporter = new DataExporter(source, format, outputFile);
    await exporter.export(specificTables);
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
