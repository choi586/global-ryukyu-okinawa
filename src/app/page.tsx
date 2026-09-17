import Link from 'next/link';
import { publicNotices } from '@/lib/store';
import { NoticeList } from '@/components/notice-list';
import { institute } from '@/data/institute';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const notices = (await publicNotices()).slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="shell hero-inner">
          <div className="hero-kicker">
            <span className="line" /> KYUNG HEE UNIVERSITY
          </div>
          <div className="hero-layout">
            <div>
              <h1>
                글로벌류큐·
                <br />
                오키나와연구소
              </h1>
              <p className="hero-description">
                Global Institute for
                <br />
                Ryukyu and Okinawa Studies
              </p>
              <Link className="button light" href="/news">
                공지사항 <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="hero-type" aria-hidden="true">
              <span>Ryukyu</span>
              <span className="outline-type">&amp; Okinawa</span>
            </div>
          </div>
          <div className="hero-bottom">
            <span>GLOBAL INSTITUTE FOR RYUKYU AND OKINAWA STUDIES</span>
            <span>경희대학교</span>
          </div>
        </div>
      </section>
      <section className="shell intro-section">
        <div>
          <p className="english-section-title">About</p>
          <h2>연구소 소개</h2>
        </div>
        <div className="intro-copy">
          <blockquote>“{institute.mission}”</blockquote>
          <p>{institute.introduction}</p>
          <a className="source-link" href={institute.sourceUrl} target="_blank" rel="noreferrer">
            출처 · 경희대학교 비교문화연구소 내 연구소 소개 ↗
          </a>
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
          <p className="source-note">공식 소개 페이지의 연구소 비전 5개 항목을 요약했습니다.</p>
        </div>
      </section>
      <section className="shell news-section">
        <div className="section-heading">
          <div>
            <p className="english-section-title">Announcements</p>
            <h2>공지사항</h2>
          </div>
          <Link href="/news" className="text-link">
            전체 공지 보기 <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <NoticeList notices={notices} />
      </section>
    </>
  );
}
