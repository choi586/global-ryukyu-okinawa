import { publicPage } from '@/lib/store';
export async function GET(request: Request) {
  return Response.json(await publicPage('news', new URL(request.url).searchParams.get('page')), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
