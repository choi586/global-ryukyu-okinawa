import { isAdmin, sameOrigin } from '@/lib/auth';
import { InputError, writeNotice } from '@/lib/notice-write';
import { deleteFile, getRecord, removeRecord } from '@/lib/store';
import type { Notice } from '@/lib/types';
type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, { params }: Context) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 403 });
  const notice = await getRecord<Notice>('notices', (await params).id);
  if (!notice) return Response.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
  try {
    const updated = await writeNotice(request, notice);
    return Response.json({ id: updated.id });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof InputError ? error.message : '저장하지 못했습니다. 다시 시도해주세요.',
      },
      { status: error instanceof InputError ? 400 : 500 },
    );
  }
}
export async function DELETE(request: Request, { params }: Context) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 403 });
  const notice = await getRecord<Notice>('notices', (await params).id);
  if (!notice) return Response.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
  await removeRecord('notices', notice.id);
  await Promise.allSettled(
    notice.attachments.flatMap((a) => [
      deleteFile(a.id),
      ...(a.thumbnail ? [deleteFile(a.thumbnail.id)] : []),
    ]),
  );
  return Response.json({ ok: true });
}
