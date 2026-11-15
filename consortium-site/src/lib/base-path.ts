// Plain <img>, <video> and metadata URLs are not rewritten by Next.js, so
// they add the site prefix themselves.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (path: string) => `${basePath}${path}`;
