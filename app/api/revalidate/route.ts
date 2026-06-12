import { NextResponse } from 'next/server';
import { revalidateCatalog } from '@/lib/revalidate';

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await revalidateCatalog();
    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: 'Error al revalidar' }, { status: 500 });
  }
}
