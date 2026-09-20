'use client';
import { useLanguage } from '@/i18n/provider';

import Link from '@/components/localized-link';
import { useEffect, useRef, useState } from 'react';
import type { Slide } from '@/lib/carousel-types';

export function HeroCarousel({ initialSlides }: { initialSlides: Slide[] }) {
  const { locale, t } = useLanguage();

  const [slides, setSlides] = useState(initialSlides);
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touch = useRef<number | null>(null);
  const paused = hover || keyboardFocus || manualPause || stopped || hidden || reduced;
  const current = Math.min(index, Math.max(0, slides.length - 1));
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(query.matches),
      visibility = () => setHidden(document.hidden);
    motion();
    visibility();
    query.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      query.removeEventListener('change', motion);
      document.removeEventListener('visibilitychange', visibility);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setTimeout(() => setIndex((current + 1) % slides.length), 5000);
    return () => clearTimeout(timer);
  }, [paused, current, slides.length]);
  // An already-open homepage also picks up administrator saves without a code deploy.
  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch('/api/carousel', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) return;
        const result = await response.json();
        if (Array.isArray(result.slides))
          setSlides((old) =>
            JSON.stringify(old) === JSON.stringify(result.slides) ? old : result.slides,
          );
      } catch {
        /* Keep the last successful presentation during a network interruption. */
      }
    };
    const timer = setInterval(refresh, 5000);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, []);
  function move(next: number) {
    setIndex((next + slides.length) % slides.length);
    setManualPause(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setManualPause(false), 10000);
  }
  if (!slides.length)
    return (
      <section className="hero">
        <div className="shell hero-inner">
          <p className="hero-kicker">KYUNG HEE UNIVERSITY</p>
          <h1>
            {t('글로벌류큐·')}
            <br />
            {t('오키나와연구소')}
          </h1>
          <p className="hero-description">Global Institute for Ryukyu and Okinawa Studies</p>
          <Link className="button light" href="/news">
            {t('공지사항 ↗')}
          </Link>
        </div>
      </section>
    );
  return (
    <section
      className="hero-carousel"
      data-autoplay={paused ? 'paused' : 'playing'}
      aria-roledescription={t('캐러셀')}
      aria-label={t('연구소 주요 소식')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible')) setKeyboardFocus(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false);
      }}
      onTouchStart={(event) => {
        touch.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touch.current !== null) {
          const delta = event.changedTouches[0].clientX - touch.current;
          if (Math.abs(delta) > 60) move(current + (delta < 0 ? 1 : -1));
          touch.current = null;
        }
      }}
    >
      <h1 className="visually-hidden">{t('글로벌류큐·오키나와연구소')}</h1>
      <div className="carousel-stage" aria-live={paused ? 'polite' : 'off'}>
        {slides.map((slide, i) => (
          <article
            key={slide.id}
            className={`carousel-slide ${i === current ? 'is-active' : ''} fit-${slide.fit}`}
            aria-hidden={i !== current}
            inert={i !== current}
            aria-roledescription={t('슬라이드')}
            aria-label={`${i + 1} / ${slides.length}`}
          >
            <div className="carousel-photo">
              <img
                src={`/api/carousel/${slide.image.id}`}
                alt={slide.image.alt}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                decoding="async"
              />
            </div>
            <div className="carousel-shade" />
            <div className="shell carousel-copy">
              <p className="carousel-kicker">KYUNG HEE UNIVERSITY · GLOBAL RYUKYU &amp; OKINAWA</p>
              {locale === 'ja' && (
                <p className="carousel-description">韓国語の原文で掲載しています。</p>
              )}
              <h2 lang="ko">{slide.title}</h2>
              <p className="carousel-description" lang="ko">
                {slide.description}
              </p>
              {slide.href && (
                <Link className="button light" href={slide.href}>
                  {t('자세히 보기 ')}
                  <span aria-hidden="true">↗</span>
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="shell carousel-controls">
        <div className="carousel-arrows">
          <button
            type="button"
            aria-label={t('이전 사진')}
            onClick={() => move(current - 1)}
            disabled={slides.length < 2}
          >
            〈
          </button>
          <button
            type="button"
            aria-label={t('다음 사진')}
            onClick={() => move(current + 1)}
            disabled={slides.length < 2}
          >
            〉
          </button>
        </div>
        <div className="carousel-dots" aria-label={t('사진 선택')}>
          {slides.map((s, i) => (
            <button
              type="button"
              key={s.id}
              aria-label={locale === 'ja' ? `${i + 1}枚目の写真を見る` : `${i + 1}번 사진 보기`}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => move(i)}
            >
              <span aria-hidden="true">{i === current ? '●' : '○'}</span>
            </button>
          ))}
        </div>
        <span className="carousel-count" aria-hidden="true">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
        {!reduced && (
          <button
            className="carousel-play"
            type="button"
            aria-label={stopped ? t('자동재생 시작') : t('자동재생 정지')}
            onClick={() => setStopped(!stopped)}
          >
            {stopped ? '▶' : 'Ⅱ'}
          </button>
        )}
      </div>
    </section>
  );
}
