import { supabase } from "@/lib/supabaseClient";

export const inventoryService = {
  // Update in services/inventoryService.ts

  async getInventoryList(params?: {
    storeId?: string;
    page?: number;
    pageSize?: number;
    searchQuery?: string;
  }) {
    let query = supabase
      .from("e_inventory")
      .select(
        "*, item_master:item_master_id(*, manu:manufacturer(*), type:type_id(*), category:category_id(*), unit:unit_id(*)), rack:rack_id(*)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    // Apply store filter
    if (params?.storeId) {
      query = query.eq("store_id", Number(params.storeId));
    }

    // Apply search filter
    if (params?.searchQuery) {
      query = query.or(
        `itemName.ilike.%${params.searchQuery}%,description.ilike.%${params.searchQuery}%`
      );
    }

    // Apply pagination
    if (params?.page && params?.pageSize) {
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;

    if (error) {
      throw new Error(`Error fetching inventories: ${error.message}`);
    }

    return {
      items: data || [],
      totalCount: count || 0,
    };
  },

  async createInventory(payload: any) {
    const { data, error } = await supabase
      .from("e_inventory")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating inventory: ${error.message}`);
    }

    return data;
  },

  async getSparePartsOptions() {
    const { data, error } = await supabase
      .from("e_spare_parts")
      .select("*, item_master: item_master_id(*)")
      .order("item_master_id");

    if (error) {
      console.error("Error fetching spare parts:", error);
      throw error;
    }

    return data || [];
  },

  async getStoreOptions() {
    const { data, error } = await supabase
      .from("e_store")
      .select("id, name")
      .order("id");

    if (error) {
      console.error("Error fetching stores:", error);
      throw error;
    }

    return data || [];
  },

  async getRackNoOptions() {
    const { data, error } = await supabase
      .from("e_rack")
      .select("id, name")
      .order("id");

    if (error) {
      console.error("Error fetching rack:", error);
      throw error;
    }

    return data || [];
  },
};
