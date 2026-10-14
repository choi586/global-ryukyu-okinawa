import { getGreetings, greetingFiles } from '@/lib/greetings';
import { isAdmin } from '@/lib/auth';
import { loadFile } from '@/lib/store';
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const data = await getGreetings();
  const publicData = { ...data, items: data.items.filter((i) => i.published) };
  let file = greetingFiles(publicData).find((f) => f.id === id);
  if (!file && (await isAdmin())) file = greetingFiles(data).find((f) => f.id === id);
  if (!file) return new Response('Not found', { status: 404 });
  try {
    const bytes = await loadFile(id);
    const download = new URL(request.url).searchParams.has('download');
    return new Response(new Uint8Array(bytes), {
      headers: {
        'Content-Type': file.type,
        'Content-Length': String(bytes.length),
        'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="greeting.${file.type === 'application/pdf' ? 'pdf' : 'image'}"; filename*=UTF-8''${encodeURIComponent(file.name)}`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
