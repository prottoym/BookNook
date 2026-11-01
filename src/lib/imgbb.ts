const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

export const MAX_IMAGE_MB = 5;

// Returns an error message when the picture is not OK, or null when it is fine
export function checkImage(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please choose an image file (JPG, PNG or WebP).";
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return `The image is too big. Please keep it under ${MAX_IMAGE_MB} MB.`;
  }
  return null;
}

// Uploads the picture to imgbb and gives back its public URL
export async function uploadToImgbb(file: File): Promise<string> {
  if (!IMGBB_KEY) {
    throw new Error("Image upload is not set up yet. Please add the imgbb API key.");
  }

  const body = new FormData();
  body.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body,
  });
  const result = await res.json().catch(() => null);

  if (!res.ok || !result?.success) {
    throw new Error(result?.error?.message || "Image upload failed. Please try again.");
  }
  return result.data.url as string;
}