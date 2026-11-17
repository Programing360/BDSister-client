import {
  getVerificationEmailHtml,
  getResetPasswordEmailHtml,
} from "./templates";

export interface SendEmailOptions {
  to: string;
  name?: string;
  url: string;
}

/**
 * Sends a branded email verification message.
 * Falls back to structured console logging in development or when SMTP provider is unconfigured.
 */
export async function sendVerificationEmail({
  to,
  name = "Sister",
  url,
}: SendEmailOptions): Promise<boolean> {
  const html = getVerificationEmailHtml({ name, url });

  // If a production email provider (e.g. Resend, SMTP) is configured, trigger it here.
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || "BDSisters <noreply@bdsisters.org>";

  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [to],
          subject: "Verify Your BDSisters.org Account",
          html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Email Service] Resend error:", errorText);
        return false;
      }
      return true;
    } catch (error) {
      console.error("[Email Service] Failed sending verification email via API:", error);
      return false;
    }
  }

  // Safe developer / offline fallback
  console.log("==================================================================");
  console.log("📧 [BDSISTERS DEV EMAIL: EMAIL VERIFICATION]");
  console.log(`Recipient: ${to} (${name})`);
  console.log(`Verification URL: ${url}`);
  console.log("==================================================================");

  return true;
}

/**
 * Sends a branded password reset message.
 * Falls back to structured console logging in development or when SMTP provider is unconfigured.
 */
export async function sendPasswordResetEmail({
  to,
  name = "Sister",
  url,
}: SendEmailOptions): Promise<boolean> {
  const html = getResetPasswordEmailHtml({ name, url });

  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || "BDSisters <noreply@bdsisters.org>";

  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [to],
          subject: "Reset Your BDSisters.org Password",
          html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Email Service] Resend error:", errorText);
        return false;
      }
      return true;
    } catch (error) {
      console.error("[Email Service] Failed sending password reset email via API:", error);
      return false;
    }
  }

  // Safe developer / offline fallback
  console.log("==================================================================");
  console.log("🔐 [BDSISTERS DEV EMAIL: PASSWORD RESET]");
  console.log(`Recipient: ${to} (${name})`);
  console.log(`Password Reset URL: ${url}`);
  console.log("==================================================================");

  return true;
}
