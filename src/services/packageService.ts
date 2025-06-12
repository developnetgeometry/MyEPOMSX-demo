import { supabase } from "@/lib/supabaseClient";
import { Package } from "@/types/manage";

export const packageService = {
  async getPackages(isActive?: boolean): Promise<Package[]> {
    let query = supabase
      .from("e_package")
      .select(
        `
            *,
            package_type:package_type_id (id, name)
          `
      )
      .order("package_no");

    // Filter by active status if specified
    if (isActive !== undefined) {
      query = query.eq("is_active", isActive);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Error fetching packages: ${error.message}`);
    }
    return data || [];
  },

  async getPackageById(id: number): Promise<Package> {
    const { data, error } = await supabase
      .from("e_package")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching package: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Package with id ${id} not found`);
    }

    return data;
  },

  async getPackageByNo(packageNo: string): Promise<Package> {
    const { data, error } = await supabase
      .from("e_package")
      .select("*")
      .eq("package_no", packageNo)
      .single();

    if (error) {
      throw new Error(`Error fetching package: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Package with number ${packageNo} not found`);
    }

    return data;
  },

  async getPackagesBySystemId(systemId: number): Promise<Package[]> {
    const { data, error } = await supabase
      .from("e_package")
      .select("*")
      .eq("system_id", systemId)
      .order("package_no");

    if (error) {
      throw new Error(`Error fetching packages: ${error.message}`);
    }

    return data || [];
  },

  async getPackagesByType(packageTypeId: number): Promise<Package[]> {
    const { data, error } = await supabase
      .from("e_package")
      .select("*")
      .eq("package_type_id", packageTypeId)
      .order("package_no");

    if (error) {
      throw new Error(`Error fetching packages: ${error.message}`);
    }

    return data || [];
  },

  async createPackage(packageData: Omit<Package, "id">): Promise<Package> {
    const { data, error } = await supabase
      .from("e_package")
      .insert(packageData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating package: ${error.message}`);
    }

    return data;
  },

  async updatePackage(
    id: number,
    packageData: Partial<Omit<Package, "id">>
  ): Promise<Package> {
    const { data, error } = await supabase
      .from("e_package")
      .update(packageData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating package: ${error.message}`);
    }

    return data;
  },

  async deletePackage(id: number): Promise<void> {
    const { error } = await supabase.from("e_package").delete().eq("id", id);

    if (error) {
      throw new Error(`Error deleting package: ${error.message}`);
    }
  },

  async getPackageTypeNameByPackageId(packageId: number): Promise<string> {
    try {
      // Here we need a join because we're starting with a package ID and need to find its type
      const { data, error } = await supabase
        .from("e_package")
        .select(
          `
              e_package_type!package_type_id (name)
            `
        )
        .eq("id", packageId)
        .single();

      if (error) {
        console.error(`Error fetching package type: ${error.message}`);
        return "Unknown";
      }

      return data?.e_package_type?.name || "Unknown";
    } catch (error) {
      console.error("Error in getPackageTypeNameByPackageId:", error);
      return "Unknown";
    }
  },
  async getPackageTypeName(id: number | null): Promise<string> {
    if (!id) return "Unknown";

    try {
      // Using a direct query as it's most efficient when we already have the package_type_id
      const { data, error } = await supabase
        .from("e_package_type")
        .select("name")
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching package type name: ${error.message}`);
        return "Unknown";
      }

      return data?.name || "Unknown";
    } catch (error) {
      console.error("Error in getPackageTypeName:", error);
      return "Unknown";
    }
  },
};
