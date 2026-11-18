import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site-footer';
import { TeamBlock } from '@/components/team-block';
import { ko } from '@/content/ko';
import { asset, basePath } from '@/lib/base-path';

const title = '연구진 · 소장 인사말 | 사회적연결회복 컨소시엄 사업단';
const description =
  '경희대학교 글로벌류큐·오키나와연구소장의 인사말과 동아시아 고립서사 연구팀의 연구진을 소개합니다.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${basePath}/people/` },
  openGraph: { title, description, url: `${basePath}/people/` },
};

export default function Page() {
  const greeting = ko.people.greeting!;
  return (
    <>
      <header className="cs-page-hero">
        <div className="cs-shell">
          <p className="cs-label cs-label-light">연구진</p>
          <h1>연구진</h1>
          <p className="cs-page-lead">소장 인사말과 동아시아 고립서사 연구팀을 소개합니다.</p>
        </div>
      </header>
      <section className="cs-section cs-page-body" aria-labelledby="cs-greeting-title">
        <div className="cs-shell">
          <div className="cs-greeting">
            <figure className="cs-greeting-photo">
              <img
                src={asset('/images/consortium/people/son-jiyeon.jpg')}
                width={178}
                height={216}
                alt={greeting.photoAlt}
              />
              <figcaption>
                <strong>{ko.people.leadName}</strong>
                {ko.people.leadLines[0]}
              </figcaption>
            </figure>
            <div className="cs-greeting-body">
              <p className="cs-card-type">{greeting.label}</p>
              <h2 id="cs-greeting-title">{greeting.title}</h2>
              {greeting.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              <p>{greeting.closing}</p>
              <p className="cs-greeting-sign">{greeting.signature}</p>
            </div>
          </div>
          <h2 className="cs-people-heading">연구진</h2>
          <TeamBlock c={ko} />
        </div>
      </section>
      <SiteFooter c={ko} />
    </>
  );
}
