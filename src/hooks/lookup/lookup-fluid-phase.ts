import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";


export const useFluidPhaseData = () => {
    return useQuery({
        queryKey: ["fluid-phase"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_fluid_phase")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_fluid_phase data:", error);
                throw error;
            }

            return data;
        }
    })
}

export const useFluidPhaseOptions = () => {
    const { data } = useFluidPhaseData();
    return data?.map((item) => ({ value: item.id, label: item.name }));
};