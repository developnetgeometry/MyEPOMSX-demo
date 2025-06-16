import { supabase } from "@/lib/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface RMSUptimeData {
    id?: number;
    date: string;
    uptime: number;
    unplanned_shutdown: number;
    planned_shutdown: number;
    asset_detail_id: number;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    description?: string;
}

export interface UptimeEntry {
    id: string;
    date: Date | string;
    uptime: number;
    unplanned_shutdown: number;
    planned_shutdown: number;
    asset_detail_id: number;
    description?: string;
}

// Query keys
export const uptimeKeys = {
    all: ['uptime'] as const,
    lists: () => [...uptimeKeys.all, 'list'] as const,
    list: (assetDetailId: number) => [...uptimeKeys.lists(), { assetDetailId } as const],
} as const;

// Fetch RMS Uptime Data
const fetchUptimeData = async (assetDetailId: number): Promise<RMSUptimeData[]> => {
    const { data, error } = await supabase
        .from('r_rms_uptime')
        .select('*')
        .eq('asset_detail_id', assetDetailId)
        .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
}

export const useRMSUptime = (assetDetailId: number) => {
    const queryClient = useQueryClient();

    // Query for fetching uptime data
    const uptimeQuery = useQuery({
        queryKey: uptimeKeys.list(assetDetailId),
        queryFn: () => fetchUptimeData(assetDetailId),
        enabled: !!assetDetailId && assetDetailId > 0,
    })

    // Mutation for inserting single record
    const insertMutation = useMutation({
        mutationFn: async (record: Omit<RMSUptimeData, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('r_rms_uptime')
                .insert([{
                    ...record,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            // Invalidate and refetch the uptime data
            queryClient.invalidateQueries({ queryKey: uptimeKeys.list(assetDetailId) });
        },
    });

    // Mutation for bulk insert
    const bulkInsertMutation = useMutation({
        mutationFn: async (records: Omit<RMSUptimeData, 'id' | 'created_at' | 'updated_at'>[]) => {
            const recordsWithTimestamps = records.map(record => ({
                ...record,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));

            const { data, error } = await supabase
                .from('r_rms_uptime')
                .insert(recordsWithTimestamps)
                .select();

                if (error) throw error;
                return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: uptimeKeys.list(assetDetailId) });
        },
    });

    // Mutation for updating record
    const updateMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: number, updates: Partial<RMSUptimeData> }) => {
            const { data, error } = await supabase
                .from('r_rms_uptime')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: uptimeKeys.list(assetDetailId) });
        },
    });

    // Mutation for deleting record
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase
                .from('r_rms_uptime')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: uptimeKeys.list(assetDetailId) });
        },
    });

    // Save uptime entries (handles both insert and update)
    const saveEntriesMutation = useMutation({
        mutationFn: async (entries: UptimeEntry[]) => {
            // First, delete all existing entries for this asset_detail_id
            const { error: deleteError } = await supabase
                .from('r_rms_uptime')
                .delete()
                .eq('asset_detail_id', assetDetailId);

            if (deleteError) throw deleteError;

            // Convert UptimeEntry format to RMSUptimeData format
            const records: Omit<RMSUptimeData, 'id' | 'created_at' | 'updated_at'>[] = entries.map(entry => ({
                // date: entry.date instanceof Date ? entry.date.toISOString().split('T')[0] : entry.date,
                date: entry.date instanceof Date ? entry.date.toLocaleDateString('en-CA') : entry.date,
                uptime: entry.uptime,
                unplanned_shutdown: entry.unplanned_shutdown,
                planned_shutdown: entry.planned_shutdown,
                asset_detail_id: entry.asset_detail_id,
                description: entry.description
            }));

            // Insert all records
            if (records.length > 0) {
                const { error } = await supabase
                    .from('r_rms_uptime')
                    .insert(records.map(record => ({
                        ...record,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })));

                if (error) throw error;
            }

            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: uptimeKeys.list(assetDetailId) });
        }
    });

    // const saveEntriesMutation = useMutation({
    //     mutationFn: async (entries: UptimeEntry[]) => {
    //         // Convert UptimeEntry format to RMSUptimeData format
    //         const records: Omit<RMSUptimeData, 'id' | 'created_at' | 'updated_at'>[] = entries.map(entry => ({
    //             date: entry.date instanceof Date ? entry.date.toISOString().split('T')[0] : entry.date,
    //             uptime: entry.uptime,
    //             unplanned_shutdown: entry.unplanned_shutdown,
    //             planned_shutdown: entry.planned_shutdown,
    //             asset_detail_id: entry.asset_detail_id,
    //             description: entry.description
    //         }));

    //         // Check if entries already exist for the same dates
    //         const existingEntries = await supabase
    //             .from('r_rms_uptime')
    //             .select('id, date')
    //             .eq('asset_detail_id', assetDetailId)
    //             .in('date', records.map(r => r.date));

    //         if (existingEntries.data && existingEntries.data.length > 0) {
    //             // Handle updates and inserts separately
    //             const existingDates = existingEntries.data.map(e => e.date);
    //             const recordsToUpdate = records.filter(r => existingDates.includes(r.date));
    //             const recordsToInsert = records.filter(r => !existingDates.includes(r.date));

    //             // Update existing records
    //             for (const record of recordsToUpdate) {
    //                 const existingEntry = existingEntries.data.find(e => e.date === record.date);

    //                 if (existingEntry) {
    //                     await supabase
    //                         .from('r_rms_uptime')
    //                         .update({
    //                             ...record,
    //                             updated_at: new Date().toISOString()
    //                         })
    //                         .eq('id', existingEntry.id);
    //                 }
    //             }

    //             // Insert new records
    //             if (recordsToInsert.length > 0) {
    //                 const { error } = await supabase
    //                     .from('r_rms_uptime')
    //                     .insert(recordsToInsert.map(record => ({
    //                         ...record,
    //                         created_at: new Date().toISOString(),
    //                         updated_at: new Date().toISOString()
    //                     })));

    //                 if (error) throw error;
    //             }

    //         } else {
    //             // Insert all records
    //             const { error } = await supabase
    //                 .from('r_rms_uptime')
    //                 .insert(records.map(record => ({
    //                     ...record,
    //                     created_at: new Date().toISOString(),
    //                     updated_at: new Date().toISOString()
    //                 })));

    //                 if (error) throw error;
    //         }

    //         return true;

    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: uptimeKeys.list(assetDetailId) });
    //     }
    // });

    return {
        // Query data
        uptimeData: uptimeQuery.data || [],
        loading: uptimeQuery.isLoading,
        error: uptimeQuery.error?.message || null,
        isRefetching: uptimeQuery.isRefetching,

        // Mutations
        insertUptimeRecord: insertMutation.mutateAsync,
        bulkInsertUptimeRecords: bulkInsertMutation.mutateAsync,
        updateUptimeRecord: updateMutation.mutateAsync,
        deleteUptimeRecord: deleteMutation.mutateAsync,
        saveUptimeEntries: saveEntriesMutation.mutateAsync,

        // Mutation states
        isInserting: insertMutation.isPending,
        isBulkInserting: bulkInsertMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isSaving: saveEntriesMutation.isPending,

        // Manual refetch
        refetch: uptimeQuery.refetch,
    };
}