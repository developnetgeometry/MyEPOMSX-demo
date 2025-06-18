import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export interface RMSUptimeRecord {
    id: number;
    date: string;
    uptime: number;
    unplanned_shutdown: number;
    planned_shutdown: number;
    asset_detail_id: number;
    asset_code?: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
}

// Query keys
export const rmsDashboardKeys = {
    all: ['rmsDashboard'] as const,
    uptimeData: (startDate?: Date, endDate?: Date) =>
        [...rmsDashboardKeys.all, 'uptimeData', { startDate, endDate }] as const,
} as const;

// Fetch RMS uptime data for dashboard within date range
const fetchRMSUptimeData = async (startDate?: Date, endDate?: Date): Promise<RMSUptimeRecord[]> => {
    let query = supabase
        .from('r_rms_uptime')
        .select(`
            id,
            date,
            uptime,
            unplanned_shutdown,
            planned_shutdown,
            asset_detail_id,
            asset_code,
            created_at,
            created_by,
            updated_at,
            updated_by
        `)
        .not('asset_detail_id', 'is', null)
        .order('date', { ascending: false });

    if (startDate) {
        // query = query.gte('date', startDate.toISOString().split('T')[0]);
        const startDateStr = startDate.getFullYear() + '-' +
            String(startDate.getMonth() +1).padStart(2, '0') + '-' +
            String(startDate.getDate()).padStart(2, '0');

        query = query.gte('date', startDateStr);
    }

    if (endDate) {
        // query = query.lte('date', endDate.toISOString().split('T')[0]);
        const endDateStr = endDate.getFullYear() + '-' + 
            String(endDate.getMonth() + 1).padStart(2, '0') + '-' + 
            String(endDate.getDate()).padStart(2, '0');
            
        query = query.lte('date', endDateStr);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
};

export const useRMSUptimeData = (startDate?: Date, endDate?: Date) => {
    return useQuery({
        queryKey: rmsDashboardKeys.uptimeData(startDate, endDate),
        queryFn: () => fetchRMSUptimeData(startDate, endDate),
        enabled: true, // Always enabled, will fetch all data if no dates provided
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
};