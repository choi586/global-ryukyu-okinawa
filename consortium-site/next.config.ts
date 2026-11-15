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
  // Japanese stays unpublished until its translation is reviewed:
  // set CONSORTIUM_JA=1 at build time to publish /consortium/ja/ and its link.
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_CONSORTIUM_JA: process.env.CONSORTIUM_JA ?? '' },
};
export default config;
