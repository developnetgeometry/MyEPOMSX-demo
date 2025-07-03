import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useFluidRepresentativeData = () => {
  return useQuery({
    queryKey: ["fluidRepresentative"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_fluid_representive")
        .select("id, name")
        .order("id");

      if (error) {
        console.error("Error fetching e_fluid_representative data:", error);
        throw error;
      }

      return data;
    },
  });
};

export const useFluidRepresentativeOptions = () => {
  const { data } = useFluidRepresentativeData();
  return data?.map((item) => ({ value: item.id, label: item.name }));
};
