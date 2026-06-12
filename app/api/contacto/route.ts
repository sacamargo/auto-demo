import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { siteConfig } from '@/config/site';
import { createClient } from '@/lib/supabase/server';
import { getClientIp, checkRateLimit } from '@/lib/rate-limit';
import { sanitizeText } from '@/lib/sanitize';
import { contactSchema } from '@/lib/validations/contact';
import type { Database } from '@/types/database';

type LeadInsert = Database['public']['Tables']['leads']['Insert'];

const MAX_BODY_BYTES = 10_000;

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  if (process.env.NODE_ENV !== 'production') return true;

  const allowed = new URL(siteConfig.url).origin;
  if (origin && origin !== allowed) return false;
  if (referer && !referer.startsWith(allowed)) return false;
  if (!origin && !referer) return false;

  return true;
}

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: 'Solicitud no permitida' }, { status: 403 });
    }

    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Solicitud demasiado grande' }, { status: 413 });
    }

    const ip = getClientIp(request);
    const rate = checkRateLimit(`contact:${ip}`, 5, 60_000);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera un momento e intenta de nuevo.' },
        {
          status: 429,
          headers: rate.retryAfterMs
            ? { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) }
            : undefined,
        }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ?? 'Datos inválidos';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = parsed.data;

    let message = sanitizeText(data.message ?? '');
    if (data.vehicle_interest) {
      const interest = sanitizeText(data.vehicle_interest);
      message = message
        ? `Vehículo de interés: ${interest}\n\n${message}`
        : `Vehículo de interés: ${interest}`;
    }

    const supabase = await createClient();
    const lead: LeadInsert = {
      name: sanitizeText(data.name),
      phone: sanitizeText(data.phone),
      email: sanitizeText(data.email).toLowerCase(),
      message,
      vehicle_id: data.vehicle_id ?? null,
      privacy_accepted: true,
    };
    const { error } = await (supabase as SupabaseClient)
      .from('leads')
      .insert(lead);

    if (error) {
      console.error('Lead insert error:', error.message);
      return NextResponse.json(
        { error: 'No pudimos procesar tu solicitud. Intenta más tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Recibimos tu solicitud. Te contactaremos pronto.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Error interno. Intenta más tarde.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
}
