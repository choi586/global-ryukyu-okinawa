import type { Metadata } from 'next';
import type { Content } from '@/content/types';
import { asset, basePath } from '@/lib/base-path';

// Link previews (KakaoTalk, Slack, …) need absolute image URLs, so default to the public host.
const siteUrl = process.env.SITE_URL || 'https://okinawa.khu.ac.kr';
// Rename this file (not just replace it) when the preview changes: KakaoTalk caches images by URL.
const ogImage = asset('/images/consortium/og-logo.jpg');

// Page metadata per language; the two versions point at each other.
export function siteMetadata(c: Content): Metadata {
  const jaPublished = process.env.NEXT_PUBLIC_CONSORTIUM_JA === '1';
  const path = c.locale === 'ko' ? `${basePath}/` : `${basePath}/ja/`;
  const { title, description, siteName, ogLocale } = c.meta;
  return {
    ...(siteUrl
      ? {
          metadataBase: new URL(siteUrl),
          alternates: {
            canonical: path,
            // Only point at the Japanese page once it is published: until then
            // it does not exist, and search engines would record a 404.
            ...(jaPublished ? { languages: { ko: `${basePath}/`, ja: `${basePath}/ja/` } } : {}),
          },
        }
      : {}),
    // Korean is public; Japanese stays out of search until its translation is reviewed.
    robots:
      c.locale === 'ko' || jaPublished
        ? { index: true, follow: true }
        : { index: false, follow: false },
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      ...(siteUrl ? { url: path } : {}),
      siteName,
      type: 'website',
      locale: ogLocale,
      ...(siteUrl
        ? {
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(siteUrl ? { images: [ogImage] } : {}),
    },
    icons: {
      icon: asset('/images/consortium/icon.png'),
      apple: asset('/images/consortium/icon.png'),
    },
  };
}
