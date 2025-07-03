#!/usr/bin/env node
/**
 * Supabase Data Importer
 * 
 * This script imports data from exported files into your local database.
 * 
 * Usage:
 *   node scripts/import-data.js [file]
 *   
 * Arguments:
 *   file    Path to the exported data file (SQL or JSON)
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

// Database configuration for local PostgreSQL
const dbConfig = {
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres.supabase-dev-tenant-2025',
  password: 'P9kL2mN8qX7vB4hR6tE3wY5uI1oA0sD9fG8jH7kL2mN6qX9vB4hR8tE1wY5uI0oA',
  database: 'postgres'
};

class DataImporter {
  constructor() {
    this.client = null;
  }

  log(message) {
    console.log(`[IMPORTER] ${message}`);
  }

  async connect() {
    this.client = new Client(dbConfig);
    await this.client.connect();
    this.log('✅ Connected to local database');
  }

  async disconnect() {
    if (this.client) {
      await this.client.end();
      this.log('🔌 Disconnected from database');
    }
  }

  async importSQL(filePath) {
    this.log(`📥 Importing SQL file: ${filePath}`);
    
    try {
      // Read SQL file
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Begin transaction
      await this.client.query('BEGIN');
      
      // Execute SQL
      await this.client.query(sql);
      
      // Commit transaction
      await this.client.query('COMMIT');
      
      this.log('✅ SQL import completed successfully');
      
    } catch (error) {
      // Rollback on error
      await this.client.query('ROLLBACK');
      this.log(`❌ SQL import failed: ${error.message}`);
      throw error;
    }
  }

  async importJSON(filePath) {
    this.log(`📥 Importing JSON file: ${filePath}`);
    
    try {
      // Read and parse JSON file
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (!jsonData.public) {
        throw new Error('Invalid JSON format: missing public data');
      }
      
      // Begin transaction
      await this.client.query('BEGIN');
      
      let totalImported = 0;
      
      // Import each table
      for (const [tableName, tableData] of Object.entries(jsonData.public)) {
        if (tableData.count > 0 && tableData.data) {
          this.log(`📋 Importing ${tableName} (${tableData.count} records)...`);
          
          // Clear existing data
          await this.client.query(`DELETE FROM public.${tableName}`);
          
          // Insert new data
          for (const record of tableData.data) {
            const columns = Object.keys(record).join(', ');
            const placeholders = Object.keys(record).map((_, i) => `$${i + 1}`).join(', ');
            const values = Object.values(record);
            
            const insertSQL = `INSERT INTO public.${tableName} (${columns}) VALUES (${placeholders})`;
            await this.client.query(insertSQL, values);
          }
          
          totalImported += tableData.count;
          this.log(`✅ Imported ${tableName}: ${tableData.count} records`);
        }
      }
      
      // Commit transaction
      await this.client.query('COMMIT');
      
      this.log(`🎉 JSON import completed: ${totalImported} total records imported`);
      
    } catch (error) {
      // Rollback on error
      await this.client.query('ROLLBACK');
      this.log(`❌ JSON import failed: ${error.message}`);
      throw error;
    }
  }

  async import(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    await this.connect();
    
    try {
      const ext = path.extname(filePath).toLowerCase();
      
      if (ext === '.sql') {
        await this.importSQL(filePath);
      } else if (ext === '.json') {
        await this.importJSON(filePath);
      } else {
        throw new Error(`Unsupported file format: ${ext}`);
      }
      
    } finally {
      await this.disconnect();
    }
  }
}

// Find the latest export file
function findLatestExport() {
  const exportsDir = path.join(__dirname, '..', 'exports');
  
  if (!fs.existsSync(exportsDir)) {
    return null;
  }
  
  const files = fs.readdirSync(exportsDir)
    .filter(file => file.startsWith('data-export-') && (file.endsWith('.sql') || file.endsWith('.json')))
    .map(file => ({
      name: file,
      path: path.join(exportsDir, file),
      stat: fs.statSync(path.join(exportsDir, file))
    }))
    .sort((a, b) => b.stat.mtime - a.stat.mtime);
  
  return files.length > 0 ? files[0].path : null;
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log('Usage: node scripts/import-data.js [file]');
    console.log('');
    console.log('Arguments:');
    console.log('  file    Path to the exported data file (SQL or JSON)');
    console.log('          If not provided, will use the latest export file');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/import-data.js exports/data-export-123456.sql');
    console.log('  node scripts/import-data.js  # Uses latest export');
    return;
  }
  
  let filePath = args[0];
  
  // If no file specified, try to find the latest export
  if (!filePath) {
    filePath = findLatestExport();
    if (!filePath) {
      console.error('❌ No export file specified and no exports found.');
      console.log('💡 Run "npm run export" first to create an export file.');
      process.exit(1);
    }
    console.log(`📂 Using latest export: ${path.basename(filePath)}`);
  }
  
  try {
    const importer = new DataImporter();
    await importer.import(filePath);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
