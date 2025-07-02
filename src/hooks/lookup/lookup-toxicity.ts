import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";


export const useToxicityData = () => {
    return useQuery({
        queryKey: ["toxicity"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_toxicity")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_toxicity data:", error);
                throw error;
            }

            return data;
        },
    });
}

export const useToxicityOptions = () => {
    const { data } = useToxicityData();
    return data?.map((item) => ({ value: item.id, label: item.name }));
};