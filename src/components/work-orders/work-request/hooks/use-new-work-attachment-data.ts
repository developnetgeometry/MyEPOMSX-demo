import { BUCKET_NAME_ATTACHMENT, supabase, SUPABASE_BUCKET_URL } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const ATTACHMENT_TYPE = "new-work-attachment";

export const useNewWorkAttachmentData = (workRequestId: number) => {
  return useQuery({
    queryKey: ["e-new-work-attachment", workRequestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_new_work_attachment")
        .select(`id, file_path, description, work_request_id`)
        .eq("work_request_id", workRequestId)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching e_new_work_attachment data:", error);
        throw error;
      }

      // Prepend the public URL to the file_path
      return data.map((attachment: any) => ({
        ...attachment,
        file_path: `${SUPABASE_BUCKET_URL}${attachment.file_path}`,
      }));
    },
    enabled: !!workRequestId, // Only fetch if workRequestId is provided
  });
};

export const insertNewWorkAttachmentData = async (attachmentData: {
  work_request_id: number;
  file: File;
  description?: string;
}) => {
  try {
    const { work_request_id, file, description } = attachmentData;

    // Generate file path for storage and database
    const fileName = `${work_request_id}_${Date.now()}_${file.name}`;
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
      .from("e_new_work_attachment")
      .insert([{ work_request_id, file_path: dbFilePath, description }]);

    if (error) {
      console.error("Error inserting e_new_work_attachment data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_new_work_attachment data:", err);
    throw err;
  }
};

export const updateNewWorkAttachmentData = async (
  id: number,
  updatedData: {
    description?: string;
  }
) => {
  try {
    const { description } = updatedData;

    // Update only the description in the database
    const { data, error } = await supabase
      .from("e_new_work_attachment")
      .update({ description })
      .eq("id", id);

    if (error) {
      console.error("Error updating e_new_work_attachment data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_new_work_attachment data:", err);
    throw err;
  }
};
export const deleteNewWorkAttachmentData = async (id: number) => {
  try {
    // Fetch the existing record to get the file path
    const { data: existingData, error: fetchError } = await supabase
      .from("e_new_work_attachment")
      .select("file_path")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching existing attachment data:", fetchError);
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
      .from("e_new_work_attachment")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_new_work_attachment data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_new_work_attachment data:", err);
    throw err;
  }
};