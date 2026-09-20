import { translate, type Locale } from '@/i18n/config';
import Link from '@/components/localized-link';
import { HeroCarousel } from '@/components/hero-carousel';
import { publicSlides } from '@/lib/carousel';
import { publicPage } from '@/lib/store';
import { NoticeList } from '@/components/notice-list';
import { institute } from '@/data/institute';
import { ContentCards } from '@/components/content-cards';

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
    <>
      <HeroCarousel initialSlides={slides} />
      <section className="shell intro-section">
        <div>
          <p className="english-section-title">About</p>
          <h2>{t('연구소 소개')}</h2>
        </div>
        <div className="intro-copy">
          <blockquote>“{t(institute.mission)}”</blockquote>
          <p>{t(institute.introduction)}</p>
        </div>
      </section>
      <section className="research-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="english-section-title">Vision</p>
              <h2>{t('연구소 비전')}</h2>
            </div>
          </div>
          <div className="vision-grid">
            {institute.visions.map((vision) => (
              <div className="vision-card" key={vision.number}>
                <span className="research-number">{vision.number}</span>
                <div>
                  <h3>{t(vision.title)}</h3>
                  <p>{t(vision.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
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
    </>
  );
}
