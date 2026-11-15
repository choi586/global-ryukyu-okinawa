import { translate, type Locale } from '@/i18n/config';
import Link from '@/components/localized-link';
import { publicSlides } from '@/lib/carousel';
import { publicPage } from '@/lib/store';
import { NoticeList } from '@/components/notice-list';
import { institute } from '@/data/institute';
import { ContentCards } from '@/components/content-cards';
import { HeroRipple } from '@/components/hero-ripple';
import { HeroMotionPlay } from '@/components/hero-motion-play';

export default async function Home({ locale = 'ko' }: { locale?: Locale } = {}) {
  const t = (text: string) => translate(locale, text);

  const [news, activities, publications, slides] = await Promise.all([
    publicPage('news', 1, 4),
    publicPage('activities', 1, 3),
    publicPage('publications', 1, 3),
    publicSlides(),
  ]);
  const notices = news.notices;
  return (
    <div className="institute-home">
      <section className="home-hero">
        <div className="shell home-hero-inner">
          <div className="home-hero-text">
            <p className="home-hero-label">
              Kyung Hee University · Global Institute for Ryukyu and Okinawa Studies
            </p>
            <h1>
              <span className="reveal-line">
                <span>{t('글로벌류큐·')}</span>
              </span>
              <span className="reveal-line">
                <span>{t('오키나와연구소')}</span>
              </span>
            </h1>
            <div className="home-hero-copy">
              <p className="home-hero-mission">{t(institute.mission)}</p>
              <p>{t(institute.introduction)}</p>
              <Link href="/about" className="home-hero-link">
                {locale === 'ja' ? '研究所紹介を見る' : '연구소 소개 보기'}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <HeroMotionPlay>
            <HeroRipple />
          </HeroMotionPlay>
        </div>
      </section>
      {slides.length > 0 && (
        <section className="shell home-highlights" aria-labelledby="home-highlights-title">
          <div className="section-heading">
            <div>
              <p className="english-section-title">Highlights</p>
              <h2 id="home-highlights-title">{t('주요 소식')}</h2>
            </div>
          </div>
          <div className={`highlight-grid count-${slides.length}`}>
            {slides.map((slide, i) => {
              const inner = (
                <>
                  <div className="highlight-media">
                    <img
                      src={`/api/carousel/${slide.image.id}`}
                      alt={slide.image.alt}
                      fetchPriority={i === 0 ? 'high' : 'auto'}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                  <div className="highlight-copy">
                    {slide.description && (
                      <p className="highlight-meta" lang="ko">
                        {slide.description}
                      </p>
                    )}
                    <h3 lang="ko">{slide.title}</h3>
                  </div>
                </>
              );
              return (
                <article
                  key={slide.id}
                  className={`highlight fit-${slide.fit}${i === 0 ? ' is-feature' : ''}`}
                >
                  {slide.href ? (
                    <Link className="highlight-link" href={slide.href}>
                      {inner}
                    </Link>
                  ) : (
                    <div className="highlight-link">{inner}</div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
      {(['activities', 'publications'] as const).map((category) => (
        <section className={`home-content-section ${category}`} key={category}>
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="english-section-title">
                  {category === 'activities' ? 'Activities' : 'Publications'}
                </p>
                <h2>{category === 'activities' ? t('학술활동') : t('연구·출판')}</h2>
              </div>
              <Link href={`/${category}`} className="text-link">
                {t('전체 보기 ↗')}
              </Link>
            </div>
            <ContentCards
              notices={(category === 'activities' ? activities : publications).notices}
            />
          </div>
        </section>
      ))}
      <section className="shell news-section">
        <div className="section-heading">
          <div>
            <p className="english-section-title">News</p>
            <h2>{t('공지사항')}</h2>
          </div>
          <a href={locale === 'ja' ? '/ja/news' : '/news'} className="text-link">
            {t('전체 공지 보기 ')}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <NoticeList notices={notices} />
      </section>
    </div>
  );
}
