'use client';
import { useLanguage } from '@/i18n/provider';

import Link from '@/components/localized-link';
export default function NotFound() {
  const { locale, t } = useLanguage();

  return (
    <section className="shell empty-state standalone">
      <p className="eyebrow">404</p>
      <h1>{t('페이지를 찾을 수 없습니다.')}</h1>
      <p>{t('주소가 변경되었거나 공개되지 않은 페이지입니다.')}</p>
      <Link className="button" href="/news">
        {t('공지사항으로 이동')}
      </Link>
    </section>
  );
}
