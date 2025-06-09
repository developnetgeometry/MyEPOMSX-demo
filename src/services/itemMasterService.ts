import { supabase } from "@/lib/supabaseClient";
import {
  CreateItemMasterDTO,
  ItemMasterDetaiWithRelations,
  ItemMasterWithRelations,
} from "@/types/material";

export const itemMasterService = {
  async getItemMaster(): Promise<ItemMasterWithRelations[]> {
    const { data, error } = await supabase
      .from("e_item_master")
      .select(
        `*, 
        item_category: e_item_category(*),
        item_type: e_item_type(*),
        item_unit: e_unit(*),
        group: e_item_group(*),
        item_criticality: e_criticality(*),
        item_manufacturer: e_manufacturer(*)
        `
      )
      .order("item_no");

    if (error) {
      throw new Error(`Error fetching items master: ${error.message}`);
    }

    return data || [];
  },

  async getItemMasterOptions() {
    const { data, error } = await supabase
      .from("e_item_master")
      .select("id, item_no, item_name")
      .order("item_no");

    if (error) {
      console.error("Error fetching item master options:", error);
      throw error;
    }

    return data || [];
  },

  async getItemMasterById(id: number): Promise<ItemMasterDetaiWithRelations> {
    const { data, error } = await supabase
      .from("e_item_master")
      .select(
        `*, 
        item_category: e_item_category(*),
        item_type: e_item_type(*),
        item_unit: e_unit(*),
        group: e_item_group(*),
        item_criticality: e_criticality(*),
        item_manufacturer: e_manufacturer(*)
        `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching item master: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Item master with id ${id} not found`);
    }

    return data;
  },

  async createItemMaster(item: CreateItemMasterDTO) {
    const { data, error } = await supabase
      .from("e_item_master")
      .insert(item)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating item master: ${error.message}`);
    }

    return data;
  },
};
