'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

export async function signInAdmin(
  formData: FormData
): Promise<{ error: string } | void> {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Correo y contraseña son obligatorios' };
  }

  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'unknown';
  const rate = checkRateLimit(`login:${ip}`, 10, 60_000);
  if (!rate.allowed) {
    return { error: 'Demasiados intentos. Espera un momento.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Credenciales incorrectas' };
  }

  const role = data.user?.app_metadata?.role;
  if (role !== 'admin') {
    await supabase.auth.signOut();
    return { error: 'No tienes permisos de administrador' };
  }

  redirect('/admin');
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
