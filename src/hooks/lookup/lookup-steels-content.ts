import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useSteelsContentData = () => {
    return useQuery({
        queryKey: ["i-steelscontent-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_steelscontent")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching i_steelscontent data:", error);
                throw error;
            }

            return data;
        },
    });
};