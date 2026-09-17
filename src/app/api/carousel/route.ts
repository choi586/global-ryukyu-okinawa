import { isAdmin, sameOrigin } from '@/lib/auth';
import { getCarousel, publicSlides, writeCarousel, ConflictError } from '@/lib/carousel';
import { InputError } from '@/lib/notice-write';
export async function GET(request: Request) {
  const admin = new URL(request.url).searchParams.has('admin');
  if (admin && !(await isAdmin()))
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 403 });
  return Response.json(admin ? await getCarousel() : { slides: await publicSlides() }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
export async function PUT(request: Request) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 403 });
  try {
    return Response.json(await writeCarousel(request));
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof InputError || error instanceof ConflictError
            ? error.message
            : '저장하지 못했습니다. 다시 시도해주세요.',
      },
      { status: error instanceof ConflictError ? 409 : error instanceof InputError ? 400 : 500 },
    );
  }
}
