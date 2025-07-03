import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useIdealGasSpecificHeatEqData = () => {
    return useQuery({
        queryKey: ["e-ideal-gas-specific-heat-eq-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_ideal_gas_specific_heat_eq")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_ideal_gas_specific_heat_eq data:", error);
                throw error;
            }

            return data;
        },
    });
};