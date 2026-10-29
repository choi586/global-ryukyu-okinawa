import { countPublicSql, newsListSql, pageNumber } from '../src/lib/public-list';
import type { Greetings } from '../src/lib/greeting-types';
import type { Bindings } from '../src/lib/cloudflare-storage';
export default {
  async fetch(request: Request, env: Bindings, context: unknown) {
    const url = new URL(request.url);
    // Small discovery responses avoid loading the SSR bundle on Workers Free.
    const origin = 'https://okinawa.khu.ac.kr';
    const sitemapWhere =
      "namespace='notices' AND json_extract(data,'$.status')='published' AND COALESCE(json_extract(data,'$.category'),'news') IN ('news','activities','publications')";
    const xmlEscape = (value: string) =>
      value.replace(
        /[<>&"']/g,
        (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]!,
      );
    const xml = (body: string) =>
      new Response(
        request.method === 'HEAD' ? null : '<?xml version="1.0" encoding="UTF-8"?>' + body,
        {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=300',
          },
        },
      );
    if (['GET', 'HEAD'].includes(request.method)) {
      if (url.pathname === '/robots.txt')
        return new Response(
          request.method === 'HEAD'
            ? null
            : `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`,
          {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': 'public, max-age=300',
            },
          },
        );
      if (url.pathname === '/sitemap.xml') {
        const count = await env.DB.prepare(
          `SELECT COUNT(*) AS total FROM records WHERE ${sitemapWhere}`,
        ).first<{ total: number }>();
        const paths = [
          '/sitemaps/pages.xml',
          ...Array.from(
            { length: Math.ceil((count?.total || 0) / 200) },
            (_, i) => `/sitemaps/posts-${i + 1}.xml`,
          ),
        ];
        return xml(
          '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
            paths.map((path) => `<sitemap><loc>${origin}${path}</loc></sitemap>`).join('') +
            '</sitemapindex>',
        );
      }
      if (url.pathname === '/sitemaps/pages.xml') {
        const paths = [
          '',
          '/about',
          '/people',
          '/research',
          '/launch',
          '/news',
          '/activities',
          '/publications',
        ];
        return xml(
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
            paths
              .flatMap((path) => [path || '/', '/ja' + path])
              .map((path) => `<url><loc>${origin}${path}</loc></url>`)
              .join('') +
            '</urlset>',
        );
      }
      const match = /^\/sitemaps\/posts-([1-9]\d{0,5})\.xml$/.exec(url.pathname);
      if (match) {
        const { results } = await env.DB.prepare(
          `SELECT json_extract(data,'$.slug') AS slug, COALESCE(json_extract(data,'$.category'),'news') AS category FROM records WHERE ${sitemapWhere} ORDER BY id LIMIT 200 OFFSET ?`,
        )
          .bind((Number(match[1]) - 1) * 200)
          .all<{ slug: string; category: string }>();
        if (!results.length) return new Response('Not found', { status: 404 });
        return xml(
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
            results
              .flatMap((row) => {
                const path = `/${row.category}/${encodeURIComponent(row.slug)}`;
                return [path, '/ja' + path];
              })
              .map((path) => `<url><loc>${xmlEscape(origin + path)}</loc></url>`)
              .join('') +
            '</urlset>',
        );
      }
    }
    if (
      [
        '/news',
        '/about',
        '/people',
        '/research',
        '/launch',
        '/ja/launch',
        '/ja/research',
        '/ja/news',
        '/ja/about',
        '/ja/people',
      ].includes(url.pathname) &&
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
    // Public launch data avoids loading the application SSR bundle.
    if (
      ((url.pathname === '/api/greetings' && !url.searchParams.has('admin')) ||
        /^\/api\/greetings\/[0-9a-f-]{36}$/.test(url.pathname)) &&
      request.method === 'GET'
    ) {
      const row = await env.DB.prepare(
        "SELECT data FROM records WHERE namespace='greetings' AND id='launch'",
      ).first<{ data: string }>();
      const data: Greetings = row ? JSON.parse(row.data) : { revision: 0, items: [] };
      const items = data.items.filter((i) => i.published);
      if (url.pathname === '/api/greetings')
        return Response.json(
          { banner: data.banner, poster: data.poster, items },
          { headers: { 'Cache-Control': 'no-store' } },
        );
      const id = url.pathname.split('/').pop();
      const file = [data.poster, ...items.flatMap((i) => [i.document, i.preview])].find(
        (f) => f?.id === id,
      );
      if (file) {
        const object = await env.MEDIA.get(file.id);
        if (!object) return new Response('Not found', { status: 404 });
        const bytes = await object.arrayBuffer();
        return new Response(bytes, {
          headers: {
            'Content-Type': file.type,
            'Content-Length': String(bytes.byteLength),
            'Content-Disposition': `${url.searchParams.has('download') ? 'attachment' : 'inline'}; filename="greeting.${file.type === 'application/pdf' ? 'pdf' : 'image'}"; filename*=UTF-8''${encodeURIComponent(file.name)}`,
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }
      // Unpublished files still require the existing administrator session check.
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
