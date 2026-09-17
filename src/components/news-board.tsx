'use client';
import { useEffect, useState } from 'react';
import { NoticeList } from './notice-list';
import type { NoticeSummary } from '@/lib/public-list';
type Result = { notices: NoticeSummary[]; total: number; page: number; pages: number };
export function NewsBoard() {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    const page = new URLSearchParams(location.search).get('page') || '1';
    fetch(`/api/public/news?page=${encodeURIComponent(page)}`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then(async (r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setResult)
      .catch((e) => {
        if (e.name !== 'AbortError') setError(true);
      });
    return () => controller.abort();
  }, [revision]);
  if (error)
    return (
      <div className="empty-state" role="alert">
        공지사항을 불러오지 못했습니다.{' '}
        <button className="button secondary" onClick={() => setRevision((v) => v + 1)}>
          다시 시도
        </button>
      </div>
    );
  if (!result)
    return (
      <p role="status" className="empty-state">
        공지사항을 불러오는 중입니다.
      </p>
    );
  return (
    <>
      <div className="board-toolbar">
        <span>
          전체 <strong>{result.total}</strong>건
        </span>
        <span>최신순 · 중요 공지 우선</span>
      </div>
      <NoticeList notices={result.notices} />
      {result.pages > 1 && (
        <nav className="pagination" aria-label="공지사항 페이지">
          {result.page > 1 && <a href={`/news?page=${result.page - 1}`}>이전</a>}
          <span aria-live="polite">
            {result.page} / {result.pages}
          </span>
          {result.page < result.pages && <a href={`/news?page=${result.page + 1}`}>다음</a>}
        </nav>
      )}
    </>
  );
}
