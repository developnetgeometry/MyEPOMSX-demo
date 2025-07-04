import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePipeConditionData = () => {
    return useQuery({
        queryKey: ["i-pipe-condition-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_pipe_condition")
                .select("id, name, value")
                .order("id");

            if (error) {
                console.error("Error fetching i_pipe_condition data:", error);
                throw error;
            }

            return data;
        },
    });
};