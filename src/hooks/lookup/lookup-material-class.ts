import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useMaterialClassData = () => {
    return useQuery({
        queryKey: ["e-material-class-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_material_class")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_material_class data:", error);
                throw error;
            }

            return data;
        },
    });
};