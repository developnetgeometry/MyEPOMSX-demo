import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query"

export const mitigationSystemData = () => {
  return useQuery({
    queryKey: ['mitigation-system'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_mitigation_system")
        .select("id, name")
        .order("name");

      if (error) {
        throw new Error(`Error fetching mitigation systems: ${error.message}`);
      }

      return data;
    } 
  })
}

export const useMitigationSystemOptions = () => {
  const { data } = mitigationSystemData();
  return data?.map((item) => ({ value: item.id, label: item.name }));
};