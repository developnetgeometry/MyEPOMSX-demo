import { inventoryService } from "@/services/inventoryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const inventoryKeys = {
  list: () => ["inventories"],
  detail: (id: string) => [...inventoryKeys.list(), id],
  sparePartsOptions: () => [...inventoryKeys.list(), "sparePartsOptions"],
  storeOptions: () => [...inventoryKeys.list(), "storeOptions"],
  rackNoOptions: () => [...inventoryKeys.list(), "rackNoOptions"],
};


export const useInventoryList = (params?: {
  storeId?: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}) => {
  return useQuery({
    queryKey: [inventoryKeys.list(), params],
    queryFn: () => inventoryService.getInventoryList(params),
  });
}

export const useAddInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.list() });
    },
  });
}

export const useSparePartsOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.sparePartsOptions(),
    queryFn: () => inventoryService.getSparePartsOptions(),
  });
};

export const useStoreOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.storeOptions(),
    queryFn: () => inventoryService.getStoreOptions(),
  });
}

export const useRackNoOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.rackNoOptions(),
    queryFn: () => inventoryService.getRackNoOptions(),
  });
}
