import { changePassword, isAdmin, sameOrigin } from '@/lib/auth';
import { consumeLoginAttempt } from '@/lib/store';
export async function POST(request: Request) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 403 });
  if ((await consumeLoginAttempt('password-change')) > 5)
    return Response.json({ error: '시도가 많습니다. 15분 후 다시 시도해주세요.' }, { status: 429 });
  try {
    const reader = request.body?.getReader();
    if (!reader) throw Error('body');
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 4096) {
          await reader.cancel();
          return Response.json({ error: '입력 내용이 너무 깁니다.' }, { status: 413 });
        }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const { currentPassword, newPassword, confirmation } = body;
    if (typeof currentPassword !== 'string' || currentPassword.length > 256 ||
        typeof newPassword !== 'string' || newPassword.length < 12 || newPassword.length > 256 ||
        confirmation !== newPassword)
      return Response.json({ error: '새 비밀번호는 12~256자로 입력하고, 확인란에도 동일하게 입력해주세요.' }, { status: 400 });
    const result = await changePassword(currentPassword, newPassword);
    if (result === 'incorrect') return Response.json({ error: '현재 비밀번호가 일치하지 않습니다.' }, { status: 400 });
    if (result === 'unchanged') return Response.json({ error: '현재와 다른 새 비밀번호를 입력해주세요.' }, { status: 400 });
    if (result === 'conflict') return Response.json({ error: '다른 요청에서 비밀번호가 변경됐습니다. 다시 로그인해주세요.' }, { status: 409 });
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: '변경하지 못했습니다. 입력 내용을 확인하거나 다시 로그인해주세요.' }, { status: 400 });
  }
}
