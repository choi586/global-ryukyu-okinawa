import type { Metadata } from 'next';
import Link from 'next/link';
import { publicNotices } from '@/lib/store';
import { NoticeList } from '@/components/notice-list';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: '공지사항' };
export default async function News({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const all = await publicNotices();
  const pages = Math.max(1, Math.ceil(all.length / 10));
  const requested = Number((await searchParams).page) || 1;
  const page = Math.min(pages, Math.max(1, Math.floor(requested)));
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
        <div className="board-toolbar">
          <span>
            전체 <strong>{all.length}</strong>건
          </span>
          <span>최신순 · 중요 공지 우선</span>
        </div>
        <NoticeList notices={all.slice((page - 1) * 10, page * 10)} />
        {pages > 1 && (
          <nav className="pagination" aria-label="공지사항 페이지">
            {page > 1 && <Link href={`/news?page=${page - 1}`}>이전</Link>}
            <span aria-live="polite">
              {page} / {pages}
            </span>
            {page < pages && <Link href={`/news?page=${page + 1}`}>다음</Link>}
          </nav>
        )}
      </section>
    </>
  );
}
