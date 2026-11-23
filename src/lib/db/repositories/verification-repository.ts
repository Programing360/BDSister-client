import crypto from "node:crypto";
import { getDatabase } from "../mongodb.ts";
import { toPlainObject } from "../../utils/serialize.ts";

export type VerificationDocType = "NID" | "PASSPORT" | "ACADEMIC";
export type VerificationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ACTION_REQUIRED";

export interface MemberVerificationRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  docType: VerificationDocType;
  idNumberEncrypted: string; // AES-256-GCM cipher
  idNumberMasked: string;    // e.g. "1994********3108"
  frontDocumentKey: string;  // Private secure vault object key
  backDocumentKey?: string;  // Private secure vault object key
  status: VerificationStatus;
  rejectionReason?: string;
  adminNotes?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type SanitizedMemberVerification = Omit<
  MemberVerificationRecord,
  "idNumberEncrypted" | "frontDocumentKey" | "backDocumentKey"
>;

export interface AuditLogRecord {
  id: string;
  action:
    | "SUBMIT_NID"
    | "VIEW_NID"
    | "APPROVE_NID"
    | "REJECT_NID"
    | "REQUEST_INFO_NID"
    | "EXPORT_NID_AUDIT";
  actorId: string;
  actorEmail?: string;
  actorRole?: string;
  targetId: string;
  targetUserId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const VERIFICATIONS_COLLECTION = "member_verifications";
const AUDIT_LOGS_COLLECTION = "audit_logs";
const USERS_COLLECTION = "users";

/**
 * Derive 32-byte AES-256 encryption key from environment secret
 */
function getEncryptionKey(): Buffer {
  const secret =
    process.env["NID_ENCRYPTION_KEY"] ||
    process.env["BETTER_AUTH_SECRET"] ||
    "bdsisters_nid_default_secure_vault_key_2026";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypt national ID or passport number with AES-256-GCM
 */
export function encryptIdNumber(idNumber: string): string {
  if (!idNumber) return "";
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(idNumber.trim(), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypt national ID or passport number with AES-256-GCM verification
 */
export function decryptIdNumber(encryptedPayload: string): string {
  if (!encryptedPayload || !encryptedPayload.includes(":")) return "";
  try {
    const parts = encryptedPayload.split(":");
    if (parts.length !== 3) return "";
    const ivHex = parts[0];
    const tagHex = parts[1];
    const dataHex = parts[2];
    if (!ivHex || !tagHex || !dataHex) return "";

    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(tagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataHex, "hex")),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (err) {
    console.error("[VerificationCrypto] Decryption failed:", (err as Error).message);
    return "";
  }
}

/**
 * Mask an ID number for secure, non-PII display
 * Examples:
 * "19941234567893108" -> "1994********3108"
 * "A12345678" -> "A1****78"
 */
export function maskIdNumber(idNumber: string): string {
  const clean = idNumber.trim();
  if (clean.length <= 4) return "****";
  if (clean.length <= 8) {
    return `${clean.slice(0, 2)}****${clean.slice(-2)}`;
  }
  return `${clean.slice(0, 4)}********${clean.slice(-4)}`;
}

/**
 * Strips all encrypted payloads and private document keys before any serialization or public presentation
 */
export function sanitizeVerification(
  record: MemberVerificationRecord
): SanitizedMemberVerification {
  const { idNumberEncrypted, frontDocumentKey, backDocumentKey, ...safe } = record;
  return toPlainObject(safe) as SanitizedMemberVerification;
}

let indicesEnsured = false;
export async function ensureVerificationIndices(): Promise<void> {
  if (indicesEnsured) return;
  try {
    const db = await getDatabase();
    await db.collection(VERIFICATIONS_COLLECTION).createIndex({ id: 1 }, { unique: true });
    await db.collection(VERIFICATIONS_COLLECTION).createIndex({ userId: 1 });
    await db.collection(VERIFICATIONS_COLLECTION).createIndex({ status: 1 });
    await db.collection(VERIFICATIONS_COLLECTION).createIndex({ submittedAt: -1 });

    await db.collection(AUDIT_LOGS_COLLECTION).createIndex({ id: 1 }, { unique: true });
    await db.collection(AUDIT_LOGS_COLLECTION).createIndex({ action: 1 });
    await db.collection(AUDIT_LOGS_COLLECTION).createIndex({ targetUserId: 1 });
    await db.collection(AUDIT_LOGS_COLLECTION).createIndex({ timestamp: -1 });

    indicesEnsured = true;
  } catch (err) {
    console.warn("[VerificationRepo] Indices initialization deferred:", (err as Error).message);
  }
}

/**
 * Write an immutable security audit log entry
 */
export async function recordAuditLog(log: Omit<AuditLogRecord, "id" | "timestamp">): Promise<void> {
  await ensureVerificationIndices();
  try {
    const db = await getDatabase();
    const entry: AuditLogRecord = {
      ...log,
      id: `audit_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      timestamp: new Date(),
    };
    await db.collection<AuditLogRecord>(AUDIT_LOGS_COLLECTION).insertOne(entry);
  } catch (err) {
    console.warn("[AuditLog] Failed to persist audit entry:", (err as Error).message);
  }
}

/**
 * Submit or update a member's identity verification documents
 */
export async function createOrUpdateVerification(input: {
  userId: string;
  userEmail: string;
  userName: string;
  docType: VerificationDocType;
  idNumber: string;
  frontDocumentKey: string;
  backDocumentKey?: string;
}): Promise<MemberVerificationRecord> {
  await ensureVerificationIndices();
  const db = await getDatabase();
  const now = new Date();

  const idNumberEncrypted = encryptIdNumber(input.idNumber);
  const idNumberMasked = maskIdNumber(input.idNumber);

  const existing = await db
    .collection<MemberVerificationRecord>(VERIFICATIONS_COLLECTION)
    .findOne({ userId: input.userId });

  const record: MemberVerificationRecord = {
    id: existing?.id || `verif_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    userId: input.userId,
    userEmail: input.userEmail,
    userName: input.userName,
    docType: input.docType,
    idNumberEncrypted,
    idNumberMasked,
    frontDocumentKey: input.frontDocumentKey,
    backDocumentKey: input.backDocumentKey,
    status: "PENDING",
    submittedAt: now,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await db.collection<MemberVerificationRecord>(VERIFICATIONS_COLLECTION).updateOne(
    { userId: input.userId },
    { $set: record },
    { upsert: true }
  );

  // Update user verification status in users collection
  try {
    await db.collection(USERS_COLLECTION).updateOne(
      { id: input.userId },
      {
        $set: {
          verificationStatus: "PENDING",
          updatedAt: now,
        },
      }
    );
  } catch (err) {
    console.warn("[VerificationRepo] User verification status sync deferred:", (err as Error).message);
  }

  return record;
}

/**
 * Find verification record by member userId
 */
export async function findVerificationByUserId(
  userId: string
): Promise<MemberVerificationRecord | null> {
  if (!userId) return null;
  await ensureVerificationIndices();
  try {
    const db = await getDatabase();
    const doc = await db
      .collection<MemberVerificationRecord>(VERIFICATIONS_COLLECTION)
      .findOne({ userId });
    return doc ? (toPlainObject(doc) as MemberVerificationRecord) : null;
  } catch {
    return null;
  }
}

/**
 * Find verification record by its record ID
 */
export async function findVerificationById(
  id: string
): Promise<MemberVerificationRecord | null> {
  if (!id) return null;
  await ensureVerificationIndices();
  try {
    const db = await getDatabase();
    const doc = await db
      .collection<MemberVerificationRecord>(VERIFICATIONS_COLLECTION)
      .findOne({ id });
    return doc ? (toPlainObject(doc) as MemberVerificationRecord) : null;
  } catch {
    return null;
  }
}

/**
 * List verification submissions with pagination and filters (sanitized for admin queue)
 */
export async function listVerifications(options: {
  status?: VerificationStatus;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: SanitizedMemberVerification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  await ensureVerificationIndices();
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {};
  if (options.status) {
    query["status"] = options.status;
  }
  if (options.search) {
    const regex = { $regex: options.search, $options: "i" };
    query["$or"] = [{ userName: regex }, { userEmail: regex }, { idNumberMasked: regex }];
  }

  try {
    const db = await getDatabase();
    const [rawDocs, total] = await Promise.all([
      db
        .collection<MemberVerificationRecord>(VERIFICATIONS_COLLECTION)
        .find(query)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection<MemberVerificationRecord>(VERIFICATIONS_COLLECTION).countDocuments(query),
    ]);

    const data = rawDocs.map((doc) => sanitizeVerification(toPlainObject(doc) as MemberVerificationRecord));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  } catch {
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 1,
    };
  }
}

/**
 * Review a member verification (Approve, Reject, or Request More Info)
 */
export async function reviewVerification(
  id: string,
  update: {
    status: VerificationStatus;
    rejectionReason?: string;
    adminNotes?: string;
    officerId: string;
    officerName: string;
  }
): Promise<MemberVerificationRecord | null> {
  await ensureVerificationIndices();
  const db = await getDatabase();
  const now = new Date();

  const existing = await findVerificationById(id);
  if (!existing) return null;

  const updateFields: Partial<MemberVerificationRecord> = {
    status: update.status,
    adminNotes: update.adminNotes ?? existing.adminNotes,
    assignedOfficerId: update.officerId,
    assignedOfficerName: update.officerName,
    reviewedAt: now,
    updatedAt: now,
  };

  if (update.status === "REJECTED" || update.status === "ACTION_REQUIRED") {
    updateFields.rejectionReason = update.rejectionReason || "Identity document requires correction.";
  } else if (update.status === "APPROVED") {
    updateFields.rejectionReason = undefined;
  }

  await db
    .collection<MemberVerificationRecord>(VERIFICATIONS_COLLECTION)
    .updateOne({ id }, { $set: updateFields });

  // Sync to users collection
  const isApproved = update.status === "APPROVED";
  try {
    await db.collection(USERS_COLLECTION).updateOne(
      { id: existing.userId },
      {
        $set: {
          verificationStatus: update.status,
          isVerified: isApproved,
          updatedAt: now,
        },
      }
    );
  } catch (err) {
    console.warn("[VerificationRepo] User verification sync failed:", (err as Error).message);
  }

  return {
    ...existing,
    ...updateFields,
  };
}
