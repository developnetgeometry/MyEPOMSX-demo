import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";


export const useOnlineMonitorData = () => {
    return useQuery({
        queryKey: ['online-monitoring'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('e_online_monitor')
                .select('id, name')
                .order('id');

            if (error) {
                console.error('Error fetching e_online_monitoring data:', error);
                throw error;
            }

            return data;
        },
    })
}

export const useOnlineMonitorOptions = () => {
    const { data } = useOnlineMonitorData();
    return data?.map((item) => ({ value: item.id, label: item.name }));
};