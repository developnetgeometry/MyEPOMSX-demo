import { supabase } from "@/lib/supabaseClient";
import { Facility } from "@/types/manage";


export const facilityService = {
    async getFacilities(isActive?: boolean): Promise<Facility[]> {
        let query = supabase
          .from('e_facility')
          .select('*')
          .order('location_code');
        
        if (isActive !== undefined) {
          query = query.eq('is_active', isActive);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw new Error(`Error fetching facilities: ${error.message}`);
        }
        
        return data || [];
      },
      
      async getFacilityById(id: number): Promise<Facility> {
        const { data, error } = await supabase
          .from('e_facility')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw new Error(`Error fetching facility: ${error.message}`);
        }
        
        if (!data) {
          throw new Error(`Facility with id ${id} not found`);
        }
        
        return data;
      },
    
      async getFacilityByCode(locationCode: string): Promise<Facility> {
        const { data, error } = await supabase
          .from('e_facility')
          .select('*')
          .eq('location_code', locationCode)
          .single();
        
        if (error) {
          throw new Error(`Error fetching facility: ${error.message}`);
        }
        
        if (!data) {
          throw new Error(`Facility with code ${locationCode} not found`);
        }
        
        return data;
      },
    
      async getFacilitiesByProjectId(projectId: number): Promise<Facility[]> {
        const { data, error } = await supabase
          .from('e_facility')
          .select('*')
          .eq('project_id', projectId)
          .order('location_code');
        
        if (error) {
          throw new Error(`Error fetching facilities: ${error.message}`);
        }
        
        return data || [];
      },
}