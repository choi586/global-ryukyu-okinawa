import { isAdmin, sameOrigin } from '@/lib/auth';
import { getGreetings, writeGreetings, GreetingConflict } from '@/lib/greetings';
import { InputError } from '@/lib/upload-policy';
export async function GET(request: Request) {
  const admin = new URL(request.url).searchParams.has('admin');
  if (admin && !(await isAdmin()))
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 403 });
  const data = await getGreetings();
  return Response.json(
    admin ? data : { poster: data.poster, items: data.items.filter((i) => i.published) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
export async function PUT(request: Request) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 403 });
  try {
    return Response.json(await writeGreetings(request), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return Response.json(
      {
        error:
          e instanceof InputError || e instanceof GreetingConflict
            ? e.message
            : '저장하지 못했습니다. 다시 시도해주세요.',
      },
      { status: e instanceof GreetingConflict ? 409 : e instanceof InputError ? 400 : 500 },
    );
  }
}
