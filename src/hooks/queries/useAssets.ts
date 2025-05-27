import { useQuery } from "@tanstack/react-query";
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
  hierarchy: () => [...assetKeys.all, 'hierarchy'] as const,
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
    queryKey: assetKeys.hierarchy(), // You'll need to add this to your assetKeys
    queryFn: () => assetService.getAssetHierarchy(),
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
    queryKey: assetKeys.detail(bomId),
    queryFn: () => assetService.getItemsByBomId(bomId),
    enabled: !!bomId,
  });
};
