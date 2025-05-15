import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useClientData = () => {
    return useQuery({
        queryKey: ["e-client-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_client")
                .select("id, code, type, name, onboard_date, office_no, email")
                .order("id", { ascending: false });

            if (error) {
                console.error("Error fetching e_client data:", error);
                throw error;
            }

            return data;
        },
    });
};

export const insertClientData = async (clientData: {
    code: string;
    type?: string;
    name?: string;
    onboard_date?: string; // Use ISO string format for timestamps
    office_no?: string;
    email?: string;
}) => {
    try {
        const { data, error } = await supabase
            .from("e_client")
            .insert([clientData]);

        if (error) {
            console.error("Error inserting e_client data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error inserting e_client data:", err);
        throw err;
    }
};

export const updateClientData = async (id: number, updatedData: Partial<{
    code: string;
    type?: string;
    name?: string;
    onboard_date?: string; // Use ISO string format for timestamps
    office_no?: string;
    email?: string;
}>) => {
    try {
        const { data, error } = await supabase
            .from("e_client")
            .update(updatedData)
            .eq("id", id);

        if (error) {
            console.error("Error updating e_client data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating e_client data:", err);
        throw err;
    }
};

export const deleteClientData = async (id: number) => {
    try {
        const { data, error } = await supabase
            .from("e_client")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting e_client data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error deleting e_client data:", err);
        throw err;
    }
};