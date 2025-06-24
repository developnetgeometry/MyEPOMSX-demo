import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useAssetData = () => {
  return useQuery({
    queryKey: ["e-asset-data"],
    queryFn: async () => {
      // Fetch asset data with nested relationships
      const { data: assets, error: assetError } = await supabase
        .from("e_asset")
        .select(
          `id, asset_name, asset_no, asset_detail_id, asset_sce_id (id, sce_code), 
          package_id (id, package_name, package_no, package_tag, 
            system_id (id, system_code, system_no, system_name, 
              facility_id (id, location_code, location_name)
            )
          )`
        );

      if (assetError) {
        console.error("Error fetching e_asset data:", assetError);
        throw assetError;
      }

      // Return raw asset data with nested relationships
      return assets;
    },
  });
};

export const useAssetIntegrityData = () => {
  return useQuery({
    queryKey: ["e-asset-integrity-data"],
    queryFn: async () => {
      // Step 1: Fetch asset_detail_id values from i_ims_general
      const { data: imsGeneralData, error: imsGeneralError } = await supabase
        .from("i_ims_general")
        .select("asset_detail_id");

      if (imsGeneralError) {
        console.error("Error fetching i_ims_general data:", imsGeneralError);
        throw imsGeneralError;
      }

      const validAssetDetailIds = imsGeneralData.map((item) => item.asset_detail_id);

      // Step 2: Fetch asset data filtered by valid asset_detail_id
      const { data: assets, error: assetError } = await supabase
        .from("e_asset")
        .select(
          `id, asset_name, asset_no, asset_detail_id, asset_sce_id (id, sce_code), 
          package_id (id, package_name, package_no, package_tag, 
            system_id (id, system_code, system_no, system_name, 
              facility_id (id, location_code, location_name)
            )
          )`
        )
        .in("asset_detail_id", validAssetDetailIds); // Filter by valid asset_detail_id

      if (assetError) {
        console.error("Error fetching e_asset data:", assetError);
        throw assetError;
      }

      // Return filtered asset data
      return assets;
    },
  });
};