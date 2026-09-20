import { requestLocale } from '@/i18n/server';
import { translate } from '@/i18n/config';
import { LanguageProvider } from '@/i18n/provider';
import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-700.css';
import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/500.css';
import '@fontsource/noto-sans-kr/700.css';
import '@fontsource/merriweather/latin-400.css';

import './globals.css';

const baseMetadata: Metadata = {
  metadataBase: new URL('https://khu.ryukyu-okinawa.workers.dev'),

  title: {
    default: '글로벌류큐·오키나와연구소 | 경희대학교',
    template: '%s | 글로벌류큐·오키나와연구소',
  },

  description: '경희대학교 글로벌류큐·오키나와연구소의 공지사항과 연구 소식을 전합니다.',

  openGraph: {
    title: '글로벌류큐·오키나와연구소 | 경희대학교',
    description: '경희대학교 글로벌류큐·오키나와연구소의 공지사항과 연구 소식을 전합니다.',
    url: 'https://khu.ryukyu-okinawa.workers.dev',
    siteName: '글로벌류큐·오키나와연구소',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: '경희대학교 글로벌류큐·오키나와연구소',
      },
    ],
    type: 'website',
    locale: 'ko_KR',
  },

  twitter: {
    card: 'summary_large_image',
    title: '글로벌류큐·오키나와연구소 | 경희대학교',
    description: '경희대학교 글로벌류큐·오키나와연구소의 공지사항과 연구 소식을 전합니다.',
    images: ['/images/og-image.png'],
  },

  robots: {
    index: false,
    follow: false,
  },

  icons: {
    icon: {
      url: '/images/institute-mark.png',
      type: 'image/png',
    },
    apple: '/images/institute-mark.png',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  if (locale === 'ko') return baseMetadata;
  const title = 'グローバル琉球・沖縄研究所 | 慶熙大学校';
  const description =
    '慶熙大学校グローバル琉球・沖縄研究所のお知らせと研究に関する最新情報をお届けします。';
  return {
    ...baseMetadata,
    title: { default: title, template: '%s | グローバル琉球・沖縄研究所' },
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      siteName: 'グローバル琉球・沖縄研究所',
      locale: 'ja_JP',
      url: '/ja',
    },
    twitter: { ...baseMetadata.twitter, title, description },
  };
}
export default async function Layout({ children }: { children: React.ReactNode }) {
  const locale = await requestLocale();
  return (
    <html lang={locale}>
      <body>
        <LanguageProvider locale={locale}>
          <a className="skip-link" href="#main">
            {translate(locale, '본문 바로가기')}
          </a>

          <Header />

          <main id="main">{children}</main>

          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
