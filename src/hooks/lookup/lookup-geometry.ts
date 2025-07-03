import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";


export const useGeometryData = () => {
    return useQuery({
        queryKey: ["geometry"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_geometry")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_geometry data:", error);
                throw error;
            }

            return data;
        },
    })
}

export const useGeometryOptions = () => {
    const { data } = useGeometryData();
    return data?.map((item) => ({ value: item.id, label: item.name }));
};