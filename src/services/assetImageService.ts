import { supabase } from "@/lib/supabaseClient";

/**
 * Uploads a single asset image to the storage bucket
 * @param assetId The ID of the asset
 * @param file The image file to upload
 * @param index Optional index for multiple files
 * @returns The public URL of the uploaded image
 */
export const uploadAssetImage = async (
  assetId: string | number,
  file: File,
  index = 0
): Promise<string | null> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${index}.${fileExt}`;
    const filePath = `${assetId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("asset-image")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      throw error;
    }

    // Get public URL for the image
    const { data: urlData } = supabase.storage
      .from("asset-image")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadAssetImage:", error);
    return null;
  }
};

/**
 * Uploads multiple asset images and returns their URLs
 * @param assetId The ID of the asset
 * @param files Array of image files to upload
 * @returns Array of public URLs for the uploaded images
 */
export const uploadMultipleAssetImages = async (
  assetId: string | number,
  files: File[]
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) =>
      uploadAssetImage(assetId, file, index)
    );

    const results = await Promise.all(uploadPromises);
    return results.filter((url) => url !== null) as string[];
  } catch (error) {
    console.error("Error in uploadMultipleAssetImages:", error);
    return [];
  }
};
