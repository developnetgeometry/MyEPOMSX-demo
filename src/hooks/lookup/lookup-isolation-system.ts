import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useIsolationSystemData = () => {
    return useQuery({
        queryKey: ["e-isolation-system-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_isolation_system")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_isolation_system data:", error);
                throw error;
            }

            return data;
        },
    });
};