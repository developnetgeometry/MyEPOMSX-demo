import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useNewWorkFailureTypeData = () => {
    return useQuery({
        queryKey: ["e-new-work-failure-type-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_new_work_failure_type")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_new_work_failure_type data:", error);
                throw error;
            }

            return data;
        },
    });
};