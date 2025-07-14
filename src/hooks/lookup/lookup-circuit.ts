import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const circuitData = () => {
  return useQuery({
    queryKey: ["circuit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_circuit")
        .select("id, name")
        .order("name");

      if (error) {
        throw new Error(`Error fetching circuits: ${error.message}`);
      }

      return data;
    },
  });
};

export const useCircuitOptions = () => {
  const { data } = circuitData();
  return data?.map((item) => ({ value: item.id, label: item.name }));
};