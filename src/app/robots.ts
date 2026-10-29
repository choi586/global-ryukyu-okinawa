export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    sitemap: 'https://okinawa.khu.ac.kr/sitemap.xml',
  };
}
