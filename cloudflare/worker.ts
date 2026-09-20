import { countPublicSql, newsListSql, pageNumber } from '../src/lib/public-list';
import type { Bindings } from '../src/lib/cloudflare-storage';
export default {
  async fetch(request: Request, env: Bindings, context: unknown) {
    const url = new URL(request.url);
    if (
      ['/news', '/about', '/people', '/ja/news', '/ja/about', '/ja/people'].includes(
        url.pathname,
      ) &&
      ['GET', 'HEAD'].includes(request.method)
    ) {
      const asset = new URL(request.url);
      const rsc = request.headers.get('RSC') === '1';
      asset.pathname += rsc ? '.rsc' : '.html';
      asset.search = '';
      const response = await (
        env as Bindings & { ASSETS: { fetch(request: Request): Promise<Response> } }
      ).ASSETS.fetch(new Request(asset, { method: request.method }));
      const headers = new Headers(response.headers);
      headers.set('Content-Type', rsc ? 'text/x-component' : 'text/html; charset=utf-8');
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      headers.set('Vary', 'RSC');
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set(
        'Content-Security-Policy',
        "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
      );
      return new Response(response.body, { status: response.status, headers });
    }
    if (url.pathname === '/api/public/news' && request.method === 'GET') {
      const total = (await env.DB.prepare(countPublicSql).bind('news').first<{ total: number }>())!
        .total;
      const pages = Math.max(1, Math.ceil(total / 10)),
        page = pageNumber(url.searchParams.get('page'), pages);
      const { results } = await env.DB.prepare(newsListSql)
        .bind('news', 10, (page - 1) * 10)
        .all();
      return Response.json(
        { notices: results, total, page, pages },
        { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } },
      );
    }
    const modulePath = './framework.js';
    const { default: handler } = await import(modulePath);
    return handler.fetch(request, env, context);
  },
};
