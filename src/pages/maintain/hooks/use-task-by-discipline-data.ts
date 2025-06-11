import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useTaskByDisciplineData = (disciplineId: number) => {
  return useQuery({
    queryKey: ["e-task-data", disciplineId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_task")
        .select("id, task_code, task_name, discipline_id, is_active")
        .eq("discipline_id", disciplineId)
        .eq("is_active", true)
        .order("id");

      if (error) {
        console.error("Error fetching e_task data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!disciplineId, // Only fetch if disciplineId is provided
  });
};