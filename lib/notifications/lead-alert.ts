import 'server-only';

import { PRODUCTION_SITE_URL } from '@/config/site';

export type LeadAlertPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
  vehicleInterest?: string | null;
};

type AlertResult = {
  ok: boolean;
  skipped?: boolean;
};

function buildLeadAlertHtml(payload: LeadAlertPayload, adminUrl: string): string {
  const vehicleLine = payload.vehicleInterest
    ? `<p><strong>Vehículo de interés:</strong> ${escapeHtml(payload.vehicleInterest)}</p>`
    : '';

  const messageBlock = payload.message
    ? `<p><strong>Mensaje:</strong></p><p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>`
    : '';

  return `
    <div style="font-family:Georgia,serif;color:#0a0a0a;max-width:560px">
      <h1 style="font-size:22px;font-weight:normal;margin:0 0 16px">Nueva solicitud de contacto</h1>
      <p style="margin:0 0 8px"><strong>Nombre:</strong> ${escapeHtml(payload.name)}</p>
      <p style="margin:0 0 8px"><strong>Teléfono:</strong> ${escapeHtml(payload.phone)}</p>
      <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      ${vehicleLine}
      ${messageBlock}
      <p style="margin:24px 0 0">
        <a href="${adminUrl}/admin/leads" style="color:#8b7355">Ver en el panel →</a>
      </p>
    </div>
  `.trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendLeadAlertEmail(
  payload: LeadAlertPayload
): Promise<AlertResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_ALERT_EMAIL;
  const from =
    process.env.RESEND_FROM_EMAIL ?? 'AutoDemo <onboarding@resend.dev>';

  if (!apiKey || !to) {
    return { ok: false, skipped: true };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_SITE_URL;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Nuevo lead: ${payload.name}`,
        html: buildLeadAlertHtml(payload, siteUrl),
      }),
    });

    if (!response.ok) {
      console.error('Lead alert email failed:', await response.text());
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    console.error(
      'Lead alert email error:',
      error instanceof Error ? error.message : error
    );
    return { ok: false };
  }
}
