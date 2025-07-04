import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useInterfaceData = () => {
    return useQuery({
        queryKey: ["e-interface-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_interface")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_interface data:", error);
                throw error;
            }

            return data;
        },
    });
};

export const useInterfaceOptions = () => {
    const { data } = useInterfaceData();
    return data?.map((item) => ({ value: item.id, label: item.name }));
};