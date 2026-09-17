import Link from 'next/link';
import { publicPage } from '@/lib/store';
import { categories, type Category } from '@/lib/types';
import { ContentCards } from './content-cards';

export async function ContentBoard({
  category,
  page: requested,
}: {
  category: Category;
  page?: string;
}) {
  const { notices, total, page, pages } = await publicPage(category, requested, 9);
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
            전체 <strong>{total}</strong>건
          </span>
          <span>게시일 최신순</span>
        </div>
        <ContentCards notices={notices} />
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
