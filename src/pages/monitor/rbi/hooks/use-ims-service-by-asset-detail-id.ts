import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsServiceByAssetDetailId = (assetDetailId: number) => {
  return useQuery({
    queryKey: ["i-ims-service", assetDetailId],
    queryFn: async () => {
      // Step 1: Fetch imsGeneralId from i_ims_general
      const { data: generalData, error: generalError } = await supabase
        .from("i_ims_general")
        .select("id") // Select only the id (imsGeneralId)
        .eq("asset_detail_id", assetDetailId)
        .limit(1) // Limit to one record
        .single(); // Fetch a single record

      if (generalError) {
        console.error("Error fetching i_ims_general data:", generalError);
        throw generalError;
      }

      const imsGeneralId = generalData?.id;
      if (!imsGeneralId) {
        throw new Error("No imsGeneralId found for the given assetDetailId.");
      }

      // Step 2: Fetch i_ims_service data using imsGeneralId
      const { data: serviceData, error: serviceError } = await supabase
        .from("i_ims_service")
        .select(`
          id,
          fluid_representive_id (id, name),
          fluid_phase_id (id, name),
          toxicity_id,
          toxic_mass_fraction,
          asset_detail_id
        `)
        .eq("asset_detail_id", assetDetailId) // Fetch records based on assetDetailId
        .single(); // Fetch a single record

      if (serviceError) {
        console.error("Error fetching i_ims_service data:", serviceError);
        throw serviceError;
      }

      return serviceData;
    },
    enabled: !!assetDetailId, // Only fetch if assetDetailId is provided
  });
};