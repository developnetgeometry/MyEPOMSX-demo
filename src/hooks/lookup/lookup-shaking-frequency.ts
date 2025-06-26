import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useShakingFrequencyData = () => {
    return useQuery({
        queryKey: ["i-shaking-frequency-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_shaking_frequency")
                .select("id, name, value")
                .order("id");

            if (error) {
                console.error("Error fetching i_shaking_frequency data:", error);
                throw error;
            }

            return data;
        },
    });
};