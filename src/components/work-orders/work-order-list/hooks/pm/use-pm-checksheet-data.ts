import { BUCKET_NAME_ATTACHMENT, supabase, SUPABASE_BUCKET_URL } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const ATTACHMENT_TYPE = "pm-checksheet";

export const usePmChecksheetData = (pmWoId: number) => {
  return useQuery({
    queryKey: ["e-pm-checksheet", pmWoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_checksheet")
        .select(`id, file_path, description, pm_wo_id`)
        .eq("pm_wo_id", pmWoId)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching e_pm_checksheet data:", error);
        throw error;
      }

      // Prepend the public URL to the file_path
      return data.map((checksheet: any) => ({
        ...checksheet,
        file_path: `${SUPABASE_BUCKET_URL}${checksheet.file_path}`,
      }));
    },
    enabled: !!pmWoId, // Only fetch if pmWoId is provided
  });
};

export const insertPmChecksheetData = async (checksheetData: {
  pm_wo_id: number;
  file: File;
  description?: string;
}) => {
  try {
    const { pm_wo_id, file, description } = checksheetData;

    // Generate file path for storage and database
    const fileName = `${pm_wo_id}_${Date.now()}_${file.name}`;
    const storagePath = `${ATTACHMENT_TYPE}/${fileName}`;
    const dbFilePath = `/${BUCKET_NAME_ATTACHMENT}/${storagePath}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME_ATTACHMENT)
      .upload(storagePath, file);

    if (uploadError) {
      console.error("Error uploading file to storage:", uploadError);
      throw uploadError;
    }

    // Insert record into the database
    const { data, error } = await supabase
      .from("e_pm_checksheet")
      .insert([{ pm_wo_id, file_path: dbFilePath, description }]);

    if (error) {
      console.error("Error inserting e_pm_checksheet data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_checksheet data:", err);
    throw err;
  }
};

export const updatePmChecksheetData = async (
  id: number,
  updatedData: {
    description?: string;
  }
) => {
  try {
    const { description } = updatedData;

    // Update only the description in the database
    const { data, error } = await supabase
      .from("e_pm_checksheet")
      .update({ description })
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_checksheet data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_checksheet data:", err);
    throw err;
  }
};

export const deletePmChecksheetData = async (id: number) => {
  try {
    // Fetch the existing record to get the file path
    const { data: existingData, error: fetchError } = await supabase
      .from("e_pm_checksheet")
      .select("file_path")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching existing checksheet data:", fetchError);
      throw fetchError;
    }

    // Delete the file from storage
    if (existingData?.file_path) {
      const storagePath = existingData.file_path.replace(`/${BUCKET_NAME_ATTACHMENT}/`, "");
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME_ATTACHMENT)
        .remove([storagePath]);

      if (deleteError) {
        console.error("Error deleting file from storage:", deleteError);
        throw deleteError;
      }
    }

    // Delete the record from the database
    const { data, error } = await supabase
      .from("e_pm_checksheet")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_checksheet data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_checksheet data:", err);
    throw err;
  }
};