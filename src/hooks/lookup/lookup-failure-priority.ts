import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useFailurePriorityData = () => {
    return useQuery({
        queryKey: ["e-failure-priority-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_failure_priority")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_failure_priority data:", error);
                throw error;
            }

            return data;
        },
    });
};