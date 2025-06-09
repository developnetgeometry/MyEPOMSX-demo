import { supabase } from "@/lib/supabaseClient";
import {
  CreateItemMasterDTO,
  ItemMasterDetaiWithRelations,
  ItemMasterWithRelations,
  UpdateItemMasterDTO,
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

  async getItemMasterById(id: number): Promise<ItemMasterDetaiWithRelations> {
    const { data, error } = await supabase
      .from("e_item_master")
      .select(
        `*, 
        item_category: e_item_category(*),
        item_type: e_item_type(*),
        item_unit: e_unit(*),
        item_group: e_item_group(*),
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

    if (error.code === '23505') {
      throw new Error(`Item master with Item No ${item.item_no} already exists`);
    }

    if (error) {
      throw new Error(`Error creating item master: ${error.message}`);
    }

    return data;
  },

  async updateItemMaster(id: number, item: UpdateItemMasterDTO) {
    const { data, error } = await supabase
      .from("e_item_master")
      .update(item)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating item master: ${error.message}`);
    }

    return data;
  },

  async getCategoryOptions() {
    const { data, error } = await supabase
      .from("e_item_category")
      .select("id, name");
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getManufacturerOptions() {
    const { data, error } = await supabase
      .from("e_manufacturer")
      .select("id, name");
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getItemTypeOptions() {
    const { data, error } = await supabase
      .from("e_item_type")
      .select("id, name");
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getItemGroupOptions() {
    const { data, error } = await supabase
      .from("e_item_group")
      .select("id, name");
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getUnitOptions() {
    const { data, error } = await supabase
      .from("e_unit")
      .select("id, name");
    if (error) throw new Error(error.message);
    return data || [];
  },
  async getCriticalityOptions() {
    const { data, error } = await supabase
      .from("e_criticality")
      .select("id, name");
    if (error) throw new Error(error.message);
    return data || [];
  },
};
