import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  inventoryGroupsService,
  InventoryGroup,
  CreateInventoryGroupData,
  UpdateInventoryGroupData,
} from "@/services/inventoryGroupsService";

// Query keys for inventory groups
export const inventoryGroupKeys = {
  all: ["inventory-groups"] as const,
  lists: () => [...inventoryGroupKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...inventoryGroupKeys.lists(), filters] as const,
  details: () => [...inventoryGroupKeys.all, "detail"] as const,
  detail: (id: number) => [...inventoryGroupKeys.details(), id] as const,
  byAsset: (assetId: number) =>
    [...inventoryGroupKeys.all, "by-asset", assetId] as const,
  stats: () => [...inventoryGroupKeys.all, "stats"] as const,
};

/**
 * Hook to fetch inventory groups with optional filtering and pagination
 */
export const useInventoryGroups = (params?: {
  searchQuery?: string;
  statusFilter?: string;
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: inventoryGroupKeys.list(params || {}),
    queryFn: () => inventoryGroupsService.getInventoryGroups(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single inventory group by ID
 */
export const useInventoryGroup = (id: number) => {
  return useQuery({
    queryKey: inventoryGroupKeys.detail(id),
    queryFn: () => inventoryGroupsService.getInventoryGroupById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch inventory groups by asset ID
 */
export const useInventoryGroupsByAsset = (assetId: number) => {
  return useQuery({
    queryKey: inventoryGroupKeys.byAsset(assetId),
    queryFn: () => inventoryGroupsService.getInventoryGroupsByAssetId(assetId),
    enabled: !!assetId,
  });
};

/**
 * Hook to fetch inventory group statistics
 */
export const useInventoryGroupStats = () => {
  return useQuery({
    queryKey: inventoryGroupKeys.stats(),
    queryFn: () => inventoryGroupsService.getInventoryGroupStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to create a new inventory group
 */
export const useCreateInventoryGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryGroupData) =>
      inventoryGroupsService.createInventoryGroup(data),
    onSuccess: (newGroup) => {
      // Invalidate all inventory groups queries to refresh data
      queryClient.invalidateQueries({ queryKey: inventoryGroupKeys.all });

      // Optionally, you can also update the cache directly
      queryClient.setQueryData(
        inventoryGroupKeys.detail(newGroup.id),
        newGroup
      );
    },
    onError: (error) => {
      console.error("Error creating inventory group:", error);
    },
  });
};

/**
 * Hook to update an existing inventory group
 */
export const useUpdateInventoryGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateInventoryGroupData;
    }) => inventoryGroupsService.updateInventoryGroup(id, data),
    onSuccess: (updatedGroup, { id }) => {
      // Invalidate all inventory groups queries
      queryClient.invalidateQueries({ queryKey: inventoryGroupKeys.all });

      // Update the specific item in cache
      queryClient.setQueryData(inventoryGroupKeys.detail(id), updatedGroup);
    },
    onError: (error) => {
      console.error("Error updating inventory group:", error);
    },
  });
};

/**
 * Hook to delete an inventory group
 */
export const useDeleteInventoryGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => inventoryGroupsService.deleteInventoryGroup(id),
    onSuccess: (_, id) => {
      // Invalidate all inventory groups queries
      queryClient.invalidateQueries({ queryKey: inventoryGroupKeys.all });

      // Remove the specific item from cache
      queryClient.removeQueries({ queryKey: inventoryGroupKeys.detail(id) });
    },
    onError: (error) => {
      console.error("Error deleting inventory group:", error);
    },
  });
};

/**
 * Hook to check if a group name exists for validation
 */
export const useCheckGroupNameExists = () => {
  return useMutation({
    mutationFn: ({
      groupName,
      assetId,
      excludeId,
    }: {
      groupName: string;
      assetId: number;
      excludeId?: number;
    }) =>
      inventoryGroupsService.checkGroupNameExists(
        groupName,
        assetId,
        excludeId
      ),
  });
};

/**
 * Hook for prefetching inventory group data
 */
export const usePrefetchInventoryGroup = () => {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: inventoryGroupKeys.detail(id),
      queryFn: () => inventoryGroupsService.getInventoryGroupById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};
