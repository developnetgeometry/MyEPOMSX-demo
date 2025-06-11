import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useFrequencyData = () => {
  return useQuery({
    queryKey: ["e-frequency-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_frequency")
        .select("id, frequency_type_id (id, name), frequency_code, name")
        .order("id");

      if (error) {
        console.error("Error fetching e_frequency data:", error);
        throw error;
      }

      return data;
    },
  });
};