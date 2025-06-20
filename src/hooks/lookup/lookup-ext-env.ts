import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useExtEnvData = () => {
    return useQuery({
        queryKey: ["e-ext-env-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_ext_env")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_ext_env data:", error);
                throw error;
            }

            return data;
        },
    });
};