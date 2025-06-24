import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface SeederOptions {
  force?: boolean; // Force recreate data even if exists
  verbose?: boolean; // Show detailed logs
}

class DatabaseSeeder {
  private options: SeederOptions;

  constructor(options: SeederOptions = {}) {
    this.options = { force: false, verbose: true, ...options };
  }

  private log(message: string): void {
    if (this.options.verbose) {
      console.log(`[SEEDER] ${message}`);
    }
  }

  private logError(message: string, error?: any): void {
    console.error(`[SEEDER ERROR] ${message}`, error);
  }

  private async checkExists(table: string, condition: any): Promise<boolean> {
    const { data, error } = await supabase
      .from(table)
      .select("id")
      .match(condition)
      .limit(1);

    if (error) {
      this.logError(`Error checking existence in ${table}:`, error);
      return false;
    }

    return data && data.length > 0;
  }

  private async insertIfNotExists(
    table: string,
    data: any[],
    uniqueField: string = "id"
  ): Promise<void> {
    for (const item of data) {
      if (!this.options.force) {
        const exists = await this.checkExists(table, {
          [uniqueField]: item[uniqueField],
        });
        if (exists) {
          this.log(`Skipping ${table} - ${item[uniqueField]} (already exists)`);
          continue;
        }
      }

      const { error } = await supabase
        .from(table)
        .upsert(item, { onConflict: uniqueField });

      if (error) {
        this.logError(`Error inserting into ${table}:`, error);
      } else {
        this.log(
          `Inserted into ${table}: ${
            item[uniqueField] || item.name || "record"
          }`
        );
      }
    }
  }

  async seedUserTypes(): Promise<void> {
    this.log("Seeding user types...");

    const userTypes = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Admin",
        description: "System Administrator",
        is_active: true,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Engineer",
        description: "Maintenance Engineer",
        is_active: true,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        name: "Technician",
        description: "Field Technician",
        is_active: true,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        name: "Supervisor",
        description: "Maintenance Supervisor",
        is_active: true,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        name: "Planner",
        description: "Maintenance Planner",
        is_active: true,
      },
    ];

    await this.insertIfNotExists("user_type", userTypes);
  }

  async seedClients(): Promise<void> {
    this.log("Seeding clients...");

    const clients = [
      { id: 1, name: "PETRONAS" },
      { id: 2, name: "ExxonMobil" },
      { id: 3, name: "Shell" },
      { id: 4, name: "TotalEnergies" },
      { id: 5, name: "Chevron" },
    ];

    await this.insertIfNotExists("e_client", clients);
  }

  async seedProjectTypes(): Promise<void> {
    this.log("Seeding project types...");

    const projectTypes = [
      { name: "Oil & Gas Production" },
      { name: "Refinery Operations" },
      { name: "Petrochemical Plant" },
      { name: "LNG Terminal" },
      { name: "Offshore Platform" },
    ];

    await this.insertIfNotExists("e_project_type", projectTypes, "name");
  }

  async seedProjects(): Promise<void> {
    this.log("Seeding projects...");

    const projects = [
      {
        id: 1,
        project_name: "Kimanis Gas Terminal",
        project_code: "KGT-2024",
        client_id: 1,
        project_type: 1,
        start_date: "2024-01-01",
        end_date: "2026-12-31",
        is_active: true,
      },
      {
        id: 2,
        project_name: "Melaka Refinery Upgrade",
        project_code: "MRU-2024",
        client_id: 1,
        project_type: 2,
        start_date: "2024-03-01",
        end_date: "2025-12-31",
        is_active: true,
      },
      {
        id: 3,
        project_name: "Pengerang Integrated Complex",
        project_code: "PIC-2024",
        client_id: 1,
        project_type: 3,
        start_date: "2024-02-01",
        end_date: "2027-06-30",
        is_active: true,
      },
    ];

    await this.insertIfNotExists("e_project", projects);
  }

  async seedFacilities(): Promise<void> {
    this.log("Seeding facilities...");

    const facilities = [
      {
        id: 1,
        location_code: "KGT-MAIN",
        location_name: "Kimanis Gas Terminal - Main Area",
        address: "Kimanis, Sabah, Malaysia",
        is_active: true,
        project_id: 1,
      },
      {
        id: 2,
        location_code: "KGT-UTIL",
        location_name: "Kimanis Gas Terminal - Utilities",
        address: "Kimanis, Sabah, Malaysia",
        is_active: true,
        project_id: 1,
      },
      {
        id: 3,
        location_code: "MRU-PROC",
        location_name: "Melaka Refinery - Process Unit",
        address: "Melaka, Malaysia",
        is_active: true,
        project_id: 2,
      },
      {
        id: 4,
        location_code: "PIC-AROM",
        location_name: "Pengerang - Aromatics Complex",
        address: "Pengerang, Johor, Malaysia",
        is_active: true,
        project_id: 3,
      },
      {
        id: 5,
        location_code: "PIC-OLEF",
        location_name: "Pengerang - Olefins Complex",
        address: "Pengerang, Johor, Malaysia",
        is_active: true,
        project_id: 3,
      },
    ];

    await this.insertIfNotExists("e_facility", facilities);
  }

  async seedSystems(): Promise<void> {
    this.log("Seeding systems...");

    const systems = [
      {
        id: 1,
        facility_id: 1,
        system_code: "SYS-01",
        system_no: "01",
        system_name: "Gas Reception System",
        is_active: true,
      },
      {
        id: 2,
        facility_id: 1,
        system_code: "SYS-02",
        system_no: "02",
        system_name: "Gas Processing System",
        is_active: true,
      },
      {
        id: 3,
        facility_id: 1,
        system_code: "SYS-03",
        system_no: "03",
        system_name: "Compression System",
        is_active: true,
      },
      {
        id: 4,
        facility_id: 2,
        system_code: "SYS-04",
        system_no: "04",
        system_name: "Power Generation System",
        is_active: true,
      },
      {
        id: 5,
        facility_id: 2,
        system_code: "SYS-05",
        system_no: "05",
        system_name: "Water Treatment System",
        is_active: true,
      },
      {
        id: 6,
        facility_id: 3,
        system_code: "SYS-06",
        system_no: "06",
        system_name: "Crude Distillation Unit",
        is_active: true,
      },
      {
        id: 7,
        facility_id: 4,
        system_code: "SYS-07",
        system_no: "07",
        system_name: "Benzene Production Unit",
        is_active: true,
      },
      {
        id: 8,
        facility_id: 5,
        system_code: "SYS-08",
        system_no: "08",
        system_name: "Ethylene Cracker Unit",
        is_active: true,
      },
    ];

    await this.insertIfNotExists("e_system", systems);
  }

  async seedAssetMasterData(): Promise<void> {
    this.log("Seeding asset master data...");

    // Asset Areas
    const assetAreas = [
      { name: "Process Area" },
      { name: "Utilities Area" },
      { name: "Storage Area" },
      { name: "Control Room" },
      { name: "Maintenance Workshop" },
      { name: "Administration Area" },
      { name: "Safety Area" },
      { name: "Loading/Unloading Area" },
    ];
    await this.insertIfNotExists("e_asset_area", assetAreas, "name");

    // Asset Status
    const assetStatus = [
      { name: "Operational", is_active: true },
      { name: "Under Maintenance", is_active: true },
      { name: "Out of Service", is_active: true },
      { name: "Decommissioned", is_active: true },
      { name: "Standby", is_active: true },
      { name: "Testing", is_active: true },
    ];
    await this.insertIfNotExists("e_asset_status", assetStatus, "name");

    // Asset Tags
    const assetTags = [
      { name: "Critical Equipment", is_active: true },
      { name: "Safety Critical", is_active: true },
      { name: "High Priority", is_active: true },
      { name: "Standard", is_active: true },
      { name: "Low Priority", is_active: true },
      { name: "Spare Equipment", is_active: true },
    ];
    await this.insertIfNotExists("e_asset_tag", assetTags, "name");

    // Manufacturers
    const manufacturers = [
      { name: "Flowserve" },
      { name: "KSB" },
      { name: "Grundfos" },
      { name: "Sulzer" },
      { name: "Weir" },
      { name: "Atlas Copco" },
      { name: "Ingersoll Rand" },
      { name: "Siemens" },
      { name: "ABB" },
      { name: "Schneider Electric" },
      { name: "Emerson" },
      { name: "Honeywell" },
      { name: "Yokogawa" },
      { name: "Endress+Hauser" },
      { name: "Rosemount" },
    ];
    await this.insertIfNotExists("e_manufacturer", manufacturers, "name");
  }

  async seedSampleAssets(): Promise<void> {
    this.log("Seeding sample assets...");

    const assets = [
      {
        id: 1,
        facility_id: 1,
        system_id: 1,
        package_id: 1,
        asset_no: "P-101A",
        asset_name: "Main Gas Booster Pump A",
        asset_tag_id: 2,
        status_id: 1,
        commission_date: "2024-06-01",
        is_active: true,
      },
      {
        id: 2,
        facility_id: 1,
        system_id: 1,
        package_id: 1,
        asset_no: "P-101B",
        asset_name: "Main Gas Booster Pump B",
        asset_tag_id: 2,
        status_id: 5,
        commission_date: "2024-06-01",
        is_active: true,
      },
      {
        id: 3,
        facility_id: 1,
        system_id: 2,
        package_id: 3,
        asset_no: "C-201A",
        asset_name: "Gas Dehydration Compressor A",
        asset_tag_id: 2,
        status_id: 1,
        commission_date: "2024-07-15",
        is_active: true,
      },
    ];

    await this.insertIfNotExists("e_asset", assets);
  }

  async seedMaintenanceData(): Promise<void> {
    this.log("Seeding maintenance master data...");

    // Disciplines
    const disciplines = [
      { name: "Mechanical", is_active: true },
      { name: "Electrical", is_active: true },
      { name: "Instrumentation", is_active: true },
      { name: "Process", is_active: true },
      { name: "Civil", is_active: true },
      { name: "Safety", is_active: true },
      { name: "Operations", is_active: true },
    ];
    await this.insertIfNotExists("e_discipline", disciplines, "name");

    // Priorities
    const priorities = [
      {
        priority_no: 1,
        name: "Emergency",
        color_code: "#FF0000",
        is_active: true,
      },
      {
        priority_no: 2,
        name: "Urgent",
        color_code: "#FF8800",
        is_active: true,
      },
      { priority_no: 3, name: "High", color_code: "#FFAA00", is_active: true },
      {
        priority_no: 4,
        name: "Medium",
        color_code: "#00AA00",
        is_active: true,
      },
      { priority_no: 5, name: "Low", color_code: "#0088FF", is_active: true },
    ];
    await this.insertIfNotExists("e_priority", priorities, "priority_no");
  }

  async seedAll(): Promise<void> {
    try {
      this.log("Starting database seeding process...");

      await this.seedUserTypes();
      await this.seedClients();
      await this.seedProjectTypes();
      await this.seedProjects();
      await this.seedFacilities();
      await this.seedSystems();
      await this.seedAssetMasterData();
      await this.seedSampleAssets();
      await this.seedMaintenanceData();

      this.log("Database seeding completed successfully!");

      // Show summary
      await this.showSummary();
    } catch (error) {
      this.logError("Seeding process failed:", error);
      throw error;
    }
  }

  async showSummary(): Promise<void> {
    this.log("=== Database Seeding Summary ===");

    const tables = [
      "user_type",
      "e_client",
      "e_project",
      "e_facility",
      "e_system",
      "e_asset",
      "e_asset_area",
      "e_asset_status",
      "e_manufacturer",
    ];

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });

        if (error) {
          this.logError(`Error counting ${table}:`, error);
        } else {
          this.log(`${table}: ${count} records`);
        }
      } catch (error) {
        this.logError(`Error accessing ${table}:`, error);
      }
    }

    this.log("===============================");
  }

  async cleanAll(): Promise<void> {
    this.log("WARNING: This will delete ALL seeded data!");

    // Add confirmation logic here if needed
    const tables = [
      "e_asset",
      "e_system",
      "e_facility",
      "e_project",
      "e_client",
      "user_type",
    ];

    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all except impossible ID

      if (error) {
        this.logError(`Error cleaning ${table}:`, error);
      } else {
        this.log(`Cleaned ${table}`);
      }
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "seed";

  const options: SeederOptions = {
    force: args.includes("--force"),
    verbose: !args.includes("--quiet"),
  };

  const seeder = new DatabaseSeeder(options);

  try {
    switch (command) {
      case "seed":
        await seeder.seedAll();
        break;
      case "clean":
        await seeder.cleanAll();
        break;
      case "summary":
        await seeder.showSummary();
        break;
      default:
        console.log(`
Usage: npm run seed [command] [options]

Commands:
  seed      Seed the database with initial data (default)
  clean     Clean all seeded data
  summary   Show summary of current data

Options:
  --force   Force recreate data even if exists
  --quiet   Suppress verbose logging

Examples:
  npm run seed
  npm run seed -- seed --force
  npm run seed -- clean
  npm run seed -- summary
        `);
        break;
    }
  } catch (error) {
    console.error("Seeder failed:", error);
    process.exit(1);
  }
}

// Export for programmatic use
export { DatabaseSeeder };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
