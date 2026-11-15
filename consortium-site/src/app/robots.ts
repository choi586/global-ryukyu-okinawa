export const dynamic = 'force-static';
// Served at /consortium/robots.txt, which crawlers do not read; the site-wide
// rules live in the institute's /robots.txt. Kept permissive to avoid confusion.
export default function robots() {
  return { rules: { userAgent: '*', allow: '/' } };
}
