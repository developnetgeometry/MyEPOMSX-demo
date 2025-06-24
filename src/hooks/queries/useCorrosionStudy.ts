import { useAuth } from "@/contexts/AuthContext";
import { CorrosionFactorData, CorrosionFactorUpdateData, CorrosionStudyData, corrosionStudyService, CorrosionStudyUpdateData } from "@/services/corrosionStudyService";
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

// Add new mutation hook
export const useCreateCorrosionStudy = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      studyData: Omit<
        CorrosionStudyData,
        "created_by" | "study_name" | "study_code"
      >;
      factorData: CorrosionFactorData;
    }) => {
      if (!user) throw new Error("User not authenticated");

	  const date = `${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}`

      const studyCode = `CS-${params.studyData.asset_no}-${date}`;
      const studyName = `Corrosion Study for ${params.studyData.asset_name} ${params.studyData.asset_no}`;

	  const { asset_name, asset_no, ...studyDataWithoutNames } = params.studyData;

      const fullStudyData: CorrosionStudyData = {
        ...studyDataWithoutNames,
        study_name: studyName,
        study_code: studyCode,
        created_by: user.id,
      };

      return corrosionStudyService.createCorrosionStudyWithFactor(
        fullStudyData,
        params.factorData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corrosionStudies"] });
    },
  });
};

export const useUpdateCorrosionStudy = (id: number) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      studyData: Omit<CorrosionStudyUpdateData, 'updated_by'>,
      factorData: CorrosionFactorUpdateData
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      const fullStudyData: CorrosionStudyUpdateData = {
        ...params.studyData,
        updated_by: user.id
      };
      
      return corrosionStudyService.updateCorrosionStudy(
        id,
        fullStudyData,
        params.factorData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corrosionStudies"] });
      queryClient.invalidateQueries({ queryKey: ["corrosionStudy", id] });
    }
  });
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
