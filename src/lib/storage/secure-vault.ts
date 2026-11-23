/**
 * Private Secure Storage Vault for Confidential Identity Documents (NID / Passport)
 * Encrypts files at rest using AES-256-GCM.
 * Issues short-lived, tamper-proof 15-minute presigned URLs strictly restricted to authorized verification officers.
 */

import crypto from "node:crypto";
import { getDatabase } from "../db/mongodb.ts";
import { isCloudinaryConfigured, cloudinaryConfig } from "../cloudinary/config.ts";

export const ALLOWED_DOC_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10MB

export const AUTHORIZED_VERIFICATION_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MODERATOR",
  "SUPPORT_AGENT",
  "FEMALE_VERIFICATION_OFFICER",
];

const VAULT_COLLECTION = "secure_vault_documents";

export interface VaultDocumentRecord {
  key: string;
  userId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  encryptedBase64: string;
  ivHex: string;
  tagHex: string;
  storageProvider: "LOCAL_AES256" | "CLOUDINARY_AUTHENTICATED";
  externalPublicId?: string;
  createdAt: Date;
}

/**
 * Derive 32-byte secret key for vault encryption & presigned signatures
 */
function getVaultSecretKey(): Buffer {
  const secret =
    process.env["NID_VAULT_SECRET"] ||
    process.env["NID_ENCRYPTION_KEY"] ||
    process.env["BETTER_AUTH_SECRET"] ||
    "bdsisters_private_secure_vault_signing_key_2026";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypt document buffer using AES-256-GCM
 */
function encryptBuffer(buffer: Buffer): { encrypted: Buffer; iv: Buffer; tag: Buffer } {
  const key = getVaultSecretKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { encrypted, iv, tag };
}

/**
 * Decrypt document buffer using AES-256-GCM
 */
function decryptBuffer(encrypted: Buffer, iv: Buffer, tag: Buffer): Buffer {
  const key = getVaultSecretKey();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

/**
 * Upload an identity document to the private secure vault.
 * Strict validation: JPG, PNG, WebP, or PDF up to 10MB.
 * Encrypts file bytes with AES-256-GCM before saving to private vault.
 */
export async function uploadPrivateDocument(
  file: {
    buffer: Buffer;
    fileName: string;
    mimeType: string;
    size: number;
  },
  userId: string
): Promise<{ objectKey: string }> {
  if (!ALLOWED_DOC_MIME_TYPES.includes(file.mimeType)) {
    throw new Error(
      `Invalid document format '${file.mimeType}'. Allowed formats: JPG, PNG, WebP, or PDF.`
    );
  }

  if (file.size > MAX_DOCUMENT_BYTES || file.buffer.length > MAX_DOCUMENT_BYTES) {
    throw new Error("Document exceeds the maximum allowed file size of 10MB.");
  }

  const objectKey = `vault_nid_${userId}_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date();

  // If Cloudinary is configured, upload with type: "authenticated"
  let externalPublicId: string | undefined;
  let storageProvider: VaultDocumentRecord["storageProvider"] = "LOCAL_AES256";

  if (isCloudinaryConfigured()) {
    try {
      const timestamp = Math.round(Date.now() / 1000);
      const cloudFormData = new FormData();
      const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimeType });
      cloudFormData.append("file", blob, file.fileName);
      cloudFormData.append("timestamp", timestamp.toString());
      cloudFormData.append("folder", "bdsisters/secure_vault/nid");
      cloudFormData.append("type", "authenticated");
      cloudFormData.append("api_key", cloudinaryConfig.apiKey);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`,
        {
          method: "POST",
          body: cloudFormData,
        }
      );

      if (res.ok) {
        const result = (await res.json()) as { public_id: string };
        externalPublicId = result.public_id;
        storageProvider = "CLOUDINARY_AUTHENTICATED";
      }
    } catch (cloudErr) {
      console.warn("[Vault] Cloudinary authenticated upload failed, using local AES-256 vault:", cloudErr);
    }
  }

  // Encrypt with AES-256-GCM for storage
  const { encrypted, iv, tag } = encryptBuffer(file.buffer);

  const record: VaultDocumentRecord = {
    key: objectKey,
    userId,
    originalName: file.fileName,
    mimeType: file.mimeType,
    sizeBytes: file.size,
    encryptedBase64: encrypted.toString("base64"),
    ivHex: iv.toString("hex"),
    tagHex: tag.toString("hex"),
    storageProvider,
    externalPublicId,
    createdAt: now,
  };

  try {
    const db = await getDatabase();
    await db.collection<VaultDocumentRecord>(VAULT_COLLECTION).createIndex({ key: 1 }, { unique: true });
    await db.collection<VaultDocumentRecord>(VAULT_COLLECTION).insertOne(record);
  } catch (err) {
    console.error("[Vault] Failed to persist secure document record:", err);
    throw new Error("Failed to store identity document in secure vault.");
  }

  return { objectKey };
}

/**
 * Generate a short-lived, tamper-proof signed URL (TTL 15 minutes = 900 seconds)
 * strictly for authorized verification officers.
 */
export function generatePrivatePresignedUrl(
  objectKey: string,
  ttlSeconds: number = 900
): string {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const secret = getVaultSecretKey();

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${objectKey}:${expires}`);
  const signature = hmac.digest("hex");

  return `/api/admin/verifications/document?key=${encodeURIComponent(objectKey)}&expires=${expires}&sig=${signature}`;
}

/**
 * Verify presigned URL HMAC signature and TTL expiration
 */
export function verifyPresignedUrlSignature(
  objectKey: string,
  expires: number,
  signature: string
): boolean {
  if (!objectKey || !expires || !signature) return false;

  const now = Math.floor(Date.now() / 1000);
  if (expires < now) {
    return false; // Expired
  }

  const secret = getVaultSecretKey();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${objectKey}:${expires}`);
  const expected = hmac.digest("hex");

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

/**
 * Retrieve and decrypt document from the secure vault
 */
export async function retrievePrivateDocument(
  objectKey: string
): Promise<{ buffer: Buffer; mimeType: string; originalName: string } | null> {
  if (!objectKey) return null;

  try {
    const db = await getDatabase();
    const doc = await db
      .collection<VaultDocumentRecord>(VAULT_COLLECTION)
      .findOne({ key: objectKey });

    if (!doc) return null;

    const encrypted = Buffer.from(doc.encryptedBase64, "base64");
    const iv = Buffer.from(doc.ivHex, "hex");
    const tag = Buffer.from(doc.tagHex, "hex");

    const decrypted = decryptBuffer(encrypted, iv, tag);

    return {
      buffer: decrypted,
      mimeType: doc.mimeType,
      originalName: doc.originalName,
    };
  } catch (err) {
    console.error("[Vault] Failed to retrieve or decrypt private document:", err);
    return null;
  }
}
