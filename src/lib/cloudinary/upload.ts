// Cloudinary upload utilities — server-side only

import { isCloudinaryConfigured } from "./config";

export type UploadFolder =
  | "avatars"
  | "businesses"
  | "products"
  | "events"
  | "resources"
  | "community";

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload a file to Cloudinary via the API (server-side).
 * Full implementation will be added when Cloudinary SDK is configured.
 */
export async function uploadToCloudinary(
  _file: Buffer | string,
  _folder: UploadFolder,
  _options?: { transformation?: string },
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_* environment variables.");
  }

  // Placeholder — full implementation pending Cloudinary SDK setup
  throw new Error("Cloudinary upload not yet implemented.");
}
