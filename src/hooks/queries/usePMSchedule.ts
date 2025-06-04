import { PMScheduleService } from "@/services/PMScheduleService";
import { PMSchedule } from "@/types/maintain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const scheduleKeys = {
  all: ["schedule"] as const,
  list: () => [...scheduleKeys.all, "list"] as const,
  detail: (id: number) => [...scheduleKeys.all, "detail", id] as const,
  customTasks: (id: number) =>
    [...scheduleKeys.detail(id), "custom-tasks"] as const,
  minCriteria: (id: number) =>
    [...scheduleKeys.detail(id), "min-criteria"] as const,
  checksheets: (id: number) =>
    [...scheduleKeys.detail(id), "checksheets"] as const,
  workOrders: (id: number) =>
    [...scheduleKeys.detail(id), "work-orders"] as const,
  maintainableGroups: (id: number) => 
    [...scheduleKeys.detail(id), "maintainable-groups"] as const,
  planLabour: (id: number) => 
    [...scheduleKeys.detail(id), "plan-labour"] as const,
  planMaterial: (id: number) => 
    [...scheduleKeys.detail(id), "plan-material"] as const,
};

export const usePMSchedules = () => {
  return useQuery({
    queryKey: scheduleKeys.list(),
    queryFn: () => PMScheduleService.getPMSchedules(),
  });
};

export const usePMSchedule = (id: number) => {
  return useQuery({
    queryKey: scheduleKeys.detail(id),
    queryFn: () => PMScheduleService.getPMScheduleById(id),
  });
};

export const useCreatePMSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PMScheduleService.createPMSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  });
};

export const useUpdatePMSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PMScheduleService.updatePMSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  });
};

export const useDeletePMSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PMScheduleService.deletePMSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  });
};

export const useGenerateSamplePMSchedules = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      start_date: string;
      end_date: string;
      asset_id?: number;
    }) => PMScheduleService.generateSamplePMSchedules(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  });
};

export const useFacilityOptions = () => {
  return useQuery({
    queryKey: ["facilityOptions"],
    queryFn: () => PMScheduleService.getFacilityOptions(),
  });
};

export const useMaintenanceOptions = () => {
  return useQuery({
    queryKey: ["maintenanceOptions"],
    queryFn: () => PMScheduleService.getMaintenanceOptions(),
  });
};

export const usePriorityOptions = () => {
  return useQuery({
    queryKey: ["priorityOptions"],
    queryFn: () => PMScheduleService.getPriorityOptions(),
  });
};

export const useWorkCenterOptions = () => {
  return useQuery({
    queryKey: ["workCenterOptions"],
    queryFn: () => PMScheduleService.getWorkCenterOptions(),
  });
};

export const useFrequencyOptions = () => {
  return useQuery({
    queryKey: ["frequencyOptions"],
    queryFn: () => PMScheduleService.getFrequencyOptions(),
  });
};

export const useSystemOptions = () => {
  return useQuery({
    queryKey: ["systemOptions"],
    queryFn: () => PMScheduleService.getSystemOptions(),
  });
};

export const useAssetOptions = () => {
  return useQuery({
    queryKey: ["assetOptions"],
    queryFn: () => PMScheduleService.getAssetOptions(),
  });
};

export const useEmployeeOptions = () => {
  return useQuery({
    queryKey: ["employeeOptions"],
    queryFn: () => PMScheduleService.getEmployeeOptions(),
  });
};

export const usePackageOptions = () => {
  return useQuery({
    queryKey: ["packageOptions"],
    queryFn: () => PMScheduleService.getPackageOptions(),
  });
};

export const useTaskOptions = () => {
  return useQuery({
    queryKey: ["taskOptions"],
    queryFn: () => PMScheduleService.getTaskOptions(),
  });
};

export const useDisciplineOptions = () => {
  return useQuery({
    queryKey: ["disciplineOptions"],
    queryFn: () => PMScheduleService.getDisciplineOptions(),
  });
};

export const usePMGroupOptions = () => {
  return useQuery({
    queryKey: ["pMGroupOptions"],
    queryFn: () => PMScheduleService.getPMGroupOptions(),
  });
};

export const usePMScheduleCustomTasks = (pmScheduleId: number | undefined) => {
  return useQuery({
    queryKey: scheduleKeys.customTasks(pmScheduleId),
    queryFn: () => {
      if (!pmScheduleId) throw new Error("PM Schedule ID is required");
      return PMScheduleService.getPMScheduleCustomTasks(pmScheduleId);
    },
    enabled: !!pmScheduleId,
  });
};

export const useCreatePMScheduleCustomTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PMScheduleService.createPMScheduleCustomTask,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.customTasks(variables.pm_schedule_id),
      });
    },
  });
};

export const useUpdatePMScheduleCustomTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PMScheduleService.updatePMScheduleCustomTask,
    onSuccess: (data, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        scheduleKeys.customTasks(data.pm_schedule_id),
        (old: any[]) =>
          old?.map((task) =>
            task.id === variables.id ? { ...task, ...variables } : task
          )
      );
    },
  });
};

export const useDeletePMScheduleCustomTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PMScheduleService.deletePMScheduleCustomTask,
    onSuccess: (_, variables) => {
      // We don't have the schedule ID here, so we need to invalidate all
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
};

export const usePMScheduleMinCriteria = (pmScheduleId: number | undefined) => {
  return useQuery({
    queryKey: scheduleKeys.minCriteria(pmScheduleId),
    queryFn: () => {
      if (!pmScheduleId) throw new Error("PM Schedule ID is required");
      return PMScheduleService.getMinCriteriaFromPMScheduleId(pmScheduleId);
    },
    enabled: !!pmScheduleId,
  });
};

export const useWorkOrderId = (pmScheduleId: number) => {
  return useQuery({
    queryKey: scheduleKeys.workOrders(pmScheduleId),
    queryFn: () => {
      if (!pmScheduleId) throw new Error("PM Schedule ID is required");
      return PMScheduleService.getWorkOrderFromPMScheduleId(pmScheduleId);
    },
    enabled: !!pmScheduleId,
  });
};

export const usePMScheduleChecksheets = (pmScheduleId: number | undefined) => {
  return useQuery({
    queryKey: scheduleKeys.checksheets(pmScheduleId),
    queryFn: () => {
      if (!pmScheduleId) throw new Error("PM Schedule ID is required");
      return PMScheduleService.getChecksheetFromPMScheduleId(pmScheduleId);
    },
    enabled: !!pmScheduleId,
  });
};

export const useCreatePMScheduleChecksheet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      pm_wo_id: number;
      description: string;
      file?: File;
    }) => {
      let filePath = undefined;
      if (payload.file) {
        filePath = await PMScheduleService.uploadChecksheetFile(payload.file);
      }
      return PMScheduleService.createChecksheet({
        pm_wo_id: payload.pm_wo_id,
        description: payload.description,
        file_path: filePath,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.checksheets(data.pm_wo_id),
      });
    },
  });
};

export const useUpdatePMScheduleChecksheet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; description: string }) =>
      PMScheduleService.updateChecksheet(payload),
    onSuccess: (data, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        scheduleKeys.checksheets(data.pm_schedule_id),
        (old: any[]) =>
          old?.map((checksheet) =>
            checksheet.id === variables.id
              ? { ...checksheet, ...variables }
              : checksheet
          )
      );
    },
  });
};

export const useDeletePMScheduleChecksheet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PMScheduleService.deleteChecksheet(id),
    onSuccess: (_, variables) => {
      // We don't have the schedule ID here, so we need to invalidate all
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
};

export const usePMScheduleMaintainableGroups = (pmScheduleId: number | undefined) => {
  return useQuery({
    queryKey: scheduleKeys.maintainableGroups(pmScheduleId),
    queryFn: () => {
      if (!pmScheduleId) throw new Error("PM Schedule ID is required");
      return PMScheduleService.getMaintainableGroupByScheduleId(pmScheduleId);
    },
    enabled: !!pmScheduleId,
  });
};

export const usePlanLabour = (pmScheduleId: number | undefined) => {
  return useQuery({
    queryKey: scheduleKeys.planLabour(pmScheduleId),
    queryFn: () => {
      if (!pmScheduleId) throw new Error("PM Schedule ID is required");
      return PMScheduleService.getPlanLabourByScheduleId(pmScheduleId);
    },
    enabled: !!pmScheduleId,
  });
};

export const usePlanMaterial = (pmScheduleId: number | undefined) => {
  return useQuery({
    queryKey: scheduleKeys.planMaterial(pmScheduleId),
    queryFn: () => {
      if (!pmScheduleId) throw new Error("PM Schedule ID is required");
      return PMScheduleService.getPlanMaterialByScheduleId(pmScheduleId);
    },
    enabled: !!pmScheduleId,
  });
}

export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: {
      pm_schedule_id: number;
      pm_description: string;
      due_date: string;
      maintenance_id: number;
      asset_id: number;
      facility_id: number;
      system_id: number;
      package_id: number;
      work_center_id: number;
      work_order_no?: string;
      work_order_prefix?: string;
      work_order_date?: string;
      priority_id?: number;
      discipline_id?: number;
      task_id?: number;
      frequency_id?: number;
      pm_group_id?: number;
      asset_sce_code_id?: number;
    }) => PMScheduleService.createWorkOrder(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: scheduleKeys.workOrders(variables.pm_schedule_id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: scheduleKeys.detail(variables.pm_schedule_id) 
      });
    },
  });
};