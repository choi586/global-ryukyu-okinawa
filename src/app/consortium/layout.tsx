import type { Metadata } from 'next';
import { ConsortiumNav } from '@/components/consortium-nav';

import './consortium.css';

const title = '사회적연결회복 컨소시엄 사업단 | 경희대학교 글로벌류큐·오키나와연구소';
const description =
  '고립을 읽다, 곁을 잇다. 제주·오키나와·대만 세 섬의 목소리로 사회적 고립의 역사와 의미를 읽고, 증언·번역·서사로 다시 잇는 동아시아 인문학 사업단입니다.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/consortium' },
  openGraph: {
    title,
    description,
    url: '/consortium',
    siteName: '사회적연결회복 컨소시엄 사업단',
    type: 'website',
    locale: 'ko_KR',
    images: [{ url: '/images/consortium/og.jpg', width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/consortium/og.jpg'],
  },
  icons: { icon: '/images/consortium/icon.png', apple: '/images/consortium/icon.png' },
};

export default function ConsortiumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cs">
      <ConsortiumNav />
      {children}
    </div>
  );
}
