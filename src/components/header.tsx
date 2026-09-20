'use client';
import { useLanguage } from '@/i18n/provider';
import { localePath } from '@/i18n/config';

import Link from '@/components/localized-link';
import { UtilityBar } from './utility-bar';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
const items = [
  ['연구소 소개', 'about'],
  ['연구진 소개', 'people'],
  ['연구사업', 'research'],
  ['학술활동', 'activities'],
  ['연구성과', 'publications'],
  ['공지사항', 'news'],
  ['아카이브', 'archive'],
];
export function Header() {
  const { locale, t } = useLanguage();

  const pathname = usePathname().replace(/^\/ja(?=\/|$)/, '') || '/';
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  return (
    <header className="site-header">
      <UtilityBar />
      <div className="shell header-inner">
        <Link
          href="/"
          className="brand"
          aria-label={t('글로벌류큐·오키나와연구소 홈')}
          onClick={() => setOpen(false)}
        >
          <img
            className="institute-logo"
            src="/images/institute-logo.png"
            width={2144}
            height={865}
            alt={t(
              '글로벌류큐·오키나와연구소 · Kyung Hee University · Global Institute for Ryukyu and Okinawa Studies',
            )}
          />
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? t('닫기 ✕') : t('메뉴 ☰')}
        </button>
        <nav
          id="primary-nav"
          className={open ? 'primary-nav open' : 'primary-nav'}
          aria-label={t('주 메뉴')}
        >
          {items.map(([label, key]) =>
            key === 'news' ? (
              <a
                key={key}
                href={localePath('/news', locale)}
                aria-current={pathname === '/news' ? 'page' : undefined}
              >
                {t(label)}
              </a>
            ) : ['about', 'people', 'activities', 'publications'].includes(key) ? (
              <Link
                key={key}
                href={`/${key}`}
                aria-current={pathname.startsWith(`/${key}`) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {t(label)}
              </Link>
            ) : (
              <span key={key} className="nav-disabled" aria-disabled="true">
                {t(label)}
              </span>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
