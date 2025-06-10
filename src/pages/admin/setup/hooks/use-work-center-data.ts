import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useWorkCenterData = () => {
    return useQuery({
        queryKey: ["e-work-center-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_work_center")
                .select("id, code, name, type, effective_date, remark, is_active")
                .order("id", { ascending: false });

            if (error) {
                console.error("Error fetching e_work_center data:", error);
                throw error;
            }

            return data;
        },
    });
};

export const useWorkCenterActiveData = () => {
    return useQuery({
        queryKey: ["e-work-center-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_work_center")
                .select("id, code, name, type, effective_date, remark, is_active")
                .eq("is_active", true)
                .order("id");

            if (error) {
                console.error("Error fetching e_work_center data:", error);
                throw error;
            }

            return data;
        },
    });
};

export const insertWorkCenterData = async (workCenterData: {
    code: string;
    name?: string;
    type?: string;
    effective_date?: string; // Use ISO string format for dates
    remark?: string;
    is_active?: boolean;
}) => {
    try {
        const { data, error } = await supabase
            .from("e_work_center")
            .insert([workCenterData]);

        if (error) {
            console.error("Error inserting e_work_center data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error inserting e_work_center data:", err);
        throw err;
    }
};

export const updateWorkCenterData = async (id: number, updatedData: Partial<{
    code: string;
    name?: string;
    type?: string;
    effective_date?: string; // Use ISO string format for dates
    remark?: string;
    is_active?: boolean;
}>) => {
    try {
        const { data, error } = await supabase
            .from("e_work_center")
            .update(updatedData)
            .eq("id", id);

        if (error) {
            console.error("Error updating e_work_center data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating e_work_center data:", err);
        throw err;
    }
};

export const deleteWorkCenterData = async (id: number) => {
    try {
        const { data, error } = await supabase
            .from("e_work_center")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting e_work_center data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error deleting e_work_center data:", err);
        throw err;
    }
};