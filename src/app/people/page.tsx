import Link from 'next/link';
import lead from '@/data/principal-investigator.json';
export const metadata = { title: '연구진 소개' };
export default function People() {
  return (
    <>
      <div className="page-banner">
        <div className="shell">
          <p className="breadcrumb">
            <Link href="/">홈</Link> / 연구진 소개
          </p>
          <p className="eyebrow">PEOPLE</p>
          <h1>연구진 소개</h1>
        </div>
      </div>
      <section className="shell people-section">
        <div className="principal-profile">
          <div>
            <p className="eyebrow">연구책임자</p>
            <h2>{lead.name}</h2>
            <p>{lead.department}</p>
          </div>
          <dl>
            <div>
              <dt>연구분야</dt>
              <dd>{lead.field}</dd>
            </div>
            <div>
              <dt>연락처</dt>
              <dd>
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="principal-work">
          <div className="section-heading">
            <div>
              <p className="english-section-title">Selected Works</p>
              <h2>주요업적</h2>
            </div>
          </div>
          {[
            { title: '논문', items: lead.papers },
            { title: '저역서', items: lead.books },
          ].map((group) => (
            <details key={group.title} open>
              <summary>
                {group.title}
                <span>{group.items.length}건</span>
              </summary>
              <ul>
                {group.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
