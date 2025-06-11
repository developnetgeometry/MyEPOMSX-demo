import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useAssetGroupData = () => {
    return useQuery({
        queryKey: ["e-asset-group-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_asset_group")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_asset_group data:", error);
                throw error;
            }

            return data;
        },
    });
};