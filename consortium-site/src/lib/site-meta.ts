import type { Metadata } from 'next';
import type { Content } from '@/content/types';
import { asset, basePath } from '@/lib/base-path';

const siteUrl = process.env.SITE_URL;

// Page metadata per language; the two versions point at each other.
export function siteMetadata(c: Content): Metadata {
  const path = c.locale === 'ko' ? `${basePath}/` : `${basePath}/ja/`;
  const { title, description, siteName, ogLocale } = c.meta;
  return {
    ...(siteUrl
      ? {
          metadataBase: new URL(siteUrl),
          alternates: { canonical: path, languages: { ko: `${basePath}/`, ja: `${basePath}/ja/` } },
        }
      : {}),
    robots: { index: false, follow: false },
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
            images: [
              { url: asset('/images/consortium/og.jpg'), width: 1200, height: 630, alt: title },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(siteUrl ? { images: [asset('/images/consortium/og.jpg')] } : {}),
    },
    icons: {
      icon: asset('/images/consortium/icon.png'),
      apple: asset('/images/consortium/icon.png'),
    },
  };
}
