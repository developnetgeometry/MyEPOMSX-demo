import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useDataConfidenceData = () => {
    return useQuery({
        queryKey: ["e-data-confidence-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_data_confidence")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching i_data_confidence data:", error);
                throw error;
            }

            return data;
        },
    });
};