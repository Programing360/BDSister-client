import { apiClient } from "@/lib/api/client";

interface SignatureResponse {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
}

export async function uploadSignedToCloudinary(file: File): Promise<string> {
  // ১. ব্যাকএন্ড থেকে সিগনেচার ও কনফিগ আনা
  // (আপনার ব্যাকএন্ডের রাউট অনুযায়ী URL-টি ঠিক করে নেবেন, যেমন: "/upload/signature")
  console.log(file);

  const sigRes = await apiClient.get<SignatureResponse>("/api/upload/signature");

  if (sigRes.error || !sigRes.data) {
    throw new Error(sigRes.error?.message || "Could not authorize file upload.");
  }

  const { signature, timestamp, cloudName, apiKey, uploadPreset } = sigRes.data;

  // ২. Cloudinary-তে ফাইল আপলোডের জন্য FormData তৈরি
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("upload_preset", uploadPreset);

  // ৩. সরাসরি Cloudinary API-তে POST করা
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || "Document upload to Cloudinary failed.");
  }

  const result = await response.json();

  console.log(result);

  return result.secure_url;
}
