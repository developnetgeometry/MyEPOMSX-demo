import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useProjectTypeData = () => {
    return useQuery({
        queryKey: ["e-project-type-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_project_type")
                .select("id, name")
                .order("id", { ascending: false });

            if (error) {
                console.error("Error fetching e_project_type data:", error);
                throw error;
            }

            return data;
        },
    });
};