import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useManufacturerData = () => {
    return useQuery({
        queryKey: ["e-manufacturer-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_manufacturer")
                .select("id, name")
                .order("id", { ascending: false });

            if (error) {
                console.error("Error fetching e_manufacturer data:", error);
                throw error;
            }

            return data;
        },
    });
};