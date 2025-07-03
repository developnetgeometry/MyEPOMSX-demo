import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsProtectionByAssetDetailId = (assetDetailId: number) => {
  return useQuery({
    queryKey: ["i-ims-protection", assetDetailId],
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

      // Step 2: Fetch i_ims_protection data using imsGeneralId
      const { data: protectionData, error: protectionError } = await supabase
        .from("i_ims_protection")
        .select(`
          id,
          coating_quality_id,
          isolation_system_id,
          online_monitor (id, name),
          minimum_thickness,
          post_weld_heat_treatment,
          line_description,
          replacement_line,
          detection_system_id,
          mitigation_system_id (id, name, value),
          design_fabrication_id(id ,name, value),
          insulation_type_id (id, name, value),
          interface_id (id, name, value),
          insulation_complexity_id (id, name, value),
          insulation_condition_id (id, name, value),
          lining_type,
          lining_condition,
          lining_monitoring,
          ims_general_id
        `)
        .eq("ims_general_id", imsGeneralId) // Fetch records based on imsGeneralId
        .single(); // Fetch a single record

      if (protectionError) {
        console.error("Error fetching i_ims_protection data:", protectionError);
        throw protectionError;
      }

      return protectionData;
    },
    enabled: !!assetDetailId, // Only fetch if assetDetailId is provided
  });
};