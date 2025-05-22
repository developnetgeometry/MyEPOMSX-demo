import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCmSceData = () => {
    return useQuery({
        queryKey: ["e-cm-sce-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_cm_sce")
                .select("id, cm_group_name, cm_sce_code")
                .order("id");

            if (error) {
                console.error("Error fetching e_cm_sce data:", error);
                throw error;
            }

            return data;
        },
    });
};