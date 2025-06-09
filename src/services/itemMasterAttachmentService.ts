// services/itemImageService.ts
import { supabase } from "@/lib/supabaseClient";

// Maximum file size in bytes (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Allowed image file types
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

interface ItemAttachment {
  id: number;
  item_master_id: number;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
  created_by: string;
}

/**
 * Validates an image file for size and type
 * @param file File to validate
 * @returns Error message or null if valid
 */
export const validateImageFile = (file: File): string | null => {
  if (!file) return "No file provided";
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds the maximum allowed (${
      MAX_FILE_SIZE / 1024 / 1024
    }MB)`;
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return "File type not supported. Please upload a valid image file.";
  }
  return null;
};

/**
 * Uploads a single item image to the storage bucket and saves to item_attachment
 * @param itemId The ID of the item
 * @param file The image file to upload
 * @param userId The ID of the user uploading the file
 * @param index Optional index for multiple files
 * @returns The attachment record data or null if failed
 */
export const uploadItemImage = async (
  itemId: number,
  file: File,
  userId: string,
  index = 0
): Promise<ItemAttachment | null> => {
  try {
    // Validate the file
    const validationError = validateImageFile(file);
    if (validationError) {
      console.error(validationError);
      throw new Error(validationError);
    }

    const fileExt = file.name.split(".").pop();
    const originalFileName = file.name;
    const fileName = `${Date.now()}_${index}.${fileExt}`;
    const filePath = `${itemId}/${fileName}`;
    const storageBucket = "item-master-attachment";

    // 1. Upload file to storage bucket
    const { error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 2. Get public URL for the image
    const { data: urlData } = supabase.storage
      .from(storageBucket)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL for uploaded file");
    }

    // 3. Save file information to item_attachment table
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("e_item_master_attachment")
      .insert({
        item_master_id: itemId,
        file_path: urlData.publicUrl,
        file_name: originalFileName,
        file_type: file.type,
        file_size: file.size,
        created_at: new Date().toISOString(),
        created_by: userId,
      })
      .select("*")
      .single();

    if (attachmentError) throw attachmentError;
    return attachmentData;
  } catch (error) {
    console.error(`Error uploading file ${file.name}:`, error);
    return null;
  }
};

/**
 * Uploads multiple item images and returns attachment records
 * @param itemId The ID of the item
 * @param files Array of image files to upload
 * @param userId The ID of the user uploading the files
 * @returns Array of successful attachment records
 */
export const uploadMultipleItemImages = async (
  itemId: number,
  files: File[],
  userId: string
): Promise<ItemAttachment[]> => {
  // Validate all files first
  const validationResults = files.map(validateImageFile);
  const validFiles: File[] = [];
  const invalidFiles: string[] = [];

  files.forEach((file, index) => {
    if (validationResults[index]) {
      invalidFiles.push(`${file.name}: ${validationResults[index]}`);
    } else {
      validFiles.push(file);
    }
  });

  // Log invalid files but continue with valid ones
  if (invalidFiles.length > 0) {
    console.error("Invalid files skipped:", invalidFiles);
  }

  // Process valid files in parallel
  const uploadPromises = validFiles.map((file, index) =>
    uploadItemImage(itemId, file, userId, index)
  );

  const results = await Promise.all(uploadPromises);
  
  // Return only successful uploads with attachment records
  return results.filter(
    (result): result is ItemAttachment => result !== null
  );
};