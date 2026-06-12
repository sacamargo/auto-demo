import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env';

export async function createClient(
  cookieStore?: Awaited<ReturnType<typeof cookies>>
) {
  const store = cookieStore ?? (await cookies());

  return createServerClient<Database>(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              store.set(name, value, options)
            );
          } catch {
            // Server Component — middleware refreshes sessions
          }
        },
      },
    }
  );
}
