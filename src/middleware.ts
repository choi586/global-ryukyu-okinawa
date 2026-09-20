import { NextResponse, type NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-site-locale', /^\/ja(?:\/|$)/.test(request.nextUrl.pathname) ? 'ja' : 'ko');
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ['/((?!api|_next|images|favicon.ico).*)'] };
