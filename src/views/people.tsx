import { translate, type Locale } from '@/i18n/config';
import Link from '@/components/localized-link';
import lead from '@/data/principal-investigator.json';
export const metadata = { title: '연구진 소개' };
export default function People({ locale = 'ko' }: { locale?: Locale } = {}) {
  const t = (text: string) => translate(locale, text);

  return (
    <>
      <div className="page-banner">
        <div className="shell">
          <p className="breadcrumb">
            <Link href="/">{t('홈')}</Link>
            {t(' / 연구진 소개')}
          </p>
          <p className="eyebrow">PEOPLE</p>
          <h1>{t('연구진 소개')}</h1>
        </div>
      </div>
      <section className="shell people-section">
        <div className="principal-profile">
          <div>
            <p className="eyebrow">{t('연구책임자')}</p>
            <h2>{t(lead.name)}</h2>
            <p>{t(lead.department)}</p>
          </div>
          <dl>
            <div>
              <dt>{t('연구분야')}</dt>
              <dd>{t(lead.field)}</dd>
            </div>
            <div>
              <dt>{t('연락처')}</dt>
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
              <h2>{t('주요업적')}</h2>
            </div>
          </div>
          {[
            { title: t('논문'), items: lead.papers },
            { title: t('저역서'), items: lead.books },
          ].map((group) => (
            <details key={group.title} open>
              <summary>
                {group.title}
                <span>
                  {group.items.length}
                  {t('건')}
                </span>
              </summary>
              <ul>
                {group.items.map((item, i) => (
                  <li key={i} lang="ko">
                    {item}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
