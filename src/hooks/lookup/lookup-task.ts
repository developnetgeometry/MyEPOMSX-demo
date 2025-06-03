import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useTask = () => {
    return useQuery({
        queryKey: ["e-task-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_task")
                .select("id, task_code, task_name")
                .eq("is_active", true)
                .order("id");

            if (error) {
                console.error("Error fetching e_task data:", error);
                throw error;
            }

            return data;
        },
    });
};