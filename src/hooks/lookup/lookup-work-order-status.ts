import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useWorkOrderStatusData = () => {
    return useQuery({
        queryKey: ["e-work-order-status-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_work_order_status")
                .select("id, name")
                .order("id");

            if (error) {
                console.error("Error fetching e_work_order_status data:", error);
                throw error;
            }

            return data;
        },
    });
};