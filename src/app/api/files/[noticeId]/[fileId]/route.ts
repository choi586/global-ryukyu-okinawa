import { isAdmin } from '@/lib/auth';
import { getRecord, loadFile } from '@/lib/store';
import type { Notice } from '@/lib/types';
export async function GET(
  request: Request,
  { params }: { params: Promise<{ noticeId: string; fileId: string }> },
) {
  const { noticeId, fileId } = await params;
  const notice = await getRecord<Notice>('notices', noticeId);
  if (!notice || (notice.status !== 'published' && !(await isAdmin())))
    return new Response('Not found', { status: 404 });
  const file = notice.attachments.find((f) => f.id === fileId);
  if (!file) return new Response('Not found', { status: 404 });
  try {
    const bytes = await loadFile(file.id);
    const download =
      new URL(request.url).searchParams.has('download') || !file.type.startsWith('image/');
    return new Response(new Uint8Array(bytes), {
      headers: {
        'Content-Type': file.type,
        'Content-Length': String(bytes.length),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      },
    });
  } catch {
    return new Response('File unavailable', { status: 404 });
  }
}
