import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsBoard } from '@/components/news-board';
export const dynamic = 'force-static';
export const metadata: Metadata = { title: '공지사항' };
export default function News() {
  return (
    <>
      <div className="page-banner">
        <div className="shell">
          <p className="breadcrumb">
            <Link href="/">홈</Link> / 공지사항
          </p>
          <p className="eyebrow">NOTICE</p>
          <h1>공지사항</h1>
          <p>연구소의 새로운 소식과 안내를 전합니다.</p>
        </div>
      </div>
      <section className="shell board-section">
        <NewsBoard />
      </section>
    </>
  );
}
