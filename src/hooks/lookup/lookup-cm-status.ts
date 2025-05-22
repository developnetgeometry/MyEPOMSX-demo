import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCmStatusData = () => {
    return useQuery({
        queryKey: ["e-cm-status-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_cm_status")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_cm_status data:", error);
                throw error;
            }

            return data;
        },
    });
};