import { isAdmin } from '@/lib/auth';
import { getCarousel } from '@/lib/carousel';
import { loadFile } from '@/lib/store';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const slide = (await getCarousel()).slides.find((s) => s.image.id === id);
  if (!slide || (!slide.published && !(await isAdmin())))
    return new Response('Not found', { status: 404 });
  try {
    const bytes = await loadFile(id);
    return new Response(new Uint8Array(bytes), {
      headers: {
        'Content-Type': slide.image.type,
        'Content-Length': String(bytes.length),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
