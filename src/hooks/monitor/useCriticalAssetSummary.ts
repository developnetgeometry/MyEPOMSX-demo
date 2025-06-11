import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export interface AssetWithUptime {
    id: number;
    assetId: string;
    assetName: string;
    asset_detail_id: number;
}

export interface UptimeDataForSummary {
    id: string;
    date: string;
    upTime: number;
    sumRunningHour: number;
    standby: number;
    unplannedShutdown: number;
    plannedShutdown: number;
    description: string;
}

// Query keys
export const criticalAssetSummaryKeys = {
    all: ['criticalAssetSummary'] as const,
    assetsWithUptime: () => [...criticalAssetSummaryKeys.all, 'assetsWithUptime'] as const,
    uptimeData: (assetDetailId: number, startDate?: Date, endDate?: Date) =>
    [...criticalAssetSummaryKeys.all, 'uptimeData', { assetDetailId, startDate, endDate }] as const,
} as const;


// Fetch assets that have uptime data
const fetchAssetsWithUptimeData = async (): Promise<AssetWithUptime[]> => {
    // First, get distinct asset_detail_ids from uptime table
    const { data: uptimeAssetIds, error: uptimeError } = await supabase
        .from('r_rms_uptime')
        .select('asset_detail_id')
        .not('asset_detail_id', 'is', null);

    if (uptimeError) throw uptimeError;

    // Extract unique asset_detail_ids
    const uniqueAssetDetailIds = [...new Set(uptimeAssetIds.map(item => item.asset_detail_id))];

    if (uniqueAssetDetailIds.length === 0) {
        return [];
    }

    // Fetch assets that have these asset_detail_ids
    const { data, error } = await supabase
        .from('e_asset')
        .select(`
            id,
            asset_no,
            asset_name,
            asset_detail_id
        `)
        .in('asset_detail_id', uniqueAssetDetailIds)
        .not('asset_detail_id', 'is', null)
        .order('asset_no');

    if (error) throw error;

    return (data || []).map(asset => ({
        id: asset.id,
        assetId: asset.asset_no,
        assetName: asset.asset_name,
        asset_detail_id: asset.asset_detail_id
    }));
}

// Fetch uptime data for specific asset withing date range
const fetchUptimeDataForAsset = async (assetDetailId: number, startDate?: Date, endDate?: Date): Promise<UptimeDataForSummary[]> => {
    let query = supabase
        .from('r_rms_uptime')
        .select('*')
        .eq('asset_detail_id', assetDetailId)
        .order('date', { ascending: false });

    if (startDate) {
        query = query.gte('date', startDate.toISOString().split('T')[0]);
    }

    if (endDate) {
        query = query.lte('date', endDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(uptime => ({
        id: uptime.id?.toString() || '',
        date: uptime.date,
        upTime: uptime.uptime,
        sumRunningHour: uptime.uptime,
        standby: 0,
        unplannedShutdown: uptime.unplanned_shutdown,
        plannedShutdown: uptime.planned_shutdown,
        description: uptime.description || ''
    }));
}

export const useAssetsWithUptimeDate = () => {
    return useQuery({
        queryKey: criticalAssetSummaryKeys.assetsWithUptime(),
        queryFn: fetchAssetsWithUptimeData,
    });
};

export const useUptimeDataForAsset = (assetDetailId: number, startDate?: Date, endDate?: Date) => {
    return useQuery({
        queryKey: criticalAssetSummaryKeys.uptimeData(assetDetailId, startDate, endDate),
        queryFn: () => fetchUptimeDataForAsset(assetDetailId, startDate, endDate),
        enabled: !!assetDetailId && assetDetailId > 0,
    });
};