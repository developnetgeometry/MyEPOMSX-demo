import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCriticalityData = () => {
    return useQuery({
        queryKey: ["e-cm-criticality-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_criticality")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_criticality data:", error);
                throw error;
            }

            return data;
        },
    });
};