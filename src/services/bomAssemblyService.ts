import { supabase } from "@/lib/supabaseClient";
import { BomAssembly, BomAssemblyInsert, BomAssemblyUpdate, SparePart } from "@/types/material";


export const bomAssemblyService = {
  async getBomAssemblies(): Promise<BomAssembly[]> {
    const { data, error } = await supabase
      .from("e_bom_assembly")
      .select("*")
      .order("bom_code");

    if (error) {
      throw new Error(`Error fetching bom assemblies: ${error.message}`);
    }

    return data || [];
  },

  async getBomAssemblyById(id: number): Promise<any> {
    const { data, error } = await supabase
      .from("e_bom_assembly")
      .select("*,items: e_item_master(*)")
      .eq("id", id);

    if (error) {
      throw new Error(`Error fetching BOM Assembly by ID: ${error.message}`);
    }

    return data[0];
  },

  async createBomAssembly(payload: BomAssemblyInsert): Promise<BomAssembly> {
    const { data, error } = await supabase
      .from("e_bom_assembly")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create BOM Assembly: ${error.message}`);
    }

    return data;
  },

  async updateBomAssembly(
    id: number,
    updates: BomAssemblyUpdate
  ): Promise<BomAssembly> {
    const { data, error } = await supabase
      .from("e_bom_assembly")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update BOM Assembly: ${error.message}`);
    }

    return data;
  },

  async deleteBomAssembly(id: number): Promise<void> {
    const { error } = await supabase
      .from("e_bom_assembly")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete BOM Assembly: ${error.message}`);
    }
  },

  async getSparePartsByBomId(bomId: number): Promise<SparePart[]> {
    const { data, error } = await supabase
      .from("e_spare_parts")
      .select(
        `
                id,
                bom_id,
                item_master_id,
                description,
                item_master: item_master_id(
                    id,
                    item_no,
                    item_name,
                    manufacturer_part_no,
                    specification
                )
            `
      )
      .eq("bom_id", bomId)
      .order("id", { ascending: true });

    if (error) {
      throw new Error(`Error fetching spare parts: ${error.message}`);
    }

    return data || [];
  },
  async addSparePartToBom(
    sparePart: Omit<SparePart, "id">
  ): Promise<SparePart> {
    const { data, error } = await supabase
      .from("e_spare_parts")
      .insert(sparePart)
      .select()
      .single();

    if (error) throw new Error(`Error adding spare part: ${error.message}`);
    return data as SparePart;
  },

  async createSparePart(payload: {
    bom_id: number;
    item_master_id: number;
    description?: string;
  }): Promise<SparePart> {
    const { data, error } = await supabase
      .from('e_spare_parts')
      .insert({
        ...payload,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        item_master: item_master_id(*)
      `)
      .single();
  
    if (error) throw new Error(`Error creating spare part: ${error.message}`);
    return data;
  },

  async updateSparePart(
    id: number,
    updates: Partial<SparePart>
  ): Promise<SparePart> {
    const { data, error } = await supabase
      .from("e_spare_parts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Error updating spare part: ${error.message}`);
    return data as SparePart;
  },

  async deleteSparePart(id: number): Promise<void> {
    const { error } = await supabase
      .from("e_spare_parts")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Error deleting spare part: ${error.message}`);
  },

  async getItemMasterOptions(): Promise<{ value: number; label: string }[]> {
    const { data, error } = await supabase
      .from("e_item_master")
      .select("id, item_no, item_name")
      .order("item_no");

    if (error) {
      throw new Error(`Error fetching item master options: ${error.message}`);
    }

    return (
      data.map((item) => ({
        value: item.id,
        label: `${item.item_no} - ${item.item_name}`,
      })) || []
    );
  },
};
