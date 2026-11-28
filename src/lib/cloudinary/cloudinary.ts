import { apiClient } from "@/lib/api/client";

interface SignatureResponse {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
}

export async function uploadSignedToCloudinary(file: File): Promise<string> {
  // 1. Attempt direct signed upload using backend Cloudinary signature
  try {
    const sigRes = await apiClient.get<SignatureResponse>("/api/upload/signature");

    if (sigRes.data?.signature && sigRes.data?.cloudName && sigRes.data?.apiKey) {
      const { signature, timestamp, cloudName, apiKey, uploadPreset } = sigRes.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      if (uploadPreset) {
        formData.append("upload_preset", uploadPreset);
      }

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.secure_url || result.url) {
          return result.secure_url || result.url;
        }
      }
    }
  } catch (err) {
    console.warn("Direct signed Cloudinary upload encountered an issue, trying internal upload route...", err);
  }

  // 2. Fallback to internal member upload route
  try {
    const memberFormData = new FormData();
    memberFormData.append("file", file);
    memberFormData.append("type", "product");
    const memberRes = await fetch("/api/member/upload", {
      method: "POST",
      body: memberFormData,
    });
    if (memberRes.ok) {
      const memberData = await memberRes.json();
      if (memberData?.data?.url) {
        return memberData.data.url;
      }
    }
  } catch (memberErr) {
    console.warn("Member upload fallback failed:", memberErr);
  }

  // 3. Fallback to base64 Data URL so local development workflows never block
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}
