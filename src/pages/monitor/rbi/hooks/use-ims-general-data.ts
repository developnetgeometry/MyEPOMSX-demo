import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";


export const useImsGeneralData = () => {
  return useQuery({
    queryKey: ["i-ims-general-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_ims_general")
        .select(`
    id,
    line_no,
    pipe_schedule_id,
    pressure_rating,
    year_in_service,
    normal_wall_thickness,
    tmin,
    material_construction_id,
    description,
    circuit_id,
    nominal_bore_diameter,
    insulation,
    line_h2s,
    internal_lining,
    pwht,
    cladding,

    asset_detail:e_asset_detail!i_ims_general_e_asset_detail_fk (
      id,
      type:type_id (id, name),

      asset:e_asset!e_asset_detail_asset_id_key (
        id,
        asset_no,
        asset_name
      )
    ),

    ims_asset_type_id,
    inner_diameter,
    clad_thickness,
    pipe_class_id
  `)
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching i_ims_general data:", error);
        throw error;
      }

      // Map the data to include PoF, CoF, and Risk with default values
      const mappedData = data?.map((item) => ({
        ...item,
        PoF: "D", // Default value for PoF
        CoF: 0, // Default value for CoF
        Risk: "Medium", // Default value for Risk
      }));

      return mappedData;
    },
  });
};

export const useImsGeneralDataByAssetDetailId = (assetDetailId: number) => {
  return useQuery({
    queryKey: ["i-ims-general-data-by-asset-detail-id", assetDetailId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_ims_general")
        .select(`
          id,
          line_no,
          pipe_schedule_id,
          pressure_rating,
          year_in_service,
          normal_wall_thickness,
          tmin,
          material_construction_id (id, spec_code),
          description,
          circuit_id,
          nominal_bore_diameter,
          insulation,
          line_h2s,
          internal_lining,
          pwht,
          cladding,
          ims_asset_type_id,
          clad_thickness,
          pipe_class_id,
          asset_detail_id (
            id,
            type_id (name),
            e_asset!e_asset_detail_asset_id_fkey (
              asset_no,
              asset_name
            )
          )
        `)
        .eq("asset_detail_id", assetDetailId)
        .single(); // Expecting exactly one match

      if (error) {
        console.error("Error fetching i_ims_general data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!assetDetailId, // Only run if assetDetailId is valid
  });
};

