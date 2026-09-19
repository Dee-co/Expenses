import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  retries = 2
): Promise<UploadApiResponse> {
  const attemptUpload = () =>
    new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_chunked_stream(
        {
          folder,
          resource_type: "image",
          chunk_size: 1024 * 1024,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error("Empty Cloudinary response"));
          }
          resolve(result);
        }
      );
      stream.on("error", reject);
      stream.end(buffer);
    });
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await attemptUpload();
    } catch (error) {
      lastError = error;
      console.error(`Cloudinary upload attempt ${attempt + 1} failed:`, error);
      if (attempt < retries) {
        await wait(1000 * (attempt + 1));
      }
    }
  }
  throw lastError;
}
export function getPublicIdFromUrl(fileUrl: string): string | null {
  try {
    const url = new URL(fileUrl);
    const parts = url.pathname.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    let publicId = parts.slice(uploadIndex + 1).join("/");
    publicId = publicId.replace(/^v\d+\//, "");
    publicId = publicId.replace(/\.[^/.]+$/, "");
    return publicId;
  } catch {
    return null;
  }
}
export async function deleteCloudinaryFile(fileUrl: string | null) {
  if (!fileUrl) return;
  const publicId = getPublicIdFromUrl(fileUrl);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("CLOUDINARY DELETE ERROR:", error);
  }
}
