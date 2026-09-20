import { translate, type Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import Link from '@/components/localized-link';
import { NewsBoard } from '@/components/news-board';

export const metadata: Metadata = { title: '공지사항' };
export default function News({ locale = 'ko' }: { locale?: Locale } = {}) {
  const t = (text: string) => translate(locale, text);

  return (
    <>
      <div className="page-banner">
        <div className="shell">
          <p className="breadcrumb">
            <Link href="/">{t('홈')}</Link>
            {t(' / 공지사항')}
          </p>
          <p className="eyebrow">NOTICE</p>
          <h1>{t('공지사항')}</h1>
          <p>{t('연구소의 새로운 소식과 안내를 전합니다.')}</p>
        </div>
      </div>
      <section className="shell board-section">
        <NewsBoard />
      </section>
    </>
  );
}
