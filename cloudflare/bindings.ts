import { env } from 'cloudflare:workers';
import type { Bindings } from '../src/lib/cloudflare-storage';
// Workers always use native D1/R2 bindings. Never fall back to ephemeral local files.
export async function cloudflareBindings(): Promise<Bindings> {
  const bindings = env as unknown as Bindings;
  if (!bindings.DB || !bindings.MEDIA)
    throw new Error('D1(DB) and R2(MEDIA) bindings are required.');
  return bindings;
}
