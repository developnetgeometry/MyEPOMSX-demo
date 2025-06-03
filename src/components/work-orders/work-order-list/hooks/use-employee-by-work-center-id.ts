import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useEmployeeByWorkCenterId = (workCenterId: number) => {
  return useQuery({
    queryKey: ["e-employee-data", workCenterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_employee")
        .select("id, name, uid_employee")
        .eq("work_center_code", workCenterId);

      if (error) {
        console.error("Error fetching e_employee data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!workCenterId,
  });
};