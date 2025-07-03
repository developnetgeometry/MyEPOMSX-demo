import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useInsulationComplexityData = () => {
    return useQuery({
        queryKey: ["i-insulation-complexity-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_insulation_complexity")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching i_insulation_complexity data:", error);
                throw error;
            }

            return data;
        },
    });
};

export const useInsulationComplexityOptions = () => {
    const { data } = useInsulationComplexityData();
    return data?.map((item) => ({ value: item.id, label: item.name }));
};