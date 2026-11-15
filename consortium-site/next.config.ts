import type { NextConfig } from 'next';

// The site is served at https://okinawa.khu.ac.kr/consortium/ through the
// institute gateway, so every page and asset lives under this prefix.
export const basePath = '/consortium';

const config: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default config;
