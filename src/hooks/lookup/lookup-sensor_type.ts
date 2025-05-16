import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useSensorTypeData = () => {
    return useQuery({
        queryKey: ["e-sensor-type-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_sensor_type")
                .select("id, name")
                .order("id", { ascending: false });

            if (error) {
                console.error("Error fetching e_sensor_type data:", error);
                throw error;
            }

            return data;
        },
    });
};