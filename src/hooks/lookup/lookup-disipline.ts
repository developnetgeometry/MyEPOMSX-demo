import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useDisciplineData = () => {
    return useQuery({
        queryKey: ["e-discipline-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_discipline")
                .select("id, code, name, description, type")
                .order("id");

            if (error) {
                console.error("Error fetching e_discipline data:", error);
                throw error;
            }

            return data;
        },
    });
};