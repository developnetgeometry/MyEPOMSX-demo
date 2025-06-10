import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useProfilesById = (userId: string) => {
  return useQuery({
    queryKey: ["e-profiles-data", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", userId);

      if (error) {
        console.error("Error fetching profiles data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });
};