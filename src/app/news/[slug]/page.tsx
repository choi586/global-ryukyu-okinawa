import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicNotices } from '@/lib/store';
import { dateLabel } from '@/lib/types';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
async function find(slug: string) {
  return (await publicNotices()).find((n) => n.slug === slug);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = await find((await params).slug);
  return { title: n?.title || '공지사항', description: n?.body.slice(0, 140) };
}
export default async function Detail({ params }: Props) {
  const notice = await find((await params).slug);
  if (!notice) notFound();
  return (
    <article className="shell detail-section">
      <p className="breadcrumb">
        <Link href="/">홈</Link> / <Link href="/news">공지사항</Link>
      </p>
      <header className="article-heading">
        <span className="badge burgundy">{notice.pinned ? '중요 공지' : '공지사항'}</span>
        <h1>{notice.title}</h1>
        <div className="article-meta">
          <span>글로벌류큐·오키나와연구소</span>
          <time dateTime={notice.publishedAt}>{dateLabel(notice.publishedAt)}</time>
        </div>
      </header>
      <div className="article-body">{notice.body}</div>
      {notice.attachments
        .filter((f) => f.type.startsWith('image/'))
        .map((f) => (
          <figure key={f.id} className="notice-image">
            <img src={`/api/files/${notice.id}/${f.id}`} alt={f.alt} />
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
        <Link href="/news" className="button secondary">
          ← 목록으로
        </Link>
      </div>
    </article>
  );
}
