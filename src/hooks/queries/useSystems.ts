import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { systemService } from "@/services/systemService";
import { System } from "@/types/manage";
import { supabase } from "@/lib/supabaseClient";

export const systemKeys = {
  all: ["systems"] as const,
  lists: () => [...systemKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...systemKeys.lists(), filters] as const,
  details: () => [...systemKeys.all, "detail"] as const,
  detail: (id: number) => [...systemKeys.details(), id] as const,
  byCode: (code: string) => [...systemKeys.details(), { code }] as const,
  byFacility: (facilityId: number) =>
    [...systemKeys.lists(), { facilityId }] as const,
};

export const useSystems = (isActive?: boolean) => {
  return useQuery({
    queryKey: systemKeys.list({ isActive }),
    queryFn: () => systemService.getSystems(isActive),
  });
};

export const useSystem = (id: number) => {
  return useQuery({
    queryKey: systemKeys.detail(id),
    queryFn: () => systemService.getSystemById(id),
    enabled: !!id,
  });
};

export const useSystemByCode = (systemCode: string) => {
  return useQuery({
    queryKey: systemKeys.byCode(systemCode),
    queryFn: () => systemService.getSystemByCode(systemCode),
    enabled: !!systemCode,
  });
};

export const useSystemsByFacility = (facilityId: number) => {
  return useQuery({
    queryKey: systemKeys.byFacility(facilityId),
    queryFn: () => systemService.getSystemsByFacilityId(facilityId),
    enabled: !!facilityId,
  });
};

export const useCreateSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSystem: Omit<System, "id">) =>
      systemService.createSystem(newSystem),
    onSuccess: (createdSystem) => {
      queryClient.invalidateQueries({ queryKey: systemKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: systemKeys.byCode(createdSystem.system_code),
      });

      if (createdSystem.facility_id) {
        queryClient.invalidateQueries({
          queryKey: systemKeys.byFacility(createdSystem.facility_id),
        });
      }
    },
  });
};

export const useUpdateSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (system: System) => {
      const { data, error } = await supabase
        .from("e_system")
        .update({
          system_code: system.system_code,
          system_name: system.system_name,
          is_active: system.is_active,
          system_no: system.system_no,
        })
        .eq("id", system.id)
        .select()
        .single();

      if (error) throw error;
      return data as System;
    },
    onSuccess: (updatedSystem) => {
      queryClient.invalidateQueries({
        queryKey: systemKeys.detail(updatedSystem.id),
      });
      queryClient.invalidateQueries({
        queryKey: systemKeys.byCode(updatedSystem.system_code),
      });
      queryClient.invalidateQueries({ queryKey: systemKeys.lists() });

      if (updatedSystem.facility_id) {
        queryClient.invalidateQueries({
          queryKey: systemKeys.byFacility(updatedSystem.facility_id),
        });
      }
    },
  });
};

export const useDeleteSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => systemService.deleteSystem(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: systemKeys.lists() });
      queryClient.invalidateQueries({ queryKey: systemKeys.detail(variables) });
    },
  });
};
