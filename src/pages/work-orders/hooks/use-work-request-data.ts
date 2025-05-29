import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useWorkRequestData = () => {
    return useQuery({
        queryKey: ["e-new-work-request-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_new_work_request")
                .select(
                    `id, cm_status_id (id, name), 
                    description, work_request_date, target_due_date, 
                    facility_id (id, location_code, location_name), system_id (id, system_name), 
                    package_id (id, package_no, package_tag, package_name), 
                    asset_id (id, asset_name), cm_sce_code (id, cm_group_name, cm_sce_code ), 
                    work_center_id (id, code, name), date_finding, 
                    maintenance_type (id, code, name), requested_by, 
                    criticality_id (id, name), 
                    finding_detail, anomaly_report, quick_incident_report,
                    work_request_no, work_request_prefix`
                )
                .order("id", { ascending: false });

            if (error) {
                console.error("Error fetching e_new_work_request data:", error);
                throw error;
            }

            // Add index to each row (starting from 1)
            const indexedData = data?.map((item, index) => ({
                index: index + 1, // 1-based index
                ...item,
            }));

            return indexedData;
        },
    });
};

export const useWorkRequestDataById = (id: number) => {
    return useQuery({
        queryKey: ["e-new-work-request-data", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_new_work_request")
                .select(
                    `id, cm_status_id (id, name), 
          description, work_request_date, target_due_date, 
          facility_id (id, location_code, location_name), system_id (id, system_name), 
          package_id (id, package_no, package_tag, package_name), 
          asset_id (id, asset_name), cm_sce_code (id, cm_group_name, cm_sce_code ), 
          work_center_id (id, code, name), date_finding, 
          maintenance_type (id, code, name), requested_by, 
          criticality_id (id, name), 
          finding_detail, anomaly_report, quick_incident_report,
          work_request_no, work_request_prefix`
                )
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching e_new_work_request data by ID:", error);
                throw error;
            }

            return data;
        },
        enabled: !!id, // Only fetch if ID is provided
    });
};


export const insertWorkRequestData = async (workRequestData: {
    cm_status_id?: number;
    description?: string;
    work_request_date?: string; // Use ISO string format for timestamps
    target_due_date?: string; // Use ISO string format for timestamps
    facility_id?: number;
    system_id?: number;
    package_id?: number;
    asset_id?: number;
    cm_sce_code?: number;
    work_center_id?: number;
    date_finding?: string; // Use ISO string format for timestamps
    maintenance_type?: number;
    requested_by?: string; // UUID
    criticality_id?: number;
    finding_detail?: string;
    anomaly_report?: boolean;
    quick_incident_report?: boolean;
    work_request_prefix?: string;
}) => {
    try {
        const { data, error } = await supabase
            .from("e_new_work_request")
            .insert([workRequestData]);

        if (error) {
            console.error("Error inserting e_new_work_request data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error inserting e_new_work_request data:", err);
        throw err;
    }
};

export const updateWorkRequestData = async (
    id: number,
    updatedData: Partial<{
        cm_status_id?: number;
        description?: string;
        work_request_date?: string; // Use ISO string format for timestamps
        target_due_date?: string; // Use ISO string format for timestamps
        facility_id?: number;
        system_id?: number;
        package_id?: number;
        asset_id?: number;
        cm_sce_code?: number;
        work_center_id?: number;
        date_finding?: string; // Use ISO string format for timestamps
        maintenance_type?: number;
        requested_by?: string; // UUID
        criticality_id?: number;
        finding_detail?: string;
        anomaly_report?: boolean;
        quick_incident_report?: boolean;
        work_request_prefix?: string;
    }>
) => {
    try {
        const { data, error } = await supabase
            .from("e_new_work_request")
            .update(updatedData)
            .eq("id", id);

        if (error) {
            console.error("Error updating e_new_work_request data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating e_new_work_request data:", err);
        throw err;
    }
};

export const deleteWorkRequestData = async (id: number) => {
    try {
        const { data, error } = await supabase
            .from("e_new_work_request")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting e_new_work_request data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error deleting e_new_work_request data:", err);
        throw err;
    }
};