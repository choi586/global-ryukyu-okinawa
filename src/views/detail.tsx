import { translate, type Locale } from '@/i18n/config';
import { cache } from 'react';
import type { Metadata } from 'next';
import Link from '@/components/localized-link';
import { notFound } from 'next/navigation';
import { publicNoticeBySlug } from '@/lib/store';
import { dateLabel, categories, noticePath } from '@/lib/types';

type Props = { locale?: Locale; params: Promise<{ slug: string }> };
const find = cache(publicNoticeBySlug);
export async function generateMetadata({ params, locale = 'ko' }: Props): Promise<Metadata> {
  const t = (text: string) => translate(locale, text);
  const n = await find((await params).slug);
  return {
    title: n?.title || t('공지사항'),
    description: n?.body.slice(0, 140),
    ...(n ? { alternates: { canonical: noticePath(n) } } : {}),
  };
}
export default async function Detail({ params, locale = 'ko' }: Props) {
  const t = (text: string) => translate(locale, text);

  const notice = await find((await params).slug);
  if (!notice) notFound();
  const category = notice.category || 'news';
  const label = category === 'news' ? t('공지사항') : t(categories[category]);
  return (
    <article className="shell detail-section">
      <p className="breadcrumb">
        <Link href="/">{t('홈')}</Link> / <Link href={`/${category}`}>{label}</Link>
      </p>
      <header className="article-heading">
        <span className="badge burgundy">{notice.pinned ? t('중요 공지') : label}</span>
        <h1 lang="ko">{notice.title}</h1>
        <div className="article-meta">
          <span>{t('글로벌류큐·오키나와연구소')}</span>
          <span>{t('게시일')}</span>
          <time dateTime={notice.publishedAt}>{dateLabel(notice.publishedAt, locale)}</time>
        </div>
        {notice.eventDate && (
          <p className="article-event-date">
            {category === 'publications'
              ? t('발행일')
              : category === 'news'
                ? t('관련일')
                : t('행사일')}{' '}
            · {dateLabel(notice.eventDate, locale)}
          </p>
        )}
      </header>
      {locale === 'ja' && <p className="eyebrow">この記事は韓国語の原文で掲載しています。</p>}
      <div className="article-body" lang="ko">
        {notice.body}
      </div>
      {notice.attachments
        .filter((f) => f.type.startsWith('image/'))
        .map((f) => (
          <figure key={f.id} className="notice-image">
            <img
              src={`/api/files/${notice.id}/${f.id}`}
              alt={f.alt}
              width={f.width}
              height={f.height}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{f.alt}</figcaption>
          </figure>
        ))}
      {notice.attachments.length > 0 && (
        <section className="attachments">
          <h2>
            {t('첨부파일 ')}
            <span>{notice.attachments.length}</span>
          </h2>
          {notice.attachments.map((f) => (
            <a key={f.id} href={`/api/files/${notice.id}/${f.id}?download=1`} className="file-link">
              <span>{f.name}</span>
              <small>
                {(f.size / 1024).toFixed(0)}
                {t(' KB · 다운로드 ↓')}
              </small>
            </a>
          ))}
        </section>
      )}
      <div className="article-bottom">
        <Link href={`/${category}`} className="button secondary">
          {t('← 목록으로')}
        </Link>
      </div>
    </article>
  );
}
