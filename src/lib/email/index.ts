export interface SendDigitalPassEmailParams {
  to: string;
  orderNumber: string;
  customerName: string;
  experienceTitle: string;
  participantsCount: number;
  participants: string[];
  bookingDate: string;
  totalFormatted: string;
  paymentStatus: "PAID" | "PENDING_PAYMENT";
  passToken: string;
  passCode: string;
  tenantSlug?: string;
}

export function generatePassEmailHtml(params: SendDigitalPassEmailParams): string {
  const baseUrl = process.env.NEXTAUTH_URL || "https://sun-kart-pc.vercel.app";
  const slug = params.tenantSlug || "sunkart-pc";
  const passUrl = `${baseUrl}/${slug}/pass/${params.passToken}`;
  const isPaid = params.paymentStatus === "PAID";

  const participantsHtml = params.participants
    .map(
      (name, idx) => `
      <li style="margin-bottom: 6px; color: #e2e8f0; font-size: 14px;">
        <span style="color: #f97316; font-weight: bold; margin-right: 6px;">#${idx + 1}</span>
        ${name || "Participante"}
      </li>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Pase Digital - SunKart Park</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <!-- Brand Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ea580c 0%, #f97316 50%, #d97706 100%); padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                SunKart <span style="color: #fef08a;">Park</span>
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #ffedd5; font-weight: 600;">
                Punta Cana · Pase Digital Oficial
              </p>
            </td>
          </tr>

          <!-- Confirmation Banner -->
          <tr>
            <td style="padding: 24px 28px 16px 28px; text-align: center;">
              <span style="display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; ${
                isPaid
                  ? "background-color: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4);"
                  : "background-color: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4);"
              }">
                ${isPaid ? "✔ PASE ACTIVO Y CONFIRMADO" : "⏳ PAGO PENDIENTE EN CAJA"}
              </span>
              <h2 style="margin: 16px 0 6px 0; font-size: 20px; font-weight: 700; color: #ffffff;">
                ¡Hola, ${params.customerName}!
              </h2>
              <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                ${
                  isPaid
                    ? "Tu pase de acceso digital está activo. Presenta tu código QR directamente al personal de pista para comenzar."
                    : "Tu reserva está registrada. Presenta este correo en la caja del parque para pagar y activar tu pase de pista."
                }
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="background-color: #1e293b; border-radius: 12px; padding: 18px; border: 1px solid #334155;">
                <table width="100%" cellspacing="0" cellpadding="4">
                  <tr>
                    <td style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Código de Orden:</td>
                    <td align="right" style="font-size: 14px; font-weight: 800; font-family: monospace; color: #f97316;">${params.orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Código de Pase:</td>
                    <td align="right" style="font-size: 13px; font-weight: 700; font-family: monospace; color: #38bdf8;">${params.passCode}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Experiencia:</td>
                    <td align="right" style="font-size: 13px; font-weight: 600; color: #ffffff;">${params.experienceTitle}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Fecha de Visita:</td>
                    <td align="right" style="font-size: 13px; font-weight: 600; color: #ffffff;">${params.bookingDate}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Total (ITBIS 18% incl.):</td>
                    <td align="right" style="font-size: 15px; font-weight: 800; color: #34d399;">${params.totalFormatted}</td>
                  </tr>
                </table>

                <!-- Participants Roster -->
                <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #475569;">
                  <span style="font-size: 12px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">
                    Participantes Autorizados (${params.participantsCount}):
                  </span>
                  <ul style="margin: 8px 0 0 0; padding-left: 20px; list-style-type: none;">
                    ${participantsHtml}
                  </ul>
                </div>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 0 28px 28px 28px;">
              <a href="${passUrl}" target="_blank" style="display: inline-block; width: 85%; max-width: 320px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; text-align: center; padding: 14px 20px; border-radius: 12px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);">
                📱 Abrir Mi Pase Digital QR
              </a>
              <p style="margin: 10px 0 0 0; font-size: 11px; color: #64748b;">
                Puedes guardar el enlace o hacer una captura de pantalla del código QR.
              </p>
            </td>
          </tr>

          <!-- Track Recommendations -->
          <tr>
            <td style="background-color: #090d16; padding: 20px 28px; border-top: 1px solid #1e293b;">
              <h4 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #f59e0b; letter-spacing: 1px;">
                ℹ️ Instrucciones para el Día de tu Visita:
              </h4>
              <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                <li>Presentarse en recepción 15 minutos antes de la tanda programada.</li>
                <li>Uso obligatorio de calzado cerrado (tenis o zapatillas deportivas) para pista de Go-Karts.</li>
                <li>Waiver digital completado y validado en sistema.</li>
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 28px; text-align: center; background-color: #020617;">
              <p style="margin: 0; font-size: 11px; color: #475569;">
                © 2026 SunKart Park Punta Cana. Powered by AdventureOS.
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

export async function sendDigitalPassEmail(params: SendDigitalPassEmailParams): Promise<{
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "SunKart Park <tickets@resend.dev>";
    const subject = `🏎️ Tu Pase Digital SunKart Park — Orden #${params.orderNumber}`;
    const html = generatePassEmailHtml(params);

    if (resendApiKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [params.to],
          subject,
          html,
        }),
      });

      const data = await res.json();
      if (res.ok && data.id) {
        return { success: true, messageId: data.id };
      } else {
        console.warn("Resend API warning/error:", data);
        // Fallback to simulated delivery so customer flow doesn't break
        return { success: true, simulated: true, messageId: `sim-${Date.now()}` };
      }
    }

    // Default simulation for development and production without live Resend key
    console.log(
      `[SIMULATED EMAIL] Digital Pass sent to ${params.to} for Order #${params.orderNumber}.`
    );
    return { success: true, simulated: true, messageId: `sim-${Date.now()}` };
  } catch (error: any) {
    console.error("sendDigitalPassEmail exception:", error);
    return { success: false, error: error.message };
  }
}
