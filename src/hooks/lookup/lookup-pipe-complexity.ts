import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePipeComplexityData = () => {
    return useQuery({
        queryKey: ["i-pipe-complexity-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_pipe_complexity")
                .select("id, name, value")
                .order("id");

            if (error) {
                console.error("Error fetching i_pipe_complexity data:", error);
                throw error;
            }

            return data;
        },
    });
};