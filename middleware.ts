import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Solo /admin — sesión auth + protección de rutas (menos invocaciones Edge)
export const config = {
  matcher: ['/admin/:path*'],
};
