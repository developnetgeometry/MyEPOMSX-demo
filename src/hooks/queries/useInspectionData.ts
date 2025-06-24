import { inspectionDataService } from "@/services/inspectionDataService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useInspectionDataList = () => {
    return useQuery({
        queryKey: ["inspectionDataList"],
        queryFn: inspectionDataService.getInspectionDataList,
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

export const useAssetDetailOptionsWithAssetName = () => {
    return useQuery({
        queryKey: ["assetDetailOptionsWithAssetName"],
        queryFn: inspectionDataService.getAssetDetailOptionsWithAssetName,
    });
};
