import Link from 'next/link';
import type { NoticeSummary } from '@/lib/public-list';
import { dateLabel, noticePath } from '@/lib/types';

export function ContentCards({ notices }: { notices: NoticeSummary[] }) {
  if (!notices.length) return <p className="empty-state">등록된 자료가 없습니다.</p>;
  return (
    <div className="content-grid">
      {notices.map((notice) => {
        const picture = notice.picture;
        return (
          <Link className="content-card" href={noticePath(notice)} key={notice.id}>
            <div className="content-card-media">
              {picture ? (
                <img
                  src={`/api/files/${notice.id}/${picture.id}${picture.thumbnail ? '?thumbnail=1' : ''}`}
                  alt={picture.alt}
                  loading="lazy"
                  decoding="async"
                  width={picture.thumbnail?.width || picture.width}
                  height={picture.thumbnail?.height || picture.height}
                />
              ) : (
                <div className="publication-cover">
                  <span>KYUNG HEE UNIVERSITY</span>
                  <strong>
                    {notice.sourceCategory?.includes('Japanological')
                      ? 'A Collection of\nJapanological Studies'
                      : 'Global Ryukyu\n& Okinawa Studies'}
                  </strong>
                  <span>
                    {notice.category === 'publications' ? 'PUBLICATIONS' : 'RESEARCH & ACTIVITIES'}
                  </span>
                </div>
              )}
            </div>
            <div className="content-card-copy">
              <p className="content-card-date">
                {notice.eventDate
                  ? notice.category === 'publications'
                    ? '발행일 '
                    : '행사일 '
                  : '게시일 '}
                <time dateTime={notice.eventDate || notice.publishedAt}>
                  {dateLabel(notice.eventDate || notice.publishedAt)}
                </time>
              </p>
              <h3>{notice.title}</h3>
              <p className="content-card-description">
                {notice.body
                  .split(/\n+/)
                  .filter((line) => line.trim() && !/^https?:\/\//.test(line.trim()))
                  .join(' ')}
              </p>
              <span className="content-card-more">자세히 보기 ↗</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
