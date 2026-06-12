import { revalidatePath, revalidateTag } from 'next/cache';
import { VEHICLES_CACHE_TAG } from '@/config/site';

export async function revalidateCatalog() {
  revalidateTag(VEHICLES_CACHE_TAG);
  revalidatePath('/');
  revalidatePath('/catalogo');
}
