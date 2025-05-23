import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePriorityData = () => {
    return useQuery({
        queryKey: ["e-priority-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_priority")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_priority data:", error);
                throw error;
            }

            return data;
        },
    });
};