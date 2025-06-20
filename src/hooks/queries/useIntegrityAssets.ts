import { useQuery } from "@tanstack/react-query";
import { integrityService, IntegrityAsset } from "@/services/integrityService";

// Query keys for integrity assets
export const integrityKeys = {
  all: ["integrity"] as const,
  lists: () => [...integrityKeys.all, "list"] as const,
  list: (type: string) => [...integrityKeys.lists(), type] as const,
  pressureVessels: () =>
    [...integrityKeys.lists(), "pressure-vessels"] as const,
  piping: () => [...integrityKeys.lists(), "piping"] as const,
  details: () => [...integrityKeys.all, "detail"] as const,
  detail: (id: number) => [...integrityKeys.details(), id] as const,
};

/**
 * Hook to fetch pressure vessel assets for integrity management
 */
export const usePressureVesselAssets = () => {
  return useQuery<IntegrityAsset[], Error>({
    queryKey: integrityKeys.pressureVessels(),
    queryFn: () => integrityService.getPressureVesselAssets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch piping assets for integrity management
 */
export const usePipingAssets = () => {
  return useQuery<IntegrityAsset[], Error>({
    queryKey: integrityKeys.piping(),
    queryFn: () => integrityService.getPipingAssets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch integrity assets by type
 * @param imsAssetTypeId - 1 for pressure vessels, 2 for piping
 */
export const useIntegrityAssets = (imsAssetTypeId: number) => {
  return useQuery<IntegrityAsset[], Error>({
    queryKey: integrityKeys.list(imsAssetTypeId.toString()),
    queryFn: () => integrityService.getIntegrityAssets(imsAssetTypeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single integrity asset by ID
 */
export const useIntegrityAsset = (id: number) => {
  return useQuery<IntegrityAsset | null, Error>({
    queryKey: integrityKeys.detail(id),
    queryFn: () => integrityService.getIntegrityAssetById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
