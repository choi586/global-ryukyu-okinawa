import { InputError, MAX_BATCH_BYTES } from './upload-policy';
// Bound actual bytes, including requests without Content-Length.
export async function uploadForm(request: Request, batchLimit = MAX_BATCH_BYTES) {
  const limit = batchLimit + 1_000_000;
  if (Number(request.headers.get('content-length') || 0) > limit)
    throw new InputError('한 번에 올리는 파일의 총용량이 제한을 초과했습니다.');
  if (!request.body) throw new InputError('파일 요청을 확인해주세요.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new InputError('한 번에 올리는 파일의 총용량이 제한을 초과했습니다.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return await new Response(bytes, {
      headers: { 'Content-Type': request.headers.get('content-type') || '' },
    }).formData();
  } catch {
    throw new InputError('올바른 파일 업로드 요청이 아닙니다.');
  }
}
