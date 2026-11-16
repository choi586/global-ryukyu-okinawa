'use client';
import { useEffect, useRef, useState } from 'react';
import { asset, basePath } from '@/lib/base-path';
import type { Content } from '@/content/types';

export function ConsortiumNav({ c }: { c: Content }) {
  const { ui, nav: links } = c;
  const otherHref = c.locale === 'ko' ? `${basePath}/ja/` : `${basePath}/`;
  const instituteHref =
    c.locale === 'ko' ? 'https://okinawa.khu.ac.kr/' : 'https://okinawa.khu.ac.kr/ja';
  // Menu entries are '#section' (on the home page) or '/page/' (a sub-page).
  // Both become full paths so the same menu works wherever it is shown.
  const homeHref = c.locale === 'ko' ? `${basePath}/` : `${basePath}/ja/`;
  const resolve = (href: string) => (href.startsWith('#') ? homeHref + href : asset(href));
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  // Sections fade in as they enter the viewport; without JS they stay visible.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.querySelector('.cs');
    if (!root) return;
    const targets = Array.from(root.querySelectorAll('.cs-reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    root.classList.add('cs-animate');
    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      root.classList.remove('cs-animate');
    };
  }, []);

  return (
    <header className={'cs-nav' + (solid || open ? ' is-solid' : '')}>
      <div className="cs-shell cs-nav-inner">
        <a
          className="cs-brand"
          href={homeHref}
          aria-label={ui.brandAria}
          onClick={() => setOpen(false)}
        >
          <img
            className="cs-brand-mark cs-brand-mark-light"
            src={asset('/images/consortium/mark-white.png')}
            width={800}
            height={358}
            alt=""
          />
          <img
            className="cs-brand-mark cs-brand-mark-dark"
            src={asset('/images/consortium/mark-navy.png')}
            width={800}
            height={358}
            alt=""
          />
          <span className="cs-brand-text">
            <strong>{ui.brandName}</strong>
            <span>{ui.brandSub}</span>
          </span>
        </a>
        <button
          ref={toggle}
          className="cs-nav-toggle"
          aria-expanded={open}
          aria-controls="cs-nav-links"
          onClick={() => setOpen(!open)}
        >
          {open ? ui.close : ui.menu}
        </button>
        <nav
          id="cs-nav-links"
          className={'cs-nav-links' + (open ? ' is-open' : '')}
          aria-label={ui.navLabel}
        >
          {links.map(([label, href]) => (
            <a key={href} href={resolve(href)} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          {process.env.NEXT_PUBLIC_CONSORTIUM_JA === '1' && (
            <a
              className="cs-nav-lang"
              href={otherHref}
              hrefLang={c.locale === 'ko' ? 'ja' : 'ko'}
              lang={c.locale === 'ko' ? 'ja' : 'ko'}
              aria-label={ui.otherLanguage.aria}
            >
              {ui.otherLanguage.label}
            </a>
          )}
          <a className="cs-nav-out" href={instituteHref}>
            {ui.instituteHome}
          </a>
        </nav>
      </div>
    </header>
  );
}
