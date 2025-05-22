import { taskService } from "@/services/taskService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
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
  }