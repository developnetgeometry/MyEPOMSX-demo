import { supabase } from "@/lib/supabaseClient";

export interface InventoryGroup {
  id: number;
  asset_detail_id: number;
  group_type: string;
  group_name: string;
  total_inventory: number;
  component_inventory: number;
  description?: string;
  equipment_volume?: number;
  representative_component?: string;
  is_status: boolean;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  // Relations
  asset?: {
    id: number;
    asset_no: string;
    asset_name: string;
  };
}

export interface CreateInventoryGroupData {
  asset_detail_id: number;
  group_type: string;
  group_name: string;
  total_inventory: number;
  component_inventory: number;
  description?: string;
  equipment_volume?: number;
  representative_component?: string;
  is_status: boolean;
  created_by: string;
}

export interface UpdateInventoryGroupData {
  asset_detail_id?: number;
  group_type?: string;
  group_name?: string;
  total_inventory?: number;
  component_inventory?: number;
  description?: string;
  equipment_volume?: number;
  representative_component?: string;
  is_status?: boolean;
  updated_by: string;
}

class InventoryGroupsService {
  /**
   * Get all inventory groups with optional filtering
   */
  async getInventoryGroups(params?: {
    searchQuery?: string;
    statusFilter?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: InventoryGroup[]; count: number }> {
    let query = supabase
      .from("i_inventory_group")
      .select(
        `
        *,
        asset:asset_detail_id(
          id,
          asset_no,
          asset_name
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    // Apply search filter
    if (params?.searchQuery) {
      query = query.or(
        `group_name.ilike.%${params.searchQuery}%,group_type.ilike.%${params.searchQuery}%,representative_component.ilike.%${params.searchQuery}%`
      );
    }

    // Apply status filter
    if (params?.statusFilter && params.statusFilter !== "all") {
      const isActive = params.statusFilter === "active";
      query = query.eq("is_status", isActive);
    }

    // Apply pagination
    if (params?.page && params?.pageSize) {
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error fetching inventory groups: ${error.message}`);
    }

    return { data: data || [], count: count || 0 };
  }

  /**
   * Get a single inventory group by ID
   */
  async getInventoryGroupById(id: number): Promise<InventoryGroup> {
    const { data, error } = await supabase
      .from("i_inventory_group")
      .select(
        `
        *,
        asset:asset_detail_id(
          id,
          asset_no,
          asset_name
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching inventory group: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new inventory group
   */
  async createInventoryGroup(
    data: CreateInventoryGroupData
  ): Promise<InventoryGroup> {
    const { data: result, error } = await supabase
      .from("i_inventory_group")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
      })
      .select(
        `
        *,
        asset:asset_detail_id(
          id,
          asset_no,
          asset_name
        )
      `
      )
      .single();

    if (error) {
      throw new Error(`Error creating inventory group: ${error.message}`);
    }

    return result;
  }

  /**
   * Update an existing inventory group
   */
  async updateInventoryGroup(
    id: number,
    data: UpdateInventoryGroupData
  ): Promise<InventoryGroup> {
    const { data: result, error } = await supabase
      .from("i_inventory_group")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        *,
        asset:asset_detail_id(
          id,
          asset_no,
          asset_name
        )
      `
      )
      .single();

    if (error) {
      throw new Error(`Error updating inventory group: ${error.message}`);
    }

    return result;
  }

  /**
   * Delete an inventory group
   */
  async deleteInventoryGroup(id: number): Promise<void> {
    const { error } = await supabase
      .from("i_inventory_group")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Error deleting inventory group: ${error.message}`);
    }
  }

  /**
   * Get inventory groups by asset ID
   */
  async getInventoryGroupsByAssetId(
    assetId: number
  ): Promise<InventoryGroup[]> {
    const { data, error } = await supabase
      .from("i_inventory_group")
      .select(
        `
        *,
        asset:asset_detail_id(
          id,
          asset_no,
          asset_name
        )
      `
      )
      .eq("asset_detail_id", assetId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Error fetching inventory groups by asset: ${error.message}`
      );
    }

    return data || [];
  }

  /**
   * Check if group name exists for the same asset (for validation)
   */
  async checkGroupNameExists(
    groupName: string,
    assetId: number,
    excludeId?: number
  ): Promise<boolean> {
    let query = supabase
      .from("i_inventory_group")
      .select("id")
      .eq("group_name", groupName)
      .eq("asset_detail_id", assetId);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error checking group name: ${error.message}`);
    }

    return (data?.length || 0) > 0;
  }

  /**
   * Get inventory group statistics
   */
  async getInventoryGroupStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    totalInventory: number;
    totalComponents: number;
  }> {
    const { data, error } = await supabase
      .from("i_inventory_group")
      .select("id, is_status, total_inventory, component_inventory");

    if (error) {
      throw new Error(`Error fetching inventory group stats: ${error.message}`);
    }

    const stats = {
      total: data?.length || 0,
      active: data?.filter((item) => item.is_status).length || 0,
      inactive: data?.filter((item) => !item.is_status).length || 0,
      totalInventory:
        data?.reduce((sum, item) => sum + (item.total_inventory || 0), 0) || 0,
      totalComponents:
        data?.reduce((sum, item) => sum + (item.component_inventory || 0), 0) ||
        0,
    };

    return stats;
  }
}

export const inventoryGroupsService = new InventoryGroupsService();
