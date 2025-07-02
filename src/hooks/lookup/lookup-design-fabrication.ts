import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useDesignFabricationData = () => {
    return useQuery({
        queryKey: ["e-design-fabrication-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_design_fabrication")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_design_fabrication data:", error);
                throw error;
            }

            return data;
        },
    });
};

export const useDesignFabricationOptions = () => {
    const { data } = useDesignFabricationData();
    return data?.map((item) => ({ value: item.id, label: item.name }));
};