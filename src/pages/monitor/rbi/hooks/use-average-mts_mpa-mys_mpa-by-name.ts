import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useAverageMtsMpaMysMpaByName = (specCode: string) =>
  useQuery({
    queryKey: ["e-material-construction-average", specCode],
    enabled: !!specCode,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_material_construction")
        .select("mts_mpa, mys_mpa, composition")
        .eq("name", specCode);

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("No rows");

      const avg = (arr: number[]) =>
        arr.reduce((s, v) => s + v, 0) / arr.length;

      return {
        avg_mts_mpa: avg(data.map(d => Number(d.mts_mpa))),
        avg_mys_mpa: avg(data.map(d => Number(d.mys_mpa))),
        composition: data[0]?.composition || "", // Return the composition from the first row
      };
    },
  });
