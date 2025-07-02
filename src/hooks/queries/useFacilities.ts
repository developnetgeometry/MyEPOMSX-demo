import { supabase } from '@/lib/supabaseClient';
import { facilityService } from '@/services/facilityService';
import { Facility } from '@/types/manage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const facilityKeys = {
  all: ['facilities'] as const,
  lists: () => [...facilityKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...facilityKeys.lists(), filters] as const,
  details: () => [...facilityKeys.all, 'detail'] as const,
  detail: (id: number) => [...facilityKeys.details(), id] as const,
  byCode: (code: string) => [...facilityKeys.details(), { code }] as const,
  byProject: (projectId: number) => [...facilityKeys.lists(), { projectId }] as const,
};

export const useFacilities = (isActive?: boolean) => {
  return useQuery({
    queryKey: facilityKeys.list({ isActive }),
    queryFn: () => facilityService.getFacilities(isActive),
  });
};

export const useFacility = (id: number) => {
  return useQuery({
    queryKey: facilityKeys.detail(id),
    queryFn: () => facilityService.getFacilityById(id),
    enabled: !!id, 
  });
};

export const useFacilityByCode = (locationCode: string) => {
  return useQuery({
    queryKey: facilityKeys.byCode(locationCode),
    queryFn: () => facilityService.getFacilityByCode(locationCode),
    enabled: !!locationCode,
  });
};

export const useFacilitiesByProject = (projectId: number) => {
  return useQuery({
    queryKey: facilityKeys.byProject(projectId),
    queryFn: () => facilityService.getFacilitiesByProjectId(projectId),
    enabled: !!projectId,
  });
};

export const useAddFacility = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newFacility: Omit<Facility, 'id'>) => {
      const { data, error } = await supabase
        .from('e_facility')
        .insert(newFacility)
        .select()
        .single();

      // FIX: Check if error exists before accessing its properties
      if (error) {
        if (error.code === '23505') {
          throw new Error('Facility with this code already exists');
        }
        throw error;
      }
      
      return data as Facility;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() });
      
      if (variables.project_id) {
        queryClient.invalidateQueries({ 
          queryKey: facilityKeys.byProject(variables.project_id) 
        });
      }
    },
  });
};

export const useUpdateFacility = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (facility: Facility) => {
      const { data, error } = await supabase
        .from('e_facility')
        .update({
          location_code: facility.location_code,
          location_name: facility.location_name,
          is_active: facility.is_active,
          project_id: facility.project_id
        })
        .eq('id', facility.id)
        .select()
        .single();
        
      // FIX: Check if error exists before accessing its properties
      if (error) {
        if (error.code === '23505') {
          throw new Error('Facility with this code already exists');
        }
        throw error;
      }
      
      return data as Facility;
    },
    onSuccess: (updatedFacility) => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.detail(updatedFacility.id) });
      queryClient.invalidateQueries({ queryKey: facilityKeys.byCode(updatedFacility.location_code) });
      
      if (updatedFacility.project_id) {
        queryClient.invalidateQueries({ 
          queryKey: facilityKeys.byProject(updatedFacility.project_id) 
        });
      }
      
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() });
    },
  });
};