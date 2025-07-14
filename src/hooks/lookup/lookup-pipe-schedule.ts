import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const pipeScheduleData = () => {
  return useQuery({
    queryKey: ["pipeSchedule"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pipe_schedule")
        .select("id, name")
        .order("name");

      if (error) {
        throw new Error(`Error fetching pipe schedules: ${error.message}`);
      }

      return data;
    },
  });
};

export const usePipeScheduleOptions = () => {
  const { data } = pipeScheduleData();
  return data?.map((item) => ({ value: item.id, label: item.name }));
};