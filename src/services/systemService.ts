import { supabase } from '@/lib/supabaseClient';
import { System } from '@/types/manage';

export const systemService = {
  async getSystems(isActive?: boolean): Promise<System[]> {
    let query = supabase
      .from('e_system')
      .select('*, facility:facility_id(location_name)')
      .order('system_code');
    
    // Filter by active status if specified
    if (isActive !== undefined) {
      query = query.eq('is_active', isActive);
    }

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error fetching systems: ${error.message}`);
    }
    
    return data || [];
  },

  async getSystemById(id: number): Promise<System> {
    const { data, error } = await supabase
      .from('e_system')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(`Error fetching system: ${error.message}`);
    }
    
    if (!data) {
      throw new Error(`System with id ${id} not found`);
    }
    
    return data;
  },

  async getSystemByCode(systemCode: string): Promise<System> {
    const { data, error } = await supabase
      .from('e_system')
      .select('*')
      .eq('system_code', systemCode)
      .single();
    
    if (error) {
      throw new Error(`Error fetching system: ${error.message}`);
    }
    
    if (!data) {
      throw new Error(`System with code ${systemCode} not found`);
    }
    
    return data;
  },

  async getSystemsByFacilityId(facilityId: number): Promise<System[]> {
    const { data, error } = await supabase
      .from('e_system')
      .select('*')
      .eq('facility_id', facilityId)
      .order('system_code');
    
    if (error) {
      throw new Error(`Error fetching systems: ${error.message}`);
    }
    
    return data || [];
  },

  async createSystem(system: Omit<System, 'id'>): Promise<System> {
    const { data, error } = await supabase
      .from('e_system')
      .insert(system)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error creating system: ${error.message}`);
    }
    
    return data;
  },

  async updateSystem(id: number, system: Partial<Omit<System, 'id'>>): Promise<System> {
    const { data, error } = await supabase
      .from('e_system')
      .update(system)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error updating system: ${error.message}`);
    }
    
    return data;
  },

  async deleteSystem(id: number): Promise<void> {
    const { error } = await supabase
      .from('e_system')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Error deleting system: ${error.message}`);
    }
  }
};