import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface AssetData {
    id: number;
    asset_no: string;
    asset_name: string;
    asset_detail_id: number;
    facility_id: number;
    system_id: number;
    package_id: number;
    asset_tag_id: number;
    status_id: number;
    asset_group_id: number;
    commission_date: string;
    asset_sce_id: number;
    created_at: string;
    updated_at: string;

    // Joined data from related tables
    facility?: { 
        id: number;
        location_code: string;
        location_name: string;
    };
    system?: { system_name: string };
    package?: { package_name: string };
    asset_tag?: { name: string };
    status?: { name: string };
    asset_detail?: {
        id: number;
        model: string;
        serial_number: string;
        specification: string;
        criticality_id: number;
        manufacturer?: { name: string };
        category?: { name: string };
        type?: { name: string };
        criticality?: { name: string };
    };
    asset_sce?: {
        sce_code: string;
        group_name: string;
    };
}

// Query keys
export const assetKeys = {
    all: ['assets'] as const,
    lists: () => [...assetKeys.all, 'lists'] as const,
    list: (filters: Record<string, any>) => [...assetKeys.lists(), { filters }] as const,
    details: () => [...assetKeys.all, 'detail'] as const,
    detail: (id: number) => [...assetKeys.details(), id] as const
} as const;

// Fetch functions
const fetchAssets = async (): Promise<AssetData[]> => {
    const { data, error } = await supabase
        .from('e_asset')
        .select(`
            *,
            facility:e_facility(
                id,
                location_code,
                location_name
            ),
            system:e_system(system_name),
            package:e_package(package_name),
            asset_tag:e_asset_tag(name),
            status:e_asset_status(name),
            asset_detail:e_asset_detail!inner(
                *,
                manufacturer:e_manufacturer(name),
                category:e_asset_category(name),
                type:e_asset_type(name),
                criticality:e_criticality(name)
            ),
            asset_sce:e_asset_sce(
                sce_code,
                group_name
            )
        `)
        .eq('asset_detail.is_reliability', true)
        .order('asset_no');

    if (error) throw error;
    return data || [];
};

const fetchAssetById = async (id: number): Promise<AssetData> => {
    const { data, error } = await supabase
        .from('e_asset')
        .select(`
            *,
            facility:e_facility(
                id,
                location_code,
                location_name
            ),
            system:e_system(system_name),
            package:e_package(package_name),
            asset_tag:e_asset_tag(name),
            status:e_asset_status(name),
            asset_detail:e_asset_detail(
                *,
                manufacturer:e_manufacturer(name),
                category:e_asset_category(name),
                type:e_asset_type(name),
                criticality:e_criticality(name)
            ),
            asset_sce:e_asset_sce(
                sce_code,
                group_name
            )
        `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}


export const useAssets = () => {
    return useQuery({
        queryKey: assetKeys.lists(),
        queryFn: fetchAssets,
    });
};

export const useAsset = (id: number) => {
    return useQuery({
        queryKey: assetKeys.detail(id),
        queryFn: () => fetchAssetById(id),
        enabled: !!id // Only run query if id exists
    })
};

// Mutations for create asset
export const useCreateAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newAsset: Partial<AssetData>) => {
            const { data, error } = await supabase
                .from('e_asset')
                .insert([newAsset])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            // Invalidate and refetch assets list
            queryClient.invalidateQueries({ queryKey: assetKeys.lists() });
        }
    });
};

// Mutations for update asset
export const useUpdateAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: number; updates: Partial<AssetData> }) => {
            const { data, error } = await supabase
                .from('e_asset')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            // Update the specific asset in cache
            queryClient.setQueryData(assetKeys.detail(data.id), data);
            // Invalidate the list to reflect changes
            queryClient.invalidateQueries({ queryKey: assetKeys.lists() });
        }
    });
};

// Mutations for delete asset
export const useDeleteAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase
                .from('e_asset')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        },
        onSuccess: (deleteId) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: assetKeys.detail(deleteId) });
            // Invalidate list
            queryClient.invalidateQueries({ queryKey: assetKeys.lists() });
        },
    });
};