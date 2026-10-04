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
        <section className="principal-project" aria-labelledby="research-project-heading">
          <div className="section-heading">
            <div>
              <p className="english-section-title">Research Project</p>
              <h2 id="research-project-heading">{t('주요 연구사업')}</h2>
            </div>
          </div>
          <p className="project-program">{t('한국연구재단 글로벌인문사회 융합연구지원사업')}</p>
          <p className="project-role">{t('세부과제 3 연구책임자 · 손지연')}</p>
          <h3>
            {t('동아시아 지역연구 관점에서 본 사회적 고립의 사회문화적 서사와 의미구조 분석')}
          </h3>
          <p className="project-description">
            {t(
              '경희대학교 글로벌류큐·오키나와연구소는 이번 컨소시엄에서 동아시아 고립 서사와 의미구조 분석을 이끕니다. 전쟁과 질병, 국가폭력이 남긴 제주·대만·오키나와의 역사적 상흔을 구술사와 문헌·문화 자료를 통해 살피고, ‘한국형 사회적 처방 툴킷’ 개발과 정책 제언을 통해 단절된 사회적 연결망의 회복에 기여하고자 합니다.',
            )}
          </p>
        </section>
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
