import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useShutdownTypeData = () => {
    return useQuery({
        queryKey: ["e-shutdown-type-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_shutdown_type")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_shutdown_type data:", error);
                throw error;
            }

            return data;
        },
    });
};