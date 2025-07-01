import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useOnlineMonitorDfSccSohicData = () => {
    return useQuery({
        queryKey: ["e-online-monitor-df-scc-sohic-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_online_monitor_df_scc_sohic")
                .select("id, name, value")
                .order("id");

            if (error) {
                console.error("Error fetching e_online_monitor_df_scc_sohic data:", error);
                throw error;
            }

            return data;
        },
    });
};