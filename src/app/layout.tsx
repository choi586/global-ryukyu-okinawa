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
export const metadata: Metadata = {
  title: {
    default: '글로벌류큐·오키나와연구소 | 경희대학교',
    template: '%s | 글로벌류큐·오키나와연구소',
  },
  description: '경희대학교 글로벌류큐·오키나와연구소의 공지사항과 연구 소식을 전합니다.',
  robots: { index: false, follow: false },
  icons: { icon: '/images/institute-logo.png' },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main">
          본문 바로가기
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
