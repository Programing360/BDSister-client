// Cloudinary server-side configuration
// NEVER expose CLOUDINARY_API_SECRET to the browser

export const cloudinaryConfig = {
  cloudName: process.env["CLOUDINARY_CLOUD_NAME"] ?? "",
  apiKey: process.env["CLOUDINARY_API_KEY"] ?? "",
  apiSecret: process.env["CLOUDINARY_API_SECRET"] ?? "",
};

// Public config (safe for browser)
export const cloudinaryPublicConfig = {
  cloudName: process.env["NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"] ?? "",
  uploadPreset: process.env["NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"] ?? "",
};

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    cloudinaryConfig.cloudName &&
    cloudinaryConfig.apiKey &&
    cloudinaryConfig.apiSecret,
  );
}
