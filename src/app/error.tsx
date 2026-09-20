'use client';
import { useLanguage } from '@/i18n/provider';

export default function ErrorPage({ reset }: { reset: () => void }) {
  const { locale, t } = useLanguage();

  return (
    <section className="shell empty-state standalone">
      <h1>{t('화면을 불러오지 못했습니다.')}</h1>
      <p>{t('잠시 후 다시 시도해주세요.')}</p>
      <button className="button" onClick={() => reset()}>
        {t('다시 시도')}
      </button>
    </section>
  );
}
