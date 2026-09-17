import { endSession, sameOrigin } from '@/lib/auth';
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 });
  await endSession();
  return Response.json({ ok: true });
}
