import { integrityService } from "@/services/integrityService"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../use-toast"

export const useVesselData = (assetId: number) => {
    return useQuery({
        queryKey: ["vesselData"],
        queryFn: () => integrityService.getVesselData(assetId)
    })
}

export const useUpdateVesselData = (assetId: number, setIsEditing?: (v: boolean) => void) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: async (payload: any) => {
      return integrityService.updateVesselData(assetId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vesselData", assetId] })
      toast({
        title: "Success",
        description: "Pressure vessel data updated successfully.",
      })
      if (setIsEditing) setIsEditing(false)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update vessel data.",
        variant: "destructive",
      })
    },
  })
}