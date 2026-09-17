import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicNotices } from '@/lib/store';
import { dateLabel, categories, noticePath } from '@/lib/types';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
async function find(slug: string) {
  return (await publicNotices()).find((n) => n.slug === slug);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = await find((await params).slug);
  return {
    title: n?.title || '공지사항',
    description: n?.body.slice(0, 140),
    ...(n ? { alternates: { canonical: noticePath(n) } } : {}),
  };
}
export default async function Detail({ params }: Props) {
  const notice = await find((await params).slug);
  if (!notice) notFound();
  const category = notice.category || 'news';
  const label = category === 'news' ? '공지사항' : categories[category];
  return (
    <article className="shell detail-section">
      <p className="breadcrumb">
        <Link href="/">홈</Link> / <Link href={`/${category}`}>{label}</Link>
      </p>
      <header className="article-heading">
        <span className="badge burgundy">{notice.pinned ? '중요 공지' : label}</span>
        <h1>{notice.title}</h1>
        <div className="article-meta">
          <span>글로벌류큐·오키나와연구소</span>
          <span>게시일</span>
          <time dateTime={notice.publishedAt}>{dateLabel(notice.publishedAt)}</time>
        </div>
        {notice.eventDate && (
          <p className="article-event-date">
            {category === 'publications' ? '발행일' : category === 'news' ? '관련일' : '행사일'} ·{' '}
            {dateLabel(notice.eventDate)}
          </p>
        )}
      </header>
      <div className="article-body">{notice.body}</div>
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
            첨부파일 <span>{notice.attachments.length}</span>
          </h2>
          {notice.attachments.map((f) => (
            <a key={f.id} href={`/api/files/${notice.id}/${f.id}?download=1`} className="file-link">
              <span>{f.name}</span>
              <small>{(f.size / 1024).toFixed(0)} KB · 다운로드 ↓</small>
            </a>
          ))}
        </section>
      )}
      <div className="article-bottom">
        <Link href={`/${category}`} className="button secondary">
          ← 목록으로
        </Link>
      </div>
    </article>
  );
}
