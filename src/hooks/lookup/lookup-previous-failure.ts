import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePreviousFailureData = () => {
    return useQuery({
        queryKey: ["i-previous-failure-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_previous_failure")
                .select("id, name, value")
                .order("id");

            if (error) {
                console.error("Error fetching i_previous_failure data:", error);
                throw error;
            }

            return data;
        },
    });
};