import Link from 'next/link';
import { publicNotices } from '@/lib/store';
import { categories, type Category } from '@/lib/types';
import { ContentCards } from './content-cards';

export async function ContentBoard({
  category,
  page: requested,
}: {
  category: Category;
  page?: string;
}) {
  const all = await publicNotices(category);
  const pages = Math.max(1, Math.ceil(all.length / 9));
  const page = Math.min(pages, Math.max(1, Math.floor(Number(requested) || 1)));
  return (
    <>
      <div className="page-banner">
        <div className="shell">
          <p className="breadcrumb">
            <Link href="/">홈</Link> / {categories[category]}
          </p>
          <p className="eyebrow">{category.toUpperCase()}</p>
          <h1>{categories[category]}</h1>
        </div>
      </div>
      <section className="shell board-section">
        <div className="board-toolbar">
          <span>
            전체 <strong>{all.length}</strong>건
          </span>
          <span>게시일 최신순</span>
        </div>
        <ContentCards notices={all.slice((page - 1) * 9, page * 9)} />
        {pages > 1 && (
          <nav className="pagination" aria-label={`${categories[category]} 페이지`}>
            {page > 1 && <Link href={`/${category}?page=${page - 1}`}>이전</Link>}
            <span>
              {page} / {pages}
            </span>
            {page < pages && <Link href={`/${category}?page=${page + 1}`}>다음</Link>}
          </nav>
        )}
      </section>
    </>
  );
}
