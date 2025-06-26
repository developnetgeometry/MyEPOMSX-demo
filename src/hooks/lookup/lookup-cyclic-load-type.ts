import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCyclicLoadTypeData = () => {
    return useQuery({
        queryKey: ["i-cyclic-load-type-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_cyclic_load_type")
                .select("id, name, value")
                .order("id");

            if (error) {
                console.error("Error fetching i_cyclic_load_type data:", error);
                throw error;
            }

            return data;
        },
    });
};