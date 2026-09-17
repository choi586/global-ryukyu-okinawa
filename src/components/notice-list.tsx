import Link from 'next/link';
import type { NoticeSummary } from '@/lib/public-list';
import { dateLabel } from '@/lib/types';
export function NoticeList({
  notices,
}: {
  notices: Pick<
    NoticeSummary,
    'id' | 'slug' | 'title' | 'pinned' | 'publishedAt' | 'attachmentCount'
  >[];
}) {
  if (!notices.length)
    return (
      <div className="empty-state">
        <span className="empty-mark" aria-hidden="true">
          —
        </span>
        <h3>등록된 공지사항이 없습니다.</h3>
        <p>연구소의 새로운 소식을 이곳에서 전하겠습니다.</p>
      </div>
    );
  return (
    <div className="notice-list">
      {notices.map((notice) => (
        <Link className="notice-row" href={`/news/${notice.slug}`} key={notice.id}>
          <span className={notice.pinned ? 'badge burgundy' : 'badge'}>
            {notice.pinned ? '중요' : '공지'}
          </span>
          <span className="notice-title">
            {notice.title}
            {notice.attachmentCount > 0 && (
              <small className="attachment-hint">첨부 {notice.attachmentCount}</small>
            )}
          </span>
          <time dateTime={notice.publishedAt}>{dateLabel(notice.publishedAt)}</time>
          <span aria-hidden="true" className="row-arrow">
            ↗
          </span>
        </Link>
      ))}
    </div>
  );
}
