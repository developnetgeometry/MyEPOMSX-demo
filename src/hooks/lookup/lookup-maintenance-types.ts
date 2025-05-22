import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useMaintenanceTypePmData = () => {
    return useQuery({
        queryKey: ["e-maintenance-type-pm-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_maintenance")
                .select("id, code, name")
                .order("id")
                .eq("maintenance_type_id", 1);

            if (error) {
                console.error("Error fetching e_maintenance PM data:", error);
                throw error;
            }

            return data;
        },
    });
};

export const useMaintenanceTypeCmData = () => {
    return useQuery({
        queryKey: ["e-maintenance-type-cm-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_maintenance")
                .select("id, code, name")
                .order("id")
                .eq("maintenance_type_id", 2);

            if (error) {
                console.error("Error fetching e_maintenance CM data:", error);
                throw error;
            }

            return data;
        },
    });
};