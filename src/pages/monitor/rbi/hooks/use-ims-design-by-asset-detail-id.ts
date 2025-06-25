import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsDesignByAssetDetailId = (assetDetailId: number) => {
  return useQuery({
    queryKey: ["i-ims-design", assetDetailId],
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

      // Step 2: Fetch i_ims_design data using imsGeneralId
      const { data: designData, error: designError } = await supabase
        .from("i_ims_design")
        .select(`
          id,
          internal_diameter,
          welding_efficiency,
          design_pressure,
          corrosion_allowance,
          outer_diameter,
          design_temperature,
          operating_pressure_mpa,
          ext_env_id (id, name),
          geometry_id,
          length,
          operating_temperature,
          allowable_stress_mpa,
          pipe_support,
          soil_water_interface,
          dead_legs,
          mix_point,
          ims_general_id
        `)

        .eq("ims_general_id", imsGeneralId) // Fetch records based on imsGeneralId
        .single(); // Fetch a single record

      if (designError) {
        console.error("Error fetching i_ims_design data:", designError);
        throw designError;
      }

      return designData;
    },
    enabled: !!assetDetailId, // Only fetch if assetDetailId is provided
  });
};