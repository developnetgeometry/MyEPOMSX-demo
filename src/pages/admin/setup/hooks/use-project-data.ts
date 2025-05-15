import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useProjectData = () => {
    return useQuery({
        queryKey: ["e-project-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_project")
                .select(`
                    id,
                    project_code,
                    client_id,
                    project_type (id, name),
                    project_name,
                    short_name,
                    start_date,
                    end_date,
                    fund_code,
                    project_purpose,
                    remark
                `)
                .order("id", { ascending: false });

            if (error) {
                console.error("Error fetching e_project data:", error);
                throw error;
            }

            return data;
        },
    });
};

export const insertProjectData = async (projectData: {
    project_code: string;
    client_id?: number;
    project_type?: number;
    project_name?: string;
    short_name?: string;
    start_date?: string; // Use ISO string format for timestamps
    end_date?: string;   // Use ISO string format for timestamps
    fund_code?: string;
    project_purpose?: string;
    remark?: string;
}) => {
    try {
        const { data, error } = await supabase
            .from("e_project")
            .insert([projectData]);

        if (error) {
            console.error("Error inserting e_project data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error inserting e_project data:", err);
        throw err;
    }
};

export const updateProjectData = async (id: number, updatedData: Partial<{
    project_code: string;
    client_id?: number;
    project_type?: number;
    project_name?: string;
    short_name?: string;
    start_date?: string; // Use ISO string format for timestamps
    end_date?: string;   // Use ISO string format for timestamps
    fund_code?: string;
    project_purpose?: string;
    remark?: string;
}>) => {
    try {
        const { data, error } = await supabase
            .from("e_project")
            .update(updatedData)
            .eq("id", id);

        if (error) {
            console.error("Error updating e_project data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating e_project data:", err);
        throw err;
    }
};

export const deleteProjectData = async (id: number) => {
    try {
        const { data, error } = await supabase
            .from("e_project")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting e_project data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error deleting e_project data:", err);
        throw err;
    }
};