import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assetService } from "@/services/assetService";
import { Asset, AssetWithRelations } from "@/types/manage";

// Define query keys for assets
export const assetKeys = {
  all: ["assets"] as const,
  lists: () => [...assetKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...assetKeys.lists(), filters] as const,
  details: () => [...assetKeys.all, "detail"] as const,
  detail: (id: number) => [...assetKeys.details(), id] as const,
  withRelations: () => [...assetKeys.all, "withRelations"] as const,
  hierarchy: () => [...assetKeys.all, "hierarchy"] as const,
  workOrdersByAsset: (assetId: number) =>
    [...assetKeys.detail(assetId), "workOrders"] as const,
  bomItems: () => [...assetKeys.all, "bomItems"] as const,
  bomItemsByBomId: (bomId: number) => [...assetKeys.bomItems(), bomId] as const,
  attachments: () => [...assetKeys.all, "attachments"] as const,
  attachmentsByAssetId: (assetId: number) =>
    [...assetKeys.attachments(), assetId] as const,
};

export const useAssets = () => {
  return useQuery({
    queryKey: assetKeys.lists(),
    queryFn: () => assetService.getAssets(),
  });
};

export const useAsset = (id: number) => {
  return useQuery({
    queryKey: assetKeys.detail(id),
    queryFn: async () => {
      const assets = await assetService.getAssets();
      const asset = assets.find((asset) => asset.id === id);
      if (!asset) {
        throw new Error(`Asset with ID ${id} not found`);
      }
      return asset;
    },
    enabled: !!id,
  });
};

export const useAssetsWithRelations = () => {
  return useQuery({
    queryKey: assetKeys.withRelations(),
    queryFn: () => assetService.getAssetsWithRelations(),
  });
};

export const useAssetHierarchy = () => {
  return useQuery({
    queryKey: assetKeys.hierarchy(),
    queryFn: () => assetService.getAssetHierarchy(),
  });
};

export const useAssetHierarchyNodeDetails = (
  nodeType: string,
  nodeId: string | number
) => {
  return useQuery({
    queryKey: [...assetKeys.hierarchy(), nodeType, nodeId],
    queryFn: () => assetService.getAssetHierarchyNodeDetails(nodeType, nodeId),
    enabled: !!nodeId && !!nodeType,
  });
};

export const useAssetWithRelations = (id: number) => {
  return useQuery<AssetWithRelations, Error>({
    queryKey: assetKeys.detail(id),
    queryFn: async () => {
      try {
        const assetById = await assetService.getAssetByIdWithRelations(id);
        if (!assetById) {
          throw new Error(`Asset with ID ${id} not found`);
        }
        return assetById;
      } catch (error) {
        // Convert to Error if not already an Error instance
        throw error instanceof Error
          ? error
          : new Error("Failed to fetch asset");
      }
    },
    enabled: !!id,
  });
};

export const useItemByBomId = (bomId: number) => {
  return useQuery({
    queryKey: assetKeys.bomItemsByBomId(bomId),
    queryFn: () => assetService.getItemsByBomId(bomId),
    enabled: !!bomId,
    // Add this to prevent automatic refetch on window focus
    refetchOnWindowFocus: false
  });
};

export const useWorkOrdersByAssetId = (assetId: number) => {
  return useQuery({
    queryKey: assetKeys.workOrdersByAsset(assetId),
    queryFn: () => assetService.getWorkOrdersByAssetId(assetId),
    enabled: !!assetId,
  });
};

export const useAssetAttachments = (assetId: number) => {
  return useQuery({
    queryKey: assetKeys.attachmentsByAssetId(assetId),
    queryFn: () => assetService.getAssetAttachments(assetId),
    enabled: !!assetId,
  });
};

export const useChildAssetsByParentId = (parentAssetId: number) => {
  return useQuery({
    queryKey: [...assetKeys.detail(parentAssetId), "childAssets"],
    queryFn: () => assetService.getChildAssetsByParentId(parentAssetId),
    enabled: !!parentAssetId,
  });
};

export const useRemoveChildAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => assetService.removeChildAsset(id),
    onSuccess: (_data, id) => {
      // Invalidate queries to refresh data after deletion
      queryClient.invalidateQueries({queryKey: assetKeys.all});
      queryClient.invalidateQueries({queryKey: [...assetKeys.detail(id), "childAssets"]});
    },
  });
};

export const useRemoveBom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => assetService.removeBom(id),
    onSuccess: async (_data, id) => {
      // Invalidate all relevant queries to ensure UI updates
      await queryClient.invalidateQueries({ queryKey: assetKeys.bomItems() });
      await queryClient.invalidateQueries({ queryKey: assetKeys.all });
      await queryClient.invalidateQueries({ queryKey: assetKeys.withRelations() });
      await queryClient.invalidateQueries({ queryKey: assetKeys.bomItemsByBomId(id) });
      await queryClient.invalidateQueries({ queryKey: [...assetKeys.bomItemsByBomId(id), "bomItems"] });
      // Optionally, invalidate asset detail queries if BOM is tied to an asset
      // await queryClient.invalidateQueries({ queryKey: assetKeys.detail(assetId) });
    },
  });
};