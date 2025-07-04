#!/usr/bin/env node
/**
 * Complete Supabase Export Tool
 * 
 * This script exports both table structures (DDL) and data (DML) 
 * from your Supabase database including auth and public schemas.
 * 
 * Usage:
 *   node scripts/supabase-export.js [options]
 *   
 * Options:
 *   --source remote|local    Source database (default: remote)
 *   --schema auth,public     Schemas to export (default: public,auth)
 *   --data-only             Export only data, no schema
 *   --schema-only           Export only schema, no data
 *   --output filename       Output file prefix (default: supabase-export)
 */

import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configurations
const REMOTE_CONFIG = {
  // Direct PostgreSQL connection to remote Supabase
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.tkkvtfrpujxkznatclpq',
  password: 'P9kL2mN8qX7vB4hR6tE3wY5uI1oA0sD9fG8jH7kL2mN6qX9vB4hR8tE1wY5uI0oA', // You'll need to provide this
  ssl: { rejectUnauthorized: false }
};

const LOCAL_CONFIG = {
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres.supabase-dev-tenant-2025',
  password: 'P9kL2mN8qX7vB4hR6tE3wY5uI1oA0sD9fG8jH7kL2mN6qX9vB4hR8tE1wY5uI0oA',
  database: 'postgres'
};

// Supabase client for auth operations
const SUPABASE_REMOTE = {
  url: 'https://tkkvtfrpujxkznatclpq.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRra3Z0ZnJwdWp4a3puYXRjbHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzEyODY3OSwiZXhwIjoyMDU4NzA0Njc5fQ.QsxUe6J1MCSYpWhnR53x5VauYveREOv9N0uBstf0QAQ'
};

class SupabaseExporter {
  constructor(source = 'remote', schemas = ['public', 'auth'], options = {}) {
    this.source = source;
    this.schemas = schemas;
    this.options = {
      dataOnly: false,
      schemaOnly: false,
      outputPrefix: 'supabase-export',
      ...options
    };
    
    this.pgClient = null;
    this.supabaseClient = null;
    this.exportData = {
      schemas: {},
      metadata: {
        exportedAt: new Date().toISOString(),
        source: source,
        schemas: schemas
      }
    };
  }

  log(message) {
    console.log(`[EXPORTER] ${message}`);
  }

  async connect() {
    try {
      // Connect to PostgreSQL
      const config = this.source === 'remote' ? REMOTE_CONFIG : LOCAL_CONFIG;
      this.pgClient = new Client(config);
      await this.pgClient.connect();
      this.log(`✅ Connected to ${this.source} PostgreSQL database`);
      
      // Connect to Supabase for auth operations
      if (this.schemas.includes('auth')) {
        this.supabaseClient = createClient(SUPABASE_REMOTE.url, SUPABASE_REMOTE.serviceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        });
        this.log('✅ Connected to Supabase client for auth operations');
      }
      
      return true;
    } catch (error) {
      this.log(`❌ Connection failed: ${error.message}`);
      return false;
    }
  }

  async disconnect() {
    if (this.pgClient) {
      await this.pgClient.end();
      this.log('🔌 Disconnected from PostgreSQL');
    }
  }

  async getSchemaStructure(schemaName) {
    this.log(`📋 Getting structure for schema: ${schemaName}`);
    
    const structure = {
      tables: {},
      functions: {},
      types: {},
      sequences: {}
    };

    try {
      // Get tables
      const tablesQuery = `
        SELECT 
          table_name,
          table_type
        FROM information_schema.tables 
        WHERE table_schema = $1 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `;
      
      const tablesResult = await this.pgClient.query(tablesQuery, [schemaName]);
      
      for (const table of tablesResult.rows) {
        structure.tables[table.table_name] = await this.getTableStructure(schemaName, table.table_name);
      }
      
      // Get functions
      const functionsQuery = `
        SELECT 
          routine_name,
          routine_definition,
          routine_type
        FROM information_schema.routines 
        WHERE routine_schema = $1
        ORDER BY routine_name;
      `;
      
      const functionsResult = await this.pgClient.query(functionsQuery, [schemaName]);
      structure.functions = functionsResult.rows;
      
      this.log(`✅ Retrieved structure for ${schemaName}: ${Object.keys(structure.tables).length} tables, ${structure.functions.length} functions`);
      
    } catch (error) {
      this.log(`❌ Failed to get schema structure for ${schemaName}: ${error.message}`);
    }
    
    return structure;
  }

  async getTableStructure(schemaName, tableName) {
    const structure = {
      columns: [],
      constraints: [],
      indexes: [],
      triggers: []
    };

    try {
      // Get columns
      const columnsQuery = `
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default,
          ordinal_position
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position;
      `;
      
      const columnsResult = await this.pgClient.query(columnsQuery, [schemaName, tableName]);
      structure.columns = columnsResult.rows;
      
      // Get constraints
      const constraintsQuery = `
        SELECT 
          constraint_name,
          constraint_type,
          column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = $1 AND tc.table_name = $2;
      `;
      
      const constraintsResult = await this.pgClient.query(constraintsQuery, [schemaName, tableName]);
      structure.constraints = constraintsResult.rows;
      
    } catch (error) {
      this.log(`⚠️  Could not get full structure for ${schemaName}.${tableName}: ${error.message}`);
    }
    
    return structure;
  }

  async getTableData(schemaName, tableName) {
    try {
      this.log(`📤 Exporting data from ${schemaName}.${tableName}...`);
      
      const query = `SELECT * FROM ${schemaName}.${tableName}`;
      const result = await this.pgClient.query(query);
      
      this.log(`✅ Exported ${result.rows.length} records from ${schemaName}.${tableName}`);
      return result.rows;
      
    } catch (error) {
      this.log(`❌ Failed to export data from ${schemaName}.${tableName}: ${error.message}`);
      return [];
    }
  }

  async getAuthUsers() {
    if (!this.supabaseClient) {
      this.log('⚠️  Supabase client not available for auth export');
      return [];
    }

    try {
      this.log('📤 Exporting auth users...');
      
      const { data: { users }, error } = await this.supabaseClient.auth.admin.listUsers();
      
      if (error) throw error;
      
      this.log(`✅ Exported ${users.length} auth users`);
      return users;
      
    } catch (error) {
      this.log(`❌ Failed to export auth users: ${error.message}`);
      return [];
    }
  }

  async exportSchema(schemaName) {
    this.log(`🚀 Starting export for schema: ${schemaName}`);
    
    const schemaData = {
      structure: {},
      data: {}
    };

    // Export structure
    if (!this.options.dataOnly) {
      schemaData.structure = await this.getSchemaStructure(schemaName);
    }

    // Export data
    if (!this.options.schemaOnly) {
      if (schemaName === 'auth') {
        // Special handling for auth schema
        schemaData.data.users = await this.getAuthUsers();
        
        // Try to get auth tables directly if possible
        try {
          const authTables = ['users', 'identities', 'sessions'];
          for (const tableName of authTables) {
            try {
              const data = await this.getTableData('auth', tableName);
              if (data.length > 0) {
                schemaData.data[tableName] = data;
              }
            } catch (error) {
              this.log(`ℹ️  Could not access auth.${tableName} directly: ${error.message}`);
            }
          }
        } catch (error) {
          this.log(`ℹ️  Direct auth table access not available: ${error.message}`);
        }
      } else {
        // Export public schema tables
        const structure = schemaData.structure || await this.getSchemaStructure(schemaName);
        
        for (const tableName of Object.keys(structure.tables)) {
          const data = await this.getTableData(schemaName, tableName);
          if (data.length > 0) {
            schemaData.data[tableName] = data;
          }
        }
      }
    }

    this.exportData.schemas[schemaName] = schemaData;
    this.log(`✅ Completed export for schema: ${schemaName}`);
  }

  generateCreateTableSQL(schemaName, tableName, tableStructure) {
    let sql = [`CREATE TABLE IF NOT EXISTS "${schemaName}"."${tableName}" (`];
    
    const columnDefs = tableStructure.columns.map(col => {
      let def = `  "${col.column_name}" ${col.data_type}`;
      
      if (col.character_maximum_length) {
        def += `(${col.character_maximum_length})`;
      }
      
      if (col.is_nullable === 'NO') {
        def += ' NOT NULL';
      }
      
      if (col.column_default) {
        def += ` DEFAULT ${col.column_default}`;
      }
      
      return def;
    });
    
    sql.push(columnDefs.join(',\n'));
    sql.push(');');
    
    return sql.join('\n');
  }

  generateInsertSQL(schemaName, tableName, data) {
    if (!data || data.length === 0) return '';
    
    const columns = Object.keys(data[0]);
    let sql = [`INSERT INTO "${schemaName}"."${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES`];
    
    const values = data.map(row => {
      const vals = columns.map(col => {
        const val = row[col];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
        if (typeof val === 'boolean') return val ? 'true' : 'false';
        if (val instanceof Date) return `'${val.toISOString()}'`;
        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
        return val;
      }).join(', ');
      return `  (${vals})`;
    }).join(',\n');
    
    sql.push(values);
    sql.push('ON CONFLICT DO NOTHING;');
    
    return sql.join('\n') + '\n';
  }

  generateSQLOutput() {
    let sql = [];
    
    // Header
    sql.push('-- ============================================================================');
    sql.push('-- Complete Supabase Export (Schema + Data)');
    sql.push(`-- Exported from: ${this.source}`);
    sql.push(`-- Exported at: ${this.exportData.metadata.exportedAt}`);
    sql.push(`-- Schemas: ${this.schemas.join(', ')}`);
    sql.push('-- ============================================================================\n');
    
    // Set session for faster imports
    sql.push('SET session_replication_role = \'replica\';');
    sql.push('BEGIN;\n');
    
    for (const [schemaName, schemaData] of Object.entries(this.exportData.schemas)) {
      sql.push(`-- ============================================================================`);
      sql.push(`-- SCHEMA: ${schemaName.toUpperCase()}`);
      sql.push(`-- ============================================================================\n`);
      
      // Create schema
      sql.push(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";\n`);
      
      // Export table structures
      if (schemaData.structure && schemaData.structure.tables) {
        sql.push(`-- Tables for ${schemaName} schema`);
        for (const [tableName, tableStructure] of Object.entries(schemaData.structure.tables)) {
          sql.push(this.generateCreateTableSQL(schemaName, tableName, tableStructure));
          sql.push('');
        }
      }
      
      // Export data
      if (schemaData.data) {
        sql.push(`-- Data for ${schemaName} schema`);
        
        if (schemaName === 'auth') {
          // Special handling for auth data
          if (schemaData.data.users && schemaData.data.users.length > 0) {
            sql.push('-- Auth Users (for reference - recreate via Supabase Admin API)');
            schemaData.data.users.forEach(user => {
              sql.push(`-- User: ${user.email} (ID: ${user.id})`);
              sql.push(`-- Created: ${user.created_at}, Role: ${user.role}`);
            });
            sql.push('');
          }
          
          // Direct auth table data
          for (const [tableName, tableData] of Object.entries(schemaData.data)) {
            if (tableName !== 'users' && Array.isArray(tableData)) {
              sql.push(this.generateInsertSQL(schemaName, tableName, tableData));
            }
          }
        } else {
          // Regular schema data
          for (const [tableName, tableData] of Object.entries(schemaData.data)) {
            sql.push(this.generateInsertSQL(schemaName, tableName, tableData));
          }
        }
      }
      
      sql.push('');
    }
    
    sql.push('SET session_replication_role = \'origin\';');
    sql.push('COMMIT;');
    
    return sql.join('\n');
  }

  async saveToFile(content, suffix = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `${this.options.outputPrefix}-${timestamp}${suffix}.sql`;
    const outputPath = path.join(__dirname, '..', 'exports', filename);
    
    // Ensure exports directory exists
    const exportsDir = path.dirname(outputPath);
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, content, 'utf8');
    this.log(`💾 Export saved to: ${outputPath}`);
    
    return outputPath;
  }

  async export() {
    this.log('🚀 Starting complete Supabase export...');
    
    // Connect to database
    const connected = await this.connect();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }
    
    try {
      // Export each schema
      for (const schemaName of this.schemas) {
        await this.exportSchema(schemaName);
      }
      
      // Generate SQL output
      const sqlContent = this.generateSQLOutput();
      
      // Save to file
      const outputPath = await this.saveToFile(sqlContent);
      
      // Summary
      this.log('\n📊 Export Summary:');
      this.log('=================');
      
      for (const [schemaName, schemaData] of Object.entries(this.exportData.schemas)) {
        const tableCount = schemaData.structure?.tables ? Object.keys(schemaData.structure.tables).length : 0;
        const dataTableCount = schemaData.data ? Object.keys(schemaData.data).length : 0;
        
        this.log(`   ${schemaName}: ${tableCount} tables (structure), ${dataTableCount} tables (data)`);
        
        if (schemaData.data) {
          for (const [tableName, tableData] of Object.entries(schemaData.data)) {
            if (Array.isArray(tableData)) {
              this.log(`     └─ ${tableName}: ${tableData.length} records`);
            }
          }
        }
      }
      
      this.log('=================');
      this.log(`💾 Output: ${outputPath}`);
      
      return outputPath;
      
    } finally {
      await this.disconnect();
    }
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  
  let source = 'remote';
  let schemas = ['public', 'auth'];
  let dataOnly = false;
  let schemaOnly = false;
  let outputPrefix = 'supabase-export';
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--source':
        source = args[++i];
        break;
      case '--schema':
        schemas = args[++i].split(',');
        break;
      case '--data-only':
        dataOnly = true;
        break;
      case '--schema-only':
        schemaOnly = true;
        break;
      case '--output':
        outputPrefix = args[++i];
        break;
      case '--help':
        console.log('Usage: node scripts/supabase-export.js [options]');
        console.log('Options:');
        console.log('  --source remote|local    Source database (default: remote)');
        console.log('  --schema auth,public     Schemas to export (default: public,auth)');
        console.log('  --data-only             Export only data, no schema');
        console.log('  --schema-only           Export only schema, no data');
        console.log('  --output filename       Output file prefix (default: supabase-export)');
        return;
    }
  }
  
  try {
    const exporter = new SupabaseExporter(source, schemas, {
      dataOnly,
      schemaOnly,
      outputPrefix
    });
    
    await exporter.export();
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
