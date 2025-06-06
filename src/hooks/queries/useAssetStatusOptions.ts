import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export interface AssetStatusOption {
  value: string;
  label: string;
  id: number;
  is_active: boolean;
}

export const useAssetStatusOptions = () => {
  return useQuery<AssetStatusOption[]>({
    queryKey: ["asset-status-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_asset_status")
        .select("id, name, is_active");
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.name,
          label: row.name,
          id: row.id,
          is_active: row.is_active,
        })) || []
      );
    },
  });
};
