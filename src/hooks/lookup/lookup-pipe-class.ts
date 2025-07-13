// hooks/lookup/lookup-pipe-class.ts
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePipeClassData = () => {
  return useQuery({
    queryKey: ["pipe-class"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pipe_class")
        .select("id, name")
        .order("name");

      if (error) {
        throw new Error(`Error fetching pipe classes: ${error.message}`);
      }

      return data;
    },
  });
};

export const usePipeClassOptions = () => {
    const { data } = usePipeClassData();
    return data?.map((item) => ({ value: item.id, label: item.name }));
};
