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

interface AssetAttachment {
  id: number;
  asset_id: string | number;
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
 * Uploads a single asset image to the storage bucket and saves to e_asset_attachment
 * @param assetId The ID of the asset
 * @param file The image file to upload
 * @param userId The ID of the user uploading the file
 * @param index Optional index for multiple files
 * @returns The attachment record data
 */
export const uploadAssetImage = async (
  assetId: string | number,
  file: File,
  userId: string,
  index = 0
): Promise<AssetAttachment | null> => {
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
    const filePath = `${assetId}/${fileName}`;

    // 1. Upload file to storage bucket with public-read policy
    const { data, error } = await supabase.storage
      .from("asset-image")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // Allow overwriting files
      });

    if (error) {
      console.error("Error uploading image:", error);
      throw error;
    }

    // 2. Get public URL for the image
    const { data: urlData } = supabase.storage
      .from("asset-image")
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL for uploaded file");
    }

    // 3. Save file information to e_asset_attachment table
    const { data: attachmentData, error: attachmentError } = await supabase
      .from("e_asset_attachment")
      .insert({
        asset_id: assetId,
        file_path: urlData.publicUrl,
        file_name: originalFileName,
        file_type: file.type,
        file_size: file.size,
        created_at: new Date().toISOString(),
        created_by: userId,
      })
      .select("*")
      .single();

    if (attachmentError) {
      console.error("Error saving attachment record:", attachmentError);
      throw attachmentError;
    }

    return attachmentData;
  } catch (error) {
    console.error("Error in uploadAssetImage:", error);
    return null;
  }
};

/**
 * Uploads multiple asset images and returns attachment records
 * @param assetId The ID of the asset
 * @param files Array of image files to upload
 * @param userId The ID of the user uploading the files
 * @returns Array of attachment records
 */
export const uploadMultipleAssetImages = async (
  assetId: string | number,
  files: File[],
  userId: string
): Promise<AssetAttachment[]> => {
  try {
    // Validate all files before attempting to upload any
    const validationErrors = files.map(validateImageFile).filter(Boolean);
    if (validationErrors.length > 0) {
      throw new Error(`File validation errors: ${validationErrors.join(", ")}`);
    }

    const uploadPromises = files.map((file, index) =>
      uploadAssetImage(assetId, file, userId, index)
    );

    const results = await Promise.all(uploadPromises);
    return results.filter(
      (attachment) => attachment !== null
    ) as AssetAttachment[];
  } catch (error) {
    console.error("Error in uploadMultipleAssetImages:", error);
    return [];
  }
};
