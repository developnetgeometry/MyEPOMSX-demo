import { supabase } from "@/lib/supabaseClient";
import { ItemMasterWithRelations } from "@/types/manage";

export const itemMasterService = {
  async getItemMaster(): Promise<ItemMasterWithRelations[]> {
    const { data, error } = await supabase
      .from("e_item_master")
      .select(
        `*, 
        item_category: e_item_category(name),
        item_type: e_item_type(name),
        item_unit: e_unit(name),
        group: e_item_group(name),
        item_criticality: e_criticality(name),
        item_manufacturer: e_manufacturer(name)
        `
      )
      .order("item_no");

    if (error) {
      throw new Error(`Error fetching items master: ${error.message}`);
    }

    return data || [];
  },

  async getItemMasterById(id: number): Promise<ItemMasterWithRelations> {
    const { data, error } = await supabase
      .from("e_item_master")
      .select(
        `*, 
        item_category: e_item_category(name),
        item_type: e_item_type(name),
        item_unit: e_unit(name),
        group: e_item_group(name),
        item_criticality: e_criticality(name),
        item_manufacturer: e_manufacturer(name)
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
};
