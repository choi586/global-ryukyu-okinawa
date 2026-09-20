'use client';
import { useLanguage } from '@/i18n/provider';
import { localePath } from '@/i18n/config';

import Link from '@/components/localized-link';
import { institute } from '@/data/institute';
export function Footer() {
  const { locale, t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div>
          <p className="eyebrow">{institute.englishName}</p>
          <strong>{t('글로벌류큐·오키나와연구소')}</strong>
          <address className="footer-contact">
            <p>{t('경기 용인시 기흥구 덕영대로 1732 경희대학교 외국어대학관 335호')}</p>
            <p>
              E-MAIL. <a href="mailto:okinawa@khu.ac.kr">okinawa@khu.ac.kr</a>
            </p>
          </address>
        </div>
        <div className="footer-links">
          <a href={localePath('/news', locale)}>{t('공지사항')}</a>
          <Link href="/admin">{t('관리자 로그인')}</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>
          © {new Date().getFullYear()} {institute.englishName}.
        </span>
      </div>
    </footer>
  );
}
