import { inspectionDataService } from "@/services/inspectionDataService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useInspectionDataList = () => {
    return useQuery({
        queryKey: ["inspectionDataList"],
        queryFn: inspectionDataService.getInspectionDataList,
    });
};

export const useInspectionData = (id: number | undefined) => {
  return useQuery({
    queryKey: ["inspectionData", id],
    queryFn: async () => {
      if (id === undefined) return null;
      return inspectionDataService.getInspectionData(id);
    },
    enabled: id !== undefined,
  });
};

export const useCreateInspectionData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: inspectionDataService.createInspectionData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inspectionDataList"] });
        },
    });
}

export const useUpdateInspectionData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: any }) =>
      inspectionDataService.updateInspectionData(id, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inspectionDataList"] });
      queryClient.invalidateQueries({ 
        queryKey: ["inspectionData", variables.id] 
      });
    },
  });
};

export const useAssetDetailOptionsWithAssetName = () => {
    return useQuery({
        queryKey: ["assetDetailOptionsWithAssetName"],
        queryFn: inspectionDataService.getAssetDetailOptionsWithAssetName,
    });
};
