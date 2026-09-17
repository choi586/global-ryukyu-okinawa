import 'server-only';
import { randomUUID } from 'node:crypto';
import { getRecord, saveFile, deleteFile, replaceVersionedRecord } from './store';
import { detectedType, InputError } from './notice-write';
import { MAX_FILE_BYTES, MAX_CAROUSEL_BATCH_BYTES } from './upload-policy';
import { uploadForm } from './upload-form';
import type { Carousel, Slide } from './carousel-types';
export async function getCarousel(): Promise<Carousel> {
  return (await getRecord<Carousel>('carousel', 'main')) || { revision: 0, slides: [] };
}
export async function publicSlides() {
  return (await getCarousel()).slides.filter((s) => s.published).slice(0, 5);
}
function text(value: unknown, max: number, required = false) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim()))
    throw new InputError('제목·설명·이미지 설명의 길이를 확인해주세요.');
  return value.trim();
}
function safeHref(value: unknown) {
  const href = text(value, 2000);
  if (!href) return '';
  if (href.startsWith('/') && !href.startsWith('//') && !/[\\\s]/.test(href)) return href;
  try {
    const url = new URL(href);
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href;
  } catch {}
  throw new InputError('링크는 /로 시작하는 내부 주소 또는 https:// 주소를 입력해주세요.');
}
export class ConflictError extends Error {}
export async function writeCarousel(request: Request) {
  const form = await uploadForm(request, MAX_CAROUSEL_BATCH_BYTES);
  let input: { revision: number; slides: Record<string, unknown>[] };
  try {
    input = JSON.parse(String(form.get('config') || ''));
  } catch {
    throw new InputError('캐러셀 설정을 확인해주세요.');
  }
  if (
    !Number.isSafeInteger(input?.revision) ||
    input.revision < 0 ||
    !Array.isArray(input.slides) ||
    input.slides.length > 15 ||
    input.slides.some((s) => !s || typeof s !== 'object' || Array.isArray(s))
  )
    throw new InputError('보관 가능한 사진은 최대 15장입니다.');
  if (input.slides.filter((s) => s.published === true).length > 5)
    throw new InputError('메인에 공개할 사진은 최대 5장입니다.');
  const previous = await getCarousel();
  if (input.revision !== previous.revision)
    throw new ConflictError('다른 화면에서 변경되었습니다. 새로고침 후 다시 저장해주세요.');
  const slides: Slide[] = [];
  const prepared: { id: string; bytes: Buffer; type: string }[] = [];
  const ids = new Set();
  for (const item of input.slides) {
    const id = text(item.id, 36, true);
    if (!/^[0-9a-f-]{36}$/.test(id) || ids.has(id))
      throw new InputError('사진 목록을 확인해주세요.');
    ids.add(id);
    const old = previous.slides.find((s) => s.id === id);
    const title = text(item.title, 140, true),
      description = text(item.description, 240),
      alt = text(item.alt, 300, true);
    const href = safeHref(item.href);
    if (typeof item.published !== 'boolean' || !['cover', 'contain'].includes(String(item.fit)))
      throw new InputError('사진 설정을 확인해주세요.');
    const upload = form.get(`image-${id}`);
    let image = old?.image;
    if (upload instanceof File && upload.size) {
      if (upload.size > MAX_FILE_BYTES)
        throw new InputError('사진 한 장은 최적화 후 3MB 이하여야 합니다.');
      const bytes = Buffer.from(await upload.arrayBuffer());
      const type = detectedType(bytes);
      if (!type?.startsWith('image/'))
        throw new InputError('JPG, PNG, WEBP 사진만 올릴 수 있습니다.');
      const imageId = randomUUID();
      image = {
        id: imageId,
        name: upload.name.replace(/[\r\n\x00-\x1f]/g, '').slice(0, 180),
        size: bytes.length,
        type,
        alt,
      };
      prepared.push({ id: imageId, bytes, type });
    }
    if (!image) throw new InputError('각 항목에 사진을 추가해주세요.');
    slides.push({
      id,
      title,
      description,
      href,
      published: item.published,
      fit: item.fit as Slide['fit'],
      image: { ...image, alt },
    });
  }
  if (prepared.reduce((sum, f) => sum + f.bytes.length, 0) > MAX_CAROUSEL_BATCH_BYTES)
    throw new InputError('한 번에 올리는 새 사진의 합계는 15MB 이하여야 합니다.');
  const saved: string[] = [];
  const result = { revision: previous.revision + 1, slides };
  try {
    for (const file of prepared) {
      await saveFile(file.id, file.bytes, file.type);
      saved.push(file.id);
    }
    if (!(await replaceVersionedRecord('carousel', 'main', previous.revision, result)))
      throw new ConflictError('다른 화면에서 변경되었습니다. 새로고침 후 다시 저장해주세요.');
  } catch (error) {
    await Promise.allSettled(saved.map(deleteFile));
    throw error;
  }
  const retained = new Set(slides.map((s) => s.image.id));
  await Promise.allSettled(
    previous.slides.filter((s) => !retained.has(s.image.id)).map((s) => deleteFile(s.image.id)),
  );
  return result;
}
