import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useBranchDiameterData = () => {
    return useQuery({
        queryKey: ["i-branch-diameter-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_branch_diameter")
                .select("id, name, value")
                .order("id");

            if (error) {
                console.error("Error fetching i_branch_diameter data:", error);
                throw error;
            }

            return data;
        },
    });
};