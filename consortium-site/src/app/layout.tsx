import type { Metadata } from 'next';
import { ConsortiumNav } from '@/components/consortium-nav';

import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/500.css';
import '@fontsource/noto-sans-kr/700.css';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import './globals.css';
import './consortium.css';

const siteUrl = process.env.SITE_URL;

const title = '사회적연결회복 컨소시엄 사업단 | 경희대학교 글로벌류큐·오키나와연구소';
const description =
  '고립을 읽다, 곁을 잇다. 제주·오키나와·대만 세 섬의 목소리로 사회적 고립의 역사와 의미를 읽고, 증언·번역·서사로 다시 잇는 동아시아 인문학 사업단입니다.';

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: '/' } } : {}),
  robots: { index: false, follow: false },
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    ...(siteUrl ? { url: '/' } : {}),
    siteName: '사회적연결회복 컨소시엄 사업단',
    type: 'website',
    locale: 'ko_KR',
    ...(siteUrl ? { images: [{ url: '/images/consortium/og.jpg', width: 1200, height: 630, alt: title }] } : {}),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    ...(siteUrl ? { images: ['/images/consortium/og.jpg'] } : {}),
  },
  icons: { icon: '/images/consortium/icon.png', apple: '/images/consortium/icon.png' },
};

export default function ConsortiumLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko"><body><div className="cs">
      <a className="skip-link" href="#main">본문 바로가기</a>
      <ConsortiumNav />
      <main id="main">{children}</main>
    </div></body></html>
  );
}
