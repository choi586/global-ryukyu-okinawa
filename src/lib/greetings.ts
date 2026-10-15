import 'server-only';
import { randomUUID } from 'node:crypto';
import { getRecord, saveFile, deleteFile, replaceVersionedRecord } from './store';
import { detectedType } from './notice-write';
import { InputError, MAX_FILE_BYTES, MAX_BATCH_BYTES } from './upload-policy';
import { uploadForm } from './upload-form';
import {
  defaultLaunchBanner,
  emptyGreetings,
  youtubeId,
  type Greetings,
  type Greeting,
} from './greeting-types';
import type { Attachment } from './types';
export class GreetingConflict extends Error {}
export async function getGreetings(): Promise<Greetings> {
  return (await getRecord<Greetings>('greetings', 'launch')) || emptyGreetings;
}
export function greetingFiles(data: Greetings) {
  return [data.poster, ...data.items.flatMap((i) => [i.document, i.preview])].filter(
    (f): f is Attachment => !!f,
  );
}
export async function writeGreetings(request: Request) {
  const form = await uploadForm(request);
  let input: Greetings;
  try {
    input = JSON.parse(String(form.get('config') || ''));
  } catch {
    throw new InputError('입력 내용을 확인해주세요.');
  }
  if (
    !input ||
    !Number.isSafeInteger(input.revision) ||
    input.revision < 0 ||
    !Array.isArray(input.items) ||
    input.items.length > 30
  )
    throw new InputError('축사는 최대 30개까지 등록할 수 있습니다.');
  const previous = await getGreetings();
  if (previous.revision !== input.revision)
    throw new GreetingConflict('다른 화면에서 수정되었습니다. 새로고침 후 다시 저장해주세요.');
  const prepared: { id: string; bytes: Buffer; type: string }[] = [];
  function text(value: unknown, max: number) {
    if (typeof value !== 'string' || !value.trim() || value.length > max)
      throw new InputError('성함과 소속·직함을 확인해주세요.');
    return value.trim();
  }
  async function file(key: string, old: Attachment | undefined, kind: 'image' | 'pdf') {
    const upload = form.get(key);
    if (!(upload instanceof File) || !upload.size) return old;
    if (upload.size > MAX_FILE_BYTES) throw new InputError('파일 하나는 3MB 이하여야 합니다.');
    const bytes = Buffer.from(await upload.arrayBuffer());
    const type = detectedType(bytes);
    if (!type || (kind === 'pdf' ? type !== 'application/pdf' : !type.startsWith('image/')))
      throw new InputError('PDF 또는 JPG·PNG·WEBP 파일 형식을 확인해주세요.');
    const id = randomUUID();
    prepared.push({ id, bytes, type });
    return {
      id,
      type,
      size: bytes.length,
      name: upload.name.replace(/[\r\n\x00-\x1f]/g, '').slice(0, 180),
      alt: '',
    };
  }
  const poster = await file('poster', previous.poster, 'image');
  const ids = new Set<string>();
  const items: Greeting[] = [];
  for (const item of input.items) {
    if (
      !item ||
      typeof item.id !== 'string' ||
      !/^[0-9a-f-]{36}$/.test(item.id) ||
      ids.has(item.id) ||
      typeof item.published !== 'boolean' ||
      !['pdf', 'youtube'].includes(item.kind)
    )
      throw new InputError('축사 목록을 확인해주세요.');
    ids.add(item.id);
    const old = previous.items.find((i) => i.id === item.id);
    const row: Greeting = {
      id: item.id,
      name: text(item.name, 80),
      affiliation: text(item.affiliation, 200),
      published: item.published,
      kind: item.kind,
      youtube: '',
    };
    if (row.kind === 'pdf') {
      row.document = await file('document-' + item.id, old?.document, 'pdf');
      row.preview = await file('preview-' + item.id, old?.preview, 'image');
      if (!row.document) throw new InputError('축사 PDF를 선택해주세요.');
    } else {
      if (typeof item.youtube !== 'string' || item.youtube.length > 500 || !youtubeId(item.youtube))
        throw new InputError('올바른 유튜브 영상 주소를 입력해주세요.');
      row.youtube = 'https://www.youtube.com/watch?v=' + youtubeId(item.youtube);
    }
    items.push(row);
  }
  if (prepared.reduce((sum, f) => sum + f.bytes.length, 0) > MAX_BATCH_BYTES)
    throw new InputError(
      '한 번에 새로 올리는 파일은 합계 3MB 이하여야 합니다. 나누어 저장해주세요.',
    );
  const rawBanner = input.banner ?? previous.banner ?? defaultLaunchBanner;
  const banner = {
    project: text(rawBanner.project, 240),
    title: text(rawBanner.title, 100),
    date: text(rawBanner.date, 100),
    venue: text(rawBanner.venue, 160),
    href: text(rawBanner.href, 500),
  };
  if (!/^\/(?!\/)[^\\\s]*$/.test(banner.href))
    throw new InputError('배너 링크는 /로 시작하는 내부 주소를 입력해주세요.');
  const result: Greetings = { revision: previous.revision + 1, poster, items, banner };
  const saved: string[] = [];
  try {
    for (const f of prepared) {
      await saveFile(f.id, f.bytes, f.type);
      saved.push(f.id);
    }
    if (!(await replaceVersionedRecord('greetings', 'launch', previous.revision, result)))
      throw new GreetingConflict('다른 화면에서 수정되었습니다. 새로고침 후 다시 저장해주세요.');
  } catch (e) {
    await Promise.allSettled(saved.map(deleteFile));
    throw e;
  }
  const retained = new Set(greetingFiles(result).map((f) => f.id));
  await Promise.allSettled(
    greetingFiles(previous)
      .filter((f) => !retained.has(f.id))
      .map((f) => deleteFile(f.id)),
  );
  return result;
}
