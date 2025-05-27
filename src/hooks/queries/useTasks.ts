import { taskService } from "@/services/taskService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
};

export const useTasks = () => {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: () => taskService.getTasks(),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

export const useDisciplineOptions = () => {
  return useQuery({
    queryKey: ["disciplineOptions"],
    queryFn: () => taskService.getDisciplineOptions(),
  });
};

export const useTaskWithDetails = (id: number | undefined, options?: any) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error('ID is required');
      return taskService.getTaskWithDetails(id);
    },
    ...options, // Spread any additional options
  });
};


export const useAddDetailToTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.addDetailsToTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.details() });
    },
  });
};

export const useUpdateTaskDetail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.updateTaskDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.details() });
    },
  });
};

export const useDeleteTaskDetail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.deleteTaskDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.details() });
    },
  });
};