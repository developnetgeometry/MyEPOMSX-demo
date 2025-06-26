import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCorrectiveActionData = () => {
    return useQuery({
        queryKey: ["i-corrective-action-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_corrective_action")
                .select("id, name, value")
                .order("id");

            if (error) {
                console.error("Error fetching i_corrective_action data:", error);
                throw error;
            }

            return data;
        },
    });
};