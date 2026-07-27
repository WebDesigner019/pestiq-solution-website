import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface OrderEmailParams {
  toEmail: string;
  customerName: string;
  referenceCode: string;
  serviceAddress: string;
  preferredDate: string;
  arrivalWindow: string;
  planName: string;
  notes?: string;
}

export async function sendOrderConfirmationEmail(params: OrderEmailParams) {
  const { toEmail, customerName, referenceCode, serviceAddress, preferredDate, arrivalWindow, planName, notes } = params;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #071b4d; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background: #071b4d; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #FACC15; margin: 0; font-size: 24px;">PestIQ Solutions</h1>
        <p style="color: #ffffff; margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Service Request Received</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #071b4d; font-size: 20px; margin-top: 0;">Hello ${customerName},</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Thank you for choosing PestIQ Solutions! Your pest control appointment request has been recorded in our dispatch system.
        </p>

        <div style="background: #f8fafc; border-left: 4px solid #FACC15; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 6px; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Request Reference</p>
          <p style="margin: 0; font-size: 20px; font-family: monospace; font-weight: bold; color: #071b4d;">${referenceCode}</p>
        </div>

        <h3 style="color: #071b4d; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Request Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 140px;">Selected Plan:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #071b4d;">${planName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Service Address:</td>
            <td style="padding: 8px 0;">${serviceAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Preferred Date:</td>
            <td style="padding: 8px 0;">${preferredDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Arrival Window:</td>
            <td style="padding: 8px 0;">${arrivalWindow}</td>
          </tr>
          ${notes ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Special Notes:</td>
            <td style="padding: 8px 0;">${notes}</td>
          </tr>
          ` : ""}
        </table>

        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 14px; border-radius: 8px; margin-top: 24px;">
          <p style="margin: 0; font-size: 13px; color: #065f46; font-weight: bold;">🛡️ 100% Satisfaction & Protection Guarantee</p>
          <p style="margin: 4px 0 0; font-size: 12px; color: #047857;">A PestIQ dispatch coordinator will review your property specifications and contact you to confirm final technician arrival.</p>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
        <p style="margin: 0;">PestIQ Solutions Inc. · NYC, Westchester &amp; Ocean County NJ</p>
        <p style="margin: 4px 0 0;">Questions? Reply to this email or call +1 (800) 555-PEST</p>
      </div>
    </div>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "PestIQ Solutions <orders@pestiq.com>",
        to: [toEmail],
        subject: `PestIQ Service Request Confirmation [${referenceCode}]`,
        html: htmlContent,
      });
      console.log(`Order confirmation email dispatched to ${toEmail}`);
    } catch (err) {
      console.warn("Failed to dispatch email via Resend API:", err);
    }
  } else {
    console.log("Resend API key omitted — logged confirmation email payload for testing:", referenceCode);
  }
}

export async function sendPasswordResetEmail(params: { toEmail: string; resetToken: string; resetUrl: string }) {
  const { toEmail, resetToken, resetUrl } = params;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #071b4d; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background: #071b4d; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #FACC15; margin: 0; font-size: 24px;">PestIQ Enterprise Security</h1>
        <p style="color: #ffffff; margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Password Reset Authorization</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #071b4d; font-size: 18px; margin-top: 0;">Admin Password Reset Request</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          We received a request to reset the master admin password for <strong>${toEmail}</strong> on the PestIQ Dispatch Console.
        </p>

        <div style="background: #f8fafc; border-left: 4px solid #1557b8; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 6px; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">Security Authorization Code</p>
          <p style="margin: 0; font-size: 22px; font-family: monospace; font-weight: bold; color: #1557b8; letter-spacing: 3px;">${resetToken.slice(0, 8).toUpperCase()}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #071b4d; color: #FACC15; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; display: inline-block;">
            Reset Admin Password →
          </a>
        </div>

        <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
          This link will expire in 30 minutes. If you did not initiate this request, please contact PestIQ System Security immediately.
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
        <p style="margin: 0;">PestIQ Solutions Enterprise Security Console</p>
      </div>
    </div>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "PestIQ Security <security@pestiq.com>",
        to: [toEmail],
        subject: `[PestIQ Security] Admin Password Reset Authorization`,
        html: htmlContent,
      });
      console.log(`Password reset email sent to ${toEmail}`);
    } catch (err) {
      console.warn("Failed to dispatch password reset email via Resend:", err);
    }
  } else {
    console.log(`[TEST MODE] Password reset email link for ${toEmail}: ${resetUrl}`);
  }
}
