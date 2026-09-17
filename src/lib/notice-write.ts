import 'server-only';
import { randomUUID } from 'node:crypto';
import type { Attachment, Notice } from './types';
import { categories, type Category } from './types';
import { deleteFile, putRecord, saveFile } from './store';
export class InputError extends Error {}
function detectedType(buffer: Buffer): string | null {
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    return 'image/png';
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return 'image/jpeg';
  if (buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP')
    return 'image/webp';
  if (buffer.subarray(0, 5).toString() === '%PDF-') return 'application/pdf';
  return null;
}
export async function writeNotice(request: Request, previous?: Notice) {
  if (Number(request.headers.get('content-length') || 0) > 3.5 * 1024 * 1024)
    throw new InputError('한 번에 업로드할 수 있는 파일 총용량은 3MB입니다.');
  const form = await request.formData();
  const title = String(form.get('title') || '').trim();
  const body = String(form.get('body') || '').trim();
  const status = String(form.get('status'));
  const category = String(form.get('category') || previous?.category || 'news');
  if (!Object.hasOwn(categories, category)) throw new InputError('게시 영역을 선택해주세요.');
  const eventDate = String(form.get('eventDate') ?? previous?.eventDate ?? '').trim();
  if (
    eventDate &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate) ||
      Number.isNaN(Date.parse(eventDate)) ||
      new Date(eventDate).toISOString().slice(0, 10) !== eventDate)
  )
    throw new InputError('올바른 행사일·발행일을 입력해주세요.');
  if (!title || title.length > 200) throw new InputError('제목을 1~200자로 입력해주세요.');
  if (!body || body.length > 50000) throw new InputError('본문을 1~50,000자로 입력해주세요.');
  if (status !== 'draft' && status !== 'published')
    throw new InputError('공개 상태를 선택해주세요.');
  const retained = new Set(form.getAll('retain').map(String));
  const attachments = (previous?.attachments || []).filter((a) => retained.has(a.id));
  const files = form.getAll('files').filter((v): v is File => v instanceof File && v.size > 0);
  if (files.length + attachments.length > 10)
    throw new InputError('첨부파일은 최대 10개까지 가능합니다.');
  if (files.reduce((sum, f) => sum + f.size, 0) > 3 * 1024 * 1024)
    throw new InputError('새 파일의 총용량은 3MB 이하여야 합니다.');
  const prepared: { meta: Attachment; bytes: Buffer }[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const bytes = Buffer.from(await file.arrayBuffer());
    const type = detectedType(bytes);
    if (!type) throw new InputError('JPG, PNG, WEBP 이미지와 PDF 파일만 업로드할 수 있습니다.');
    const alt = String(form.get(`alt-${i}`) || '').trim();
    if (type.startsWith('image/') && (!alt || alt.length > 300))
      throw new InputError('이미지 설명을 1~300자로 입력해주세요.');
    prepared.push({
      meta: {
        id: randomUUID(),
        name: file.name.replace(/[\r\n\x00-\x1f]/g, '').slice(0, 180) || 'attachment',
        type,
        size: file.size,
        alt,
      },
      bytes,
    });
  }
  const now = new Date().toISOString();
  const id = previous?.id || randomUUID();
  const notice: Notice = {
    id,
    slug: previous?.slug || id,
    title,
    body,
    status,
    pinned: form.get('pinned') === 'true',
    publishedAt: previous?.publishedAt || now,
    createdAt: previous?.createdAt || now,
    updatedAt: now,
    attachments: [...attachments, ...prepared.map((p) => p.meta)],
    category: category as Category,
    eventDate: eventDate || null,
    ...(previous?.sourceUrl
      ? { sourceUrl: previous.sourceUrl, sourceCategory: previous.sourceCategory }
      : {}),
  };
  if (previous?.status === 'draft' && status === 'published') notice.publishedAt = now;
  const saved: string[] = [];
  try {
    for (const item of prepared) {
      await saveFile(item.meta.id, item.bytes, item.meta.type);
      saved.push(item.meta.id);
    }
    await putRecord('notices', id, notice);
  } catch (error) {
    await Promise.allSettled(saved.map(deleteFile));
    throw error;
  }
  // The record is authoritative: detached files immediately stop being accessible.
  await Promise.allSettled(
    (previous?.attachments || [])
      .filter((a) => !retained.has(a.id))
      .flatMap((a) => [deleteFile(a.id), ...(a.thumbnail ? [deleteFile(a.thumbnail.id)] : [])]),
  );
  return notice;
}
