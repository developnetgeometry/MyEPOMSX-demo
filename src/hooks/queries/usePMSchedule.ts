import { PMScheduleService } from "@/services/PMScheduleService";
import { PMSchedule } from "@/types/maintain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const scheduleKeys = {
  all: ["schedule"] as const,
  list: () => [...scheduleKeys.all, "list"] as const,
  detail: (id: number) => [...scheduleKeys.all, "detail", id] as const,
  customTasks: (id: number) => [...scheduleKeys.detail(id), "custom-tasks"] as const
}

export const usePMSchedules = () => {
    return useQuery({
        queryKey: scheduleKeys.list(),
        queryFn: () => PMScheduleService.getPMSchedules(),
    });
}

export const usePMSchedule = (id: number) => {
    return useQuery({
        queryKey: scheduleKeys.detail(id),
        queryFn: () => PMScheduleService.getPMScheduleById(id),
    });
}

export const useCreatePMSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PMScheduleService.createPMSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  })
}

export const useUpdatePMSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PMScheduleService.updatePMSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  })
}

export const useDeletePMSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PMScheduleService.deletePMSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  })
}

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
}

export const usePackageOptions = () => {
  return useQuery({
    queryKey: ["packageOptions"],
    queryFn: () => PMScheduleService.getPackageOptions(),
  });
}

export const useTaskOptions = () => {
  return useQuery({
    queryKey: ["taskOptions"],
    queryFn: () => PMScheduleService.getTaskOptions(),
  });
}

export const useDisciplineOptions = () => {
  return useQuery({
    queryKey: ["disciplineOptions"],
    queryFn: () => PMScheduleService.getDisciplineOptions(),
  });
}

export const usePMScheduleCustomTasks = (pmScheduleId: number | undefined) => {
  return useQuery({
    queryKey: scheduleKeys.customTasks(pmScheduleId),
    queryFn: () => {
      if (!pmScheduleId) throw new Error('PM Schedule ID is required');
      return PMScheduleService.getPMScheduleCustomTasks(pmScheduleId);
    },
    enabled: !!pmScheduleId
  });
};

export const useCreatePMScheduleCustomTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PMScheduleService.createPMScheduleCustomTask,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: scheduleKeys.customTasks(variables.pm_schedule_id) 
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
        (old: any[]) => old?.map(task => 
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