import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  encryptIdNumber,
  decryptIdNumber,
  maskIdNumber,
  sanitizeVerification,
  type MemberVerificationRecord,
} from "../../src/lib/db/repositories/verification-repository.ts";
import {
  generatePrivatePresignedUrl,
  verifyPresignedUrlSignature,
  ALLOWED_DOC_MIME_TYPES,
  MAX_DOCUMENT_BYTES,
  AUTHORIZED_VERIFICATION_ROLES,
} from "../../src/lib/storage/secure-vault.ts";

describe("Phase A: Verification Repository & Cryptographic Security", () => {
  it("should encrypt and decrypt NID numbers using AES-256-GCM without data loss", () => {
    const rawNid = "19941234567893108";
    const encrypted = encryptIdNumber(rawNid);

    assert.ok(encrypted.includes(":"), "Encrypted payload must contain IV, tag, and ciphertext delimiters");
    const parts = encrypted.split(":");
    assert.strictEqual(parts.length, 3, "Encrypted payload must have exactly 3 parts (IV, Tag, Ciphertext)");
    assert.notStrictEqual(encrypted, rawNid, "Encrypted payload must not match plain text");

    const decrypted = decryptIdNumber(encrypted);
    assert.strictEqual(decrypted, rawNid, "Decrypted NID must exactly match original plain text");
  });

  it("should fail gracefully and return empty string if ciphertext is tampered with", () => {
    const rawNid = "19941234567893108";
    const encrypted = encryptIdNumber(rawNid);
    const parts = encrypted.split(":");

    // Corrupt ciphertext
    const tampered = `${parts[0]}:${parts[1]}:bad00000deadbeef`;
    const decrypted = decryptIdNumber(tampered);
    assert.strictEqual(decrypted, "", "Tampered ciphertext must fail authentication and return empty string");
  });

  it("should correctly mask ID numbers for non-PII presentation", () => {
    assert.strictEqual(maskIdNumber("19941234567893108"), "1994********3108");
    assert.strictEqual(maskIdNumber("A1234567"), "A1****67");
    assert.strictEqual(maskIdNumber("123"), "****");
  });

  it("should strictly sanitize verification records, removing encrypted fields and private keys", () => {
    const mockRecord: MemberVerificationRecord = {
      id: "verif_123",
      userId: "usr_456",
      userEmail: "sister@bdsisters.org",
      userName: "Nusrat Jahan",
      docType: "NID",
      idNumberEncrypted: "iv:tag:cipher",
      idNumberMasked: "1994********3108",
      frontDocumentKey: "vault_nid_usr_456_front.pdf",
      backDocumentKey: "vault_nid_usr_456_back.pdf",
      status: "PENDING",
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const sanitized = sanitizeVerification(mockRecord);
    assert.strictEqual((sanitized as unknown as Record<string, unknown>)["idNumberEncrypted"], undefined);
    assert.strictEqual((sanitized as unknown as Record<string, unknown>)["frontDocumentKey"], undefined);
    assert.strictEqual((sanitized as unknown as Record<string, unknown>)["backDocumentKey"], undefined);
    assert.strictEqual(sanitized.idNumberMasked, "1994********3108");
    assert.strictEqual(sanitized.status, "PENDING");
  });
});

describe("Phase B: Private Secure Vault & Presigned Access Tokens", () => {
  it("should enforce allowed document formats and size limits", () => {
    assert.ok(ALLOWED_DOC_MIME_TYPES.includes("image/jpeg"));
    assert.ok(ALLOWED_DOC_MIME_TYPES.includes("image/png"));
    assert.ok(ALLOWED_DOC_MIME_TYPES.includes("image/webp"));
    assert.ok(ALLOWED_DOC_MIME_TYPES.includes("application/pdf"));
    assert.strictEqual(ALLOWED_DOC_MIME_TYPES.includes("application/exe"), false);
    assert.strictEqual(MAX_DOCUMENT_BYTES, 10 * 1024 * 1024, "Max file size must be 10MB");
  });

  it("should enforce RBAC authorization roles for document inspection", () => {
    assert.ok(AUTHORIZED_VERIFICATION_ROLES.includes("SUPER_ADMIN"));
    assert.ok(AUTHORIZED_VERIFICATION_ROLES.includes("ADMIN"));
    assert.ok(AUTHORIZED_VERIFICATION_ROLES.includes("FEMALE_VERIFICATION_OFFICER"));
    assert.strictEqual(AUTHORIZED_VERIFICATION_ROLES.includes("MEMBER"), false);
  });

  it("should generate a valid 15-minute presigned URL and verify its HMAC signature", () => {
    const objectKey = "vault_nid_usr_12345_front.pdf";
    const presignedUrl = generatePrivatePresignedUrl(objectKey, 900);

    assert.ok(presignedUrl.startsWith("/api/admin/verifications/document?"));
    const url = new URL(presignedUrl, "http://localhost");
    const key = url.searchParams.get("key");
    const expires = parseInt(url.searchParams.get("expires") || "0", 10);
    const sig = url.searchParams.get("sig") || "";

    assert.strictEqual(key, objectKey);
    assert.ok(expires > Math.floor(Date.now() / 1000));
    assert.ok(sig.length > 0);

    const isValid = verifyPresignedUrlSignature(key!, expires, sig);
    assert.strictEqual(isValid, true, "Signature must verify successfully");
  });

  it("should reject tampered or expired presigned URLs", () => {
    const objectKey = "vault_nid_usr_12345_front.pdf";
    const presignedUrl = generatePrivatePresignedUrl(objectKey, 900);
    const url = new URL(presignedUrl, "http://localhost");
    const key = url.searchParams.get("key")!;
    const expires = parseInt(url.searchParams.get("expires") || "0", 10);
    const sig = url.searchParams.get("sig")!;

    // 1. Tampered key
    assert.strictEqual(verifyPresignedUrlSignature("vault_nid_other_front.pdf", expires, sig), false);

    // 2. Tampered signature
    assert.strictEqual(verifyPresignedUrlSignature(key, expires, "tampered_signature_1234"), false);

    // 3. Expired timestamp
    const pastExpires = Math.floor(Date.now() / 1000) - 100; // 100 seconds ago
    assert.strictEqual(verifyPresignedUrlSignature(key, pastExpires, sig), false);
  });
});
