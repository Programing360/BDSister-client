interface EmailTemplateParams {
  name?: string;
  url: string;
  appName?: string;
}

export function getVerificationEmailHtml({
  name = "Sister",
  url,
  appName = "BDSisters.org",
}: EmailTemplateParams): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - ${appName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #EAE6F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #EAE6F7; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 24px; border: 1px solid #DDD8EA; overflow: hidden; box-shadow: 0 4px 20px rgba(91, 70, 246, 0.06);">
          <!-- Header -->
          <tr>
            <td style="padding: 36px 40px 24px; text-align: center; background: linear-gradient(135deg, #FAF8FF 0%, #FFFFFF 100%); border-bottom: 1px solid #EDE9FE;">
              <div style="display: inline-block; background-color: #5B46F6; color: #FFFFFF; font-weight: 900; font-size: 20px; width: 44px; height: 44px; line-height: 44px; border-radius: 14px; text-align: center; margin-bottom: 12px;">BD</div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.5px;">BDSisters<span style="color: #5B46F6;">.org</span></h1>
              <p style="margin: 4px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #7366F7; font-weight: 700;">Empowering Bangladeshi Women</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 36px 40px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 800; color: #111827;">Welcome to the Sisterhood, ${name}!</h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 24px; color: #4B5563;">
                Thank you for joining BDSisters.org. To protect our community and activate your free membership, please confirm your email address by clicking the button below.
              </p>
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${url}" style="display: inline-block; background-color: #5B46F6; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 14px; box-shadow: 0 4px 14px rgba(91, 70, 246, 0.35);">
                      Verify My Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px; font-size: 12px; line-height: 20px; color: #6B7280;">
                This link will remain valid for <strong>24 hours</strong>. If you did not create an account on BDSisters.org, you can safely ignore this email.
              </p>
              
              <div style="background-color: #F8F7FC; border-radius: 12px; padding: 12px 16px; margin-top: 24px; border: 1px solid #EDE9FE;">
                <p style="margin: 0; font-size: 11px; color: #6B7280; word-break: break-all;">
                  Button not working? Copy and paste this URL into your browser:<br>
                  <a href="${url}" style="color: #5B46F6; text-decoration: underline;">${url}</a>
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #F8F7FC; border-top: 1px solid #EDE9FE; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 11px; color: #9CA3AF;">
                Chartered initiative by <strong>Muhsina Organization</strong> • Dedicated to Bangladeshi women globally
              </p>
              <p style="margin: 0; font-size: 11px; color: #9CA3AF;">
                Dhaka • Chattogram • Sylhet | <a href="https://bdsisters.org" style="color: #7366F7; text-decoration: none;">bdsisters.org</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getResetPasswordEmailHtml({
  name = "Sister",
  url,
  appName = "BDSisters.org",
}: EmailTemplateParams): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - ${appName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #EAE6F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #EAE6F7; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 24px; border: 1px solid #DDD8EA; overflow: hidden; box-shadow: 0 4px 20px rgba(91, 70, 246, 0.06);">
          <!-- Header -->
          <tr>
            <td style="padding: 36px 40px 24px; text-align: center; background: linear-gradient(135deg, #FAF8FF 0%, #FFFFFF 100%); border-bottom: 1px solid #EDE9FE;">
              <div style="display: inline-block; background-color: #5B46F6; color: #FFFFFF; font-weight: 900; font-size: 20px; width: 44px; height: 44px; line-height: 44px; border-radius: 14px; text-align: center; margin-bottom: 12px;">BD</div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.5px;">BDSisters<span style="color: #5B46F6;">.org</span></h1>
              <p style="margin: 4px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #7366F7; font-weight: 700;">Account Security Desk</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 36px 40px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 800; color: #111827;">Password Reset Request</h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 24px; color: #4B5563;">
                Hello ${name}, we received a request to reset your BDSisters account password. Click the button below to choose a new secure password.
              </p>
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${url}" style="display: inline-block; background-color: #5B46F6; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 14px; box-shadow: 0 4px 14px rgba(91, 70, 246, 0.35);">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px; font-size: 12px; line-height: 20px; color: #6B7280;">
                For your security, this password reset link will expire in <strong>1 hour</strong>. If you did not request this change, your account remains secure and no action is required.
              </p>
              
              <div style="background-color: #F8F7FC; border-radius: 12px; padding: 12px 16px; margin-top: 24px; border: 1px solid #EDE9FE;">
                <p style="margin: 0; font-size: 11px; color: #6B7280; word-break: break-all;">
                  Button not working? Copy and paste this URL into your browser:<br>
                  <a href="${url}" style="color: #5B46F6; text-decoration: underline;">${url}</a>
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #F8F7FC; border-top: 1px solid #EDE9FE; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 11px; color: #9CA3AF;">
                Chartered initiative by <strong>Muhsina Organization</strong> • Dedicated to Bangladeshi women globally
              </p>
              <p style="margin: 0; font-size: 11px; color: #9CA3AF;">
                Need help? Contact <a href="mailto:support@bdsisters.org" style="color: #7366F7; text-decoration: none;">support@bdsisters.org</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
