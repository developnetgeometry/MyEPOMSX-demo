import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useInsulationConditionData = () => {
    return useQuery({
        queryKey: ["i-insulation-condition-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_insulation_condition")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching i_insulation_condition data:", error);
                throw error;
            }

            return data;
        },
    });
};

export const useInsulationConditionOptions = () => {
    const { data } = useInsulationConditionData();
    return data?.map((item) => ({ value: item.id, label: item.name }));
}