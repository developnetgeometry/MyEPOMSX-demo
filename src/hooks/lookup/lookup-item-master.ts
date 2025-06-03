import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useItemMasterData = () => {
    return useQuery({
        queryKey: ["e-item-master-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_item_master")
                .select("id, item_no, item_name")
                .order("id");

            if (error) {
                console.error("Error fetching e_item_master data:", error);
                throw error;
            }

            return data;
        },
    });
};