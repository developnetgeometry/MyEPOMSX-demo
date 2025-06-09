import { itemMasterService } from "@/services/itemMasterService";
import { CreateItemMasterDTO, UpdateItemMasterDTO } from "@/types/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const itemMasterKeys = {
  all: ["itemMasters"] as const,
  list: () => [...itemMasterKeys.all, "list"] as const,
  detail: (id: number) => [...itemMasterKeys.all, "detail", id] as const,
};

export const useItemMaster = () => {
  return useQuery({
    queryKey: itemMasterKeys.list(),
    queryFn: () => itemMasterService.getItemMaster(),
  });
};

export const useItemMasterDetail = (id: number) => {
  return useQuery({
    queryKey: itemMasterKeys.detail(id),
    queryFn: () => itemMasterService.getItemMasterById(id),
    enabled: !!id,
  });
};

export const useAddItemMaster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItemMaster: CreateItemMasterDTO) =>
      await itemMasterService.createItemMaster(newItemMaster),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemMasterKeys.list() });
    },
  });
};

export const useUpdateItemMaster = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemMaster: UpdateItemMasterDTO) =>
      await itemMasterService.updateItemMaster(id, itemMaster),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemMasterKeys.list() });
    },
  });
};

export const useCategoryOptions = () => {
  return useQuery({
    queryKey: ["categoryOptions"],
    queryFn: () => itemMasterService.getCategoryOptions(),
  });
};

export const useManufacturerOptions = () => {
  return useQuery({
    queryKey: ["manufacturerOptions"],
    queryFn: () => {
      return itemMasterService.getManufacturerOptions();
    },
  });
};
export const useItemGroupOptions = () => {
  return useQuery({
    queryKey: ["itemGroupOptions"],
    queryFn: () => {
      return itemMasterService.getItemGroupOptions();
    },
  });
};
export const useItemTypeOptions = () => {
  return useQuery({
    queryKey: ["itemTypeOptions"],
    queryFn: () => {
      return itemMasterService.getItemTypeOptions();
    },
  });
};
export const useUnitOptions = () => {
  return useQuery({
    queryKey: ["unitOptions"],
    queryFn: () => {
      return itemMasterService.getUnitOptions();
    },
  });
};
export const useCriticalityOptions = () => {
  return useQuery({
    queryKey: ["criticalityOptions"],
    queryFn: () => {
      return itemMasterService.getCriticalityOptions();
    },
  });
};