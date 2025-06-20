import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useInsulationTypeData = () => {
    return useQuery({
        queryKey: ["e-insulation-type-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_insulation_type")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_insulation_type data:", error);
                throw error;
            }

            return data;
        },
    });
};