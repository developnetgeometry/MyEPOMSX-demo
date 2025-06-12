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
                    maintenance_type (id, code, name), requested_by (id, email, full_name), 
                    priority_id (id, name), 
                    finding_detail, anomaly_report, quick_incident_report,
                    work_request_no, is_work_order_created`
                )
                .order("id", { ascending: false });

            if (error) {
                console.error("Error fetching e_new_work_request data:", error);
                throw error;
            }

            return data;
        },
    });
};
export const useWorkRequestDataById = (id: number) => {
    return useQuery({
        queryKey: ["e-new-work-request-data-id", id],
        queryFn: async () => {
            try {
                // Fetch data from e_new_work_request
                const { data: workRequestData, error: workRequestError } = await supabase
                    .from("e_new_work_request")
                    .select(
                        `id, cm_status_id (id, name), 
            description, work_request_date, target_due_date, 
            facility_id (id, location_code, location_name), system_id (id, system_name), 
            package_id (id, package_no, package_tag, package_name), 
            asset_id (id, asset_name), cm_sce_code (id, cm_group_name, cm_sce_code ), 
            work_center_id (id, code, name), date_finding, 
            maintenance_type (id, code, name), requested_by (id, email, full_name), 
            priority_id (id, name), 
            finding_detail, anomaly_report, quick_incident_report,
            work_request_no, is_work_order_created`
                    )
                    .eq("id", id)
                    .single();

                if (workRequestError) {
                    console.error("Error fetching e_new_work_request data by ID:", workRequestError);
                    throw workRequestError;
                }

                // Only fetch data from e_cm_general if cm_status_id === 3
                let cmGeneralData = null;
                if (workRequestData.cm_status_id?.id === 3) {
                    const { data, error } = await supabase
                        .from("e_cm_general")
                        .select(`id`)
                        .eq("work_request_id", id)
                        .single();

                    if (error && error.code !== "PGRST116") {
                        // Ignore "No rows found" error (code PGRST116)
                        console.error("Error fetching e_cm_general data:", error);
                        throw error;
                    }

                    cmGeneralData = data;
                }

                // Combine data
                return {
                    ...workRequestData,
                    cm_work_order_id: cmGeneralData?.id ?? null, // Add cm_work_order_id if available
                };
            } catch (error) {
                console.error("Error combining data:", error);
                throw error;
            }
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
    priority_id?: number;
    finding_detail?: string;
    anomaly_report?: boolean;
    quick_incident_report?: boolean;
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
        priority_id?: number;
        finding_detail?: string;
        anomaly_report?: boolean;
        quick_incident_report?: boolean;
        is_work_order_created?: boolean;
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

export const insertCmGeneral = async (cmGeneralData: {
    priority_id?: number;
    work_center_id?: number;
    facility_id?: number;
    system_id?: number;
    package_id?: number;
    asset_id?: number;
    completed_by?: string;
    closed_by?: string;
    date_finding?: string;
    target_start_date?: string;
    target_end_date?: string;
    asset_available_time?: string;
    requested_by?: string;
    approved_by?: string;
    cm_sce_code?: number;
    due_date?: string;
    downtime?: number;
    work_request_id: number;
}) => {
    try {
        const { data, error } = await supabase
            .from("e_cm_general")
            .insert([cmGeneralData]);

        if (error) {
            console.error("Error inserting e_cm_general data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error inserting e_cm_general data:", err);
        throw err;
    }
};