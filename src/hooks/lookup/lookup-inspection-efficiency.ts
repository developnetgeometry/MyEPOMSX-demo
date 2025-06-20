import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useInspectionEfficiencyData = () => {
    return useQuery({
        queryKey: ["e-inspection-efficiency-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_inspection_efficiency")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching i_inspection_efficiency data:", error);
                throw error;
            }

            return data;
        },
    });
};