import Link from 'next/link';
import { HeroCarousel } from '@/components/hero-carousel';
import { publicSlides } from '@/lib/carousel';
import { publicNotices } from '@/lib/store';
import { NoticeList } from '@/components/notice-list';
import { institute } from '@/data/institute';
import { ContentCards } from '@/components/content-cards';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const [all, slides] = await Promise.all([publicNotices(), publicSlides()]);
  const notices = all.filter((n) => (n.category || 'news') === 'news').slice(0, 4);
  return (
    <>
      <HeroCarousel initialSlides={slides} />
      <section className="shell intro-section">
        <div>
          <p className="english-section-title">About</p>
          <h2>연구소 소개</h2>
        </div>
        <div className="intro-copy">
          <blockquote>“{institute.mission}”</blockquote>
          <p>{institute.introduction}</p>
        </div>
      </section>
      <section className="research-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="english-section-title">Vision</p>
              <h2>연구소 비전</h2>
            </div>
          </div>
          <div className="vision-grid">
            {institute.visions.map((vision) => (
              <div className="vision-card" key={vision.number}>
                <span className="research-number">{vision.number}</span>
                <div>
                  <h3>{vision.title}</h3>
                  <p>{vision.description}</p>
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
            <h2>공지사항</h2>
          </div>
          <Link href="/news" className="text-link">
            전체 공지 보기 <span aria-hidden="true">↗</span>
          </Link>
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
                <h2>{category === 'activities' ? '학술활동' : '연구·출판'}</h2>
              </div>
              <Link href={`/${category}`} className="text-link">
                전체 보기 ↗
              </Link>
            </div>
            <ContentCards notices={all.filter((n) => n.category === category).slice(0, 3)} />
          </div>
        </section>
      ))}
    </>
  );
}
