import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useSensorData = () => {
    return useQuery({
        queryKey: ["e-iot-sensor-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_iot_sensor")
                .select(
                    `id, name, 
                    sensor_type_id ( id, name ), 
                    description, manufacturer_id (id, name),
                    model, calibration_date,
                    client_id`
                )
                .order("id", { ascending: false });

            if (error) {
                console.error("Error fetching e_iot_sensor data:", error);
                throw error;
            }

            return data;
        },
    });
};

export const insertSensorData = async (sensorData: {
    name?: string;
    sensor_type_id?: number;
    description?: string;
    manufacturer_id?: number;
    model?: string;
    calibration_date?: string; // Use ISO string format for timestamps
    client_id?: number;
}) => {
    try {
        const { data, error } = await supabase
            .from("e_iot_sensor")
            .insert([sensorData]);

        if (error) {
            console.error("Error inserting e_iot_sensor data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error inserting e_iot_sensor data:", err);
        throw err;
    }
};

export const updateSensorData = async (
    id: number,
    updatedData: Partial<{
        name?: string;
        sensor_type_id?: number;
        description?: string;
        manufacturer_id?: number;
        model?: string;
        calibration_date?: string; // Use ISO string format for timestamps
        client_id?: number;
    }>
) => {
    try {
        const { data, error } = await supabase
            .from("e_iot_sensor")
            .update(updatedData)
            .eq("id", id);

        if (error) {
            console.error("Error updating e_iot_sensor data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating e_iot_sensor data:", err);
        throw err;
    }
};

export const deleteSensorData = async (id: number) => {
    try {
        const { data, error } = await supabase
            .from("e_iot_sensor")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting e_iot_sensor data:", error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error deleting e_iot_sensor data:", err);
        throw err;
    }
};