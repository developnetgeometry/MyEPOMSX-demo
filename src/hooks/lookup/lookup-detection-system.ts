import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useDetectionSystemData = () => {
    return useQuery({
        queryKey: ["e-detection-system-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_detection_system")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_detection_system data:", error);
                throw error;
            }

            return data;
        },
    });
};

export const useDetectionSystemOptions = () => {
    const { data } = useDetectionSystemData();
    return data?.map((item) => ({ value: item.id, label: item.name }));
};