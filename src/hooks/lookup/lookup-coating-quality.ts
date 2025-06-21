import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCoatingQualityData = () => {
    return useQuery({
        queryKey: ["e-coating-quality-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_coating_quality")
                .select("id, name, value")
                .order("id");

            if (error) {
                console.error("Error fetching e_coating_quality data:", error);
                throw error;
            }

            return data;
        },
    });
};