import { corrosionStudyService } from "@/services/corrosionStudyService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCorrosionStudies = () => {
  return useQuery({
    queryKey: ["corrosionStudies"],
    queryFn: corrosionStudyService.getCorrosionStudies,
  });
};

export const useCorrosionStudy = (id: number) => {
  return useQuery({
    queryKey: ["corrosionStudy", id],
    queryFn: () => corrosionStudyService.getCorrosionStudyById(id),
    enabled: !!id,
  });
};

export const useAddCorrosionStudy = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: corrosionStudyService.addCorrosionStudy,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["corrosionStudies"] });
		},
	});
};

export const useUpdateCorrosionStudy = (id: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: corrosionStudyService.updateCorrosionStudy,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["corrosionStudies"] });
			queryClient.invalidateQueries({ queryKey: ["corrosionStudy", id] });
		},
	})
};

export const useDeleteCorrosionStudy = (id: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => corrosionStudyService.deleteCorrosionStudy(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["corrosionStudies"] });
			queryClient.invalidateQueries({ queryKey: ["corrosionStudy", id] });
		},
	});
};

export const useCorrosionStudiesCount = () => {
  return useQuery({
    queryKey: ["corrosionStudiesCount"],
    queryFn: async () => {
      const studies = await corrosionStudyService.getCorrosionStudies();
      return studies.length;
    },
  });
};

export const useCorrosionStudiesByAsset = (assetId: number) => {
  return useQuery({
    queryKey: ["corrosionStudiesByAsset", assetId],
    queryFn: async () => {
      const studies = await corrosionStudyService.getCorrosionStudies();
      return studies.filter((study) => study.asset_id === assetId);
    },
    enabled: !!assetId,
  });
};

export const useAssetOptions = () => {
	return useQuery({
		queryKey: ["assetOptions"],
		queryFn: async () => {
			return await corrosionStudyService.getAssetOptions();
		},
	});
};

export const useCorrosionGroupOptions = () => {
	return useQuery({
		queryKey: ["corrosionGroupOptions"],
		queryFn: async () => {
			return await corrosionStudyService.getCorrosionGroupOptions();
		},
	});
};

export const useMaterialConstructionOptions = () => {
	return useQuery({
		queryKey: ["materialConstructionOptions"],
		queryFn: async () => {
			return await corrosionStudyService.getMaterialConstructionOptions();
		},
	});
};

export const useCorrosionMonitoringOptions = () => {
	return useQuery({
		queryKey: ["corrosionMonitoringOptions"],
		queryFn: async () => {
			return await corrosionStudyService.getCorrosionMonitoringOptions();
		},
	});
};

export const useBaseMaterialOptions = () => {
	return useQuery({
		queryKey: ["baseMaterialOptions"],
		queryFn: async () => {
			return await corrosionStudyService.getBaseMaterialOptions();
		},
	});
};