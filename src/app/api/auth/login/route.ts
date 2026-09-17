import { configured, createSession, sameOrigin, validPassword } from '@/lib/auth';
import { consumeLoginAttempt } from '@/lib/store';
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 });
  if (!configured())
    return Response.json({ error: '관리자 계정 설정이 필요합니다.' }, { status: 503 });
  try {
    if (Number(request.headers.get('content-length') || 0) > 4096)
      return Response.json({ error: '입력 내용을 확인해주세요.' }, { status: 413 });
    if ((await consumeLoginAttempt()) > 15)
      return Response.json(
        { error: '로그인 시도가 많습니다. 15분 후 다시 시도해주세요.' },
        { status: 429 },
      );
    const { username, password } = await request.json();
    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !validPassword(username, password)
    )
      return Response.json({ error: '아이디 또는 비밀번호를 확인해주세요.' }, { status: 401 });
    await createSession();
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: '로그인 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 },
    );
  }
}
