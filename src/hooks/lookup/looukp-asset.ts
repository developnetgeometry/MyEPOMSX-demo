import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useAssetData = () => {
    return useQuery({
        queryKey: ["e-asset-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_asset")
                .select("id, asset_no, asset_name")
                .order("id");

            if (error) {
                console.error("Error fetching e_asset data:", error);
                throw error;
            }

            return data;
        },
    });
};