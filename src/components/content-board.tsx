import { translate, type Locale } from '@/i18n/config';
import Link from '@/components/localized-link';
import { publicPage } from '@/lib/store';
import { categories, type Category } from '@/lib/types';
import { ContentCards } from './content-cards';

export async function ContentBoard({
  category,
  page: requested,
  locale = 'ko',
}: {
  category: Category;
  locale?: Locale;
  page?: string;
}) {
  const t = (text: string) => translate(locale, text);

  const { notices, total, page, pages } = await publicPage(category, requested, 9);
  return (
    <>
      <div className="page-banner">
        <div className="shell">
          <p className="breadcrumb">
            <Link href="/">{t('홈')}</Link> / {t(categories[category])}
          </p>
          <p className="eyebrow">{category.toUpperCase()}</p>
          <h1>{t(categories[category])}</h1>
        </div>
      </div>
      <section className="shell board-section">
        <div className="board-toolbar">
          <span>
            {t('전체 ')}
            <strong>{total}</strong>
            {t('건')}
          </span>
          <span>{t('게시일 최신순')}</span>
        </div>
        <ContentCards notices={notices} />
        {pages > 1 && (
          <nav className="pagination" aria-label={`${t(categories[category])} 페이지`}>
            {page > 1 && <Link href={`/${category}?page=${page - 1}`}>{t('이전')}</Link>}
            <span>
              {page} / {pages}
            </span>
            {page < pages && <Link href={`/${category}?page=${page + 1}`}>{t('다음')}</Link>}
          </nav>
        )}
      </section>
    </>
  );
}
