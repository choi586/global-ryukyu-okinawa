'use client';
import { useEffect, useRef, useState } from 'react';

const links = [
  ['소개', '#about'],
  ['연구', '#research'],
  ['프로그램', '#programs'],
  ['아카이브·성과', '#archive'],
  ['연구진', '#people'],
];

export function ConsortiumNav() {
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
          href="#top"
          aria-label="글로벌류큐·오키나와연구소 사회적연결회복 사업 홈"
          onClick={() => setOpen(false)}
        >
          <img
            className="cs-brand-mark cs-brand-mark-light"
            src="/images/consortium/mark-white.png"
            width={800}
            height={358}
            alt=""
          />
          <img
            className="cs-brand-mark cs-brand-mark-dark"
            src="/images/consortium/mark-navy.png"
            width={800}
            height={358}
            alt=""
          />
          <span className="cs-brand-text">
            <strong>글로벌류큐·오키나와연구소</strong>
            <span>사회적연결회복 컨소시엄</span>
          </span>
        </a>
        <button
          ref={toggle}
          className="cs-nav-toggle"
          aria-expanded={open}
          aria-controls="cs-nav-links"
          onClick={() => setOpen(!open)}
        >
          {open ? '닫기' : '메뉴'}
        </button>
        <nav
          id="cs-nav-links"
          className={'cs-nav-links' + (open ? ' is-open' : '')}
          aria-label="사업단 메뉴"
        >
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="cs-nav-out" href="https://okinawa.khu.ac.kr/">
            연구소 홈 ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
