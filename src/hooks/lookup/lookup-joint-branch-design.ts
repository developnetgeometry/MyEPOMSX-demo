import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useJointBranchDesignData = () => {
    return useQuery({
        queryKey: ["i-joint-branch-design-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_joint_branch_design")
                .select("id, name, value")
                .order("id");

            if (error) {
                console.error("Error fetching i_joint_branch_design data:", error);
                throw error;
            }

            return data;
        },
    });
};