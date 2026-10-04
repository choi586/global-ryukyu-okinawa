const upstreamOrigin = 'https://khu.ryukyu-okinawa.workers.dev';

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);
    const unsafe = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
    const origin = request.headers.get('Origin');
    // Validate the browser origin before adapting it for the existing backend.
    if (unsafe && origin !== incoming.origin) {
      return new Response('Forbidden', { status: 403 });
    }
    const upstream = new URL(incoming.pathname + incoming.search, upstreamOrigin);
    const headers = new Headers(request.headers);
    for (const name of ['Host', 'Forwarded', 'X-Forwarded-Host', 'X-Forwarded-Proto']) headers.delete(name);
    if (origin === incoming.origin) headers.set('Origin', upstreamOrigin);
    const referer = headers.get('Referer');
    if (referer) {
      try {
        const url = new URL(referer);
        if (url.origin === incoming.origin) headers.set('Referer', upstreamOrigin + url.pathname + url.search);
      } catch { headers.delete('Referer'); }
    }
    // Service binding: use the existing Worker without copying its code or data.
    const forwarded = new Request(upstream, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
      duplex: 'half',
    });
    const result = await env.INSTITUTE.fetch(forwarded);
    const response = new Response(result.body, result);
    const location = response.headers.get('Location');
    if (location) {
      const target = new URL(location, upstreamOrigin);
      if (target.origin === upstreamOrigin) {
        response.headers.set('Location', incoming.origin + target.pathname + target.search + target.hash);
      }
    }
    return response;
  },
};
