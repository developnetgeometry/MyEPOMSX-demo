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
          `id, asset_name, asset_no, asset_sce_id (id, sce_code), 
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