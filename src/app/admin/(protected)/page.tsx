import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { allNotices } from '@/lib/store';
import { dateLabel } from '@/lib/types';
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ result?: string; page?: string }>;
}) {
  await requireAdmin();
  const notices = await allNotices();
  const query = await searchParams;
  const count = notices.filter((n) => n.status === 'published').length;
  const pages = Math.max(1, Math.ceil(notices.length / 15));
  const page = Math.min(pages, Math.max(1, Math.floor(Number(query.page) || 1)));
  return (
    <>
      <div className="section-heading">
        <div>
          <p className="eyebrow">NOTICE MANAGEMENT</p>
          <h1>공지사항 관리</h1>
        </div>
        <Link className="button" href="/admin/notices/new">
          ＋ 새 공지 작성
        </Link>
      </div>
      {query.result === 'saved' && (
        <p className="success-message" role="status">
          공지사항을 저장했습니다.
        </p>
      )}
      {query.result === 'deleted' && (
        <p className="success-message" role="status">
          공지사항을 삭제했습니다.
        </p>
      )}
      <div className="admin-stats">
        <div>
          <span>전체 공지</span>
          <strong>{notices.length}</strong>
        </div>
        <div>
          <span>공개</span>
          <strong>{count}</strong>
        </div>
        <div>
          <span>초안</span>
          <strong>{notices.length - count}</strong>
        </div>
      </div>
      <div className="admin-board">
        <div className="admin-board-heading">
          <h2>게시물 목록</h2>
          <Link href="/news" className="text-link">
            공개 화면 보기 ↗
          </Link>
        </div>
        {notices.length === 0 ? (
          <div className="empty-state">
            <h3>첫 공지사항을 작성해보세요.</h3>
            <p>초안으로 저장하거나 바로 공개할 수 있습니다.</p>
            <Link href="/admin/notices/new" className="text-link">
              새 공지 작성 →
            </Link>
          </div>
        ) : (
          <div className="admin-notice-list">
            {notices.slice((page - 1) * 15, page * 15).map((n) => (
              <div key={n.id} className="admin-notice-row">
                <span className={n.status === 'published' ? 'badge published' : 'badge'}>
                  {n.status === 'published' ? '공개' : '초안'}
                </span>
                <div>
                  <Link className="notice-title" href={`/admin/notices/${n.id}/edit`}>
                    {n.pinned && <span className="pin-label">중요 </span>}
                    {n.title}
                  </Link>
                  <small className="admin-date">
                    {dateLabel(n.updatedAt)} 수정 · 첨부 {n.attachments.length}개
                  </small>
                </div>
                <Link className="small-button" href={`/admin/notices/${n.id}/edit`}>
                  수정
                </Link>
              </div>
            ))}
          </div>
        )}
        {pages > 1 && (
          <nav className="pagination" aria-label="관리 목록 페이지">
            {page > 1 && <Link href={`/admin?page=${page - 1}`}>이전</Link>}
            <span>
              {page} / {pages}
            </span>
            {page < pages && <Link href={`/admin?page=${page + 1}`}>다음</Link>}
          </nav>
        )}
      </div>
    </>
  );
}
