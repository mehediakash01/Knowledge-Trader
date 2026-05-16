/**
 * Uploads a file to Cloudinary using unsigned upload preset.
 * Returns the secure_url of the uploaded asset.
 */
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video" | "raw";
  format: string;
  bytes: number;
  duration?: number; // seconds, for video
  pages?: number;    // for PDF
}

export async function uploadToCloudinary(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET must be set.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResult);
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during Cloudinary upload."));
    });

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    );
    xhr.send(formData);
  });
}

/**
 * Validate that the teaser asset meets quality requirements:
 * - Video: must be 15+ seconds
 * - PDF: must be 2+ pages (checked via page count in upload result)
 * - Code/README: .md, .txt accepted as-is
 */
export function validateTeaserAsset(
  file: File,
  uploadResult: CloudinaryUploadResult,
): { valid: boolean; error?: string } {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (uploadResult.resource_type === "video") {
    const duration = uploadResult.duration ?? 0;
    if (duration < 15) {
      return {
        valid: false,
        error: `Teaser video must be at least 15 seconds long. Yours is ${Math.round(duration)}s.`,
      };
    }
    return { valid: true };
  }

  if (ext === "pdf") {
    const pages = uploadResult.pages ?? 1;
    if (pages < 2) {
      return {
        valid: false,
        error: "Teaser PDF must have at least 2 pages.",
      };
    }
    return { valid: true };
  }

  if (["md", "txt", "readme"].includes(ext)) {
    return { valid: true };
  }

  return {
    valid: false,
    error: "Teaser must be a video (15s+), PDF (2+ pages), or README (.md/.txt).",
  };
}
