'use client';
import { useLanguage } from '@/i18n/provider';

import Link from '@/components/localized-link';
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
  const { locale, t } = useLanguage();

  if (!notices.length)
    return (
      <div className="empty-state">
        <span className="empty-mark" aria-hidden="true">
          —
        </span>
        <h3>{t('등록된 공지사항이 없습니다.')}</h3>
        <p>{t('연구소의 새로운 소식을 이곳에서 전하겠습니다.')}</p>
      </div>
    );
  return (
    <div className="notice-list">
      {notices.map((notice) => (
        <Link className="notice-row" href={`/news/${notice.slug}`} key={notice.id}>
          <span className={notice.pinned ? 'badge burgundy' : 'badge'}>
            {notice.pinned ? t('중요') : t('공지')}
          </span>
          <span className="notice-title" lang="ko">
            {notice.title}
            {notice.attachmentCount > 0 && (
              <small className="attachment-hint">
                {t('첨부')}
                {notice.attachmentCount}
              </small>
            )}
          </span>
          <time dateTime={notice.publishedAt}>{dateLabel(notice.publishedAt, locale)}</time>
          <span aria-hidden="true" className="row-arrow">
            ↗
          </span>
        </Link>
      ))}
    </div>
  );
}
