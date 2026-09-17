import { isAdmin, sameOrigin } from '@/lib/auth';
import { InputError, writeNotice } from '@/lib/notice-write';
export async function POST(request: Request) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 403 });
  try {
    const notice = await writeNotice(request);
    return Response.json({ id: notice.id }, { status: 201 });
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
