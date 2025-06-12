import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

// Material Construction options from e_material_construction
export interface MaterialConstructionOption {
  value: string;
  label: string;
  id: number;
  composition?: string;
  material_construction_type?: number;
}

export const useMaterialConstructionOptions = () => {
  return useQuery<MaterialConstructionOption[]>({
    queryKey: ["material-construction-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_material_construction")
        .select("id, name, composition, material_construction_type")
        .order("name", { ascending: true });
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
          composition: row.composition,
          material_construction_type: row.material_construction_type,
        })) || []
      );
    },
  });
};

// External Environment options from e_ext_env
export interface ExternalEnvironmentOption {
  value: string;
  label: string;
  id: number;
}

export const useExternalEnvironmentOptions = () => {
  return useQuery<ExternalEnvironmentOption[]>({
    queryKey: ["external-environment-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_ext_env")
        .select("id, name")
        .order("name", { ascending: true });
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
        })) || []
      );
    },
  });
};
