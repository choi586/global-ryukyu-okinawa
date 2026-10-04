import { translate, type Locale } from '@/i18n/config';
import Link from '@/components/localized-link';
export const metadata = { title: '연구사업' };
export default function Research({ locale = 'ko' }: { locale?: Locale } = {}) {
  const t = (text: string) => translate(locale, text);
  return (
    <>
      <div className="page-banner">
        <div className="shell">
          <p className="breadcrumb">
            <Link href="/">{t('홈')}</Link>
            {t(' / 연구사업')}
          </p>
          <p className="eyebrow">RESEARCH</p>
          <h1>{t('연구사업')}</h1>
        </div>
      </div>
      <div className="shell project-page">
        <section className="project-overview" aria-labelledby="project-title">
          <p className="eyebrow">{t('2026 한국연구재단 글로벌인문사회융합연구지원사업')}</p>
          <h2 id="project-title">
            {t('생애주기별 사회적 고립의 이해와 사회적 연결 회복을 위한 융합연구')}
          </h2>
          <p className="project-duration">{t('연구기간 · 5년')}</p>
          <p>
            {t(
              '심리학·신경생물학·사회학·인문학·보건학을 연결해 사회적 고립의 원인과 지속 기제를 규명하고, 사회적 연결의 회복을 모색하는 공동연구입니다.',
            )}
          </p>
          <p>
            {t(
              '청소년부터 청년·중장년·노년까지 생애주기별 고립 경험을 다층적으로 분석하고, 측정·평가와 현장 실증, 국제 비교연구를 통해 예방·개입 모델을 개발합니다. 이를 지역사회 서비스와 정책으로 연결하는 전주기 연구를 추진합니다.',
            )}
          </p>
        </section>
        <section className="project-block" aria-labelledby="partners-heading">
          <div className="section-heading">
            <h2 id="partners-heading">{t('참여기관과 역할')}</h2>
          </div>
          <ul className="project-partners">
            <li>
              <h3>{t('고려대학교 KU마음건강연구소')}</h3>
              <p>{t('임상심리·정신건강, 측정·평가·예방·개입 총괄')}</p>
            </li>
            <li>
              <h3>{t('고려대학교 고령사회연구원')}</h3>
              <p>{t('보건역학·질병부담·건강불평등, 정책 근거 및 생애주기별 유형화')}</p>
            </li>
            <li className="project-partner-home">
              <h3>{t('경희대학교 글로벌류큐·오키나와연구소')}</h3>
              <p>{t('동아시아 인문·역사·문화, 고립·소외 서사 및 사회적 처방')}</p>
            </li>
            <li>
              <h3>{t('무사시노대학 인간과학연구소')}</h3>
              <p>{t('임상심리·히키코모리·국제비교, 한·일 종단연구 및 척도 검증')}</p>
            </li>
          </ul>
        </section>
        <section className="project-block" aria-labelledby="institute-project-heading">
          <div className="section-heading">
            <h2 id="institute-project-heading">{t('우리 연구소의 연구')}</h2>
          </div>
          <h3>
            {t('동아시아 지역연구 관점에서 본 사회적 고립의 사회문화적 서사와 의미구조 분석')}
          </h3>
          <p>
            {t(
              '연구소는 제주·대만·오키나와를 중심으로 전쟁과 질병, 국가폭력, 이주와 배제가 남긴 고립 경험을 연구합니다. 구술사와 심층면접, 희귀 사료 및 문학·미디어 분석에 텍스트마이닝과 공간 시각화 등 디지털 인문학 방법을 결합해 사회적 연결망이 단절되는 과정과 회복의 가능성을 살핍니다.',
            )}
          </p>
        </section>
        <section className="project-block" aria-labelledby="project-impact-heading">
          <div className="section-heading">
            <h2 id="project-impact-heading">{t('연구에서 현장과 정책으로')}</h2>
          </div>
          <p>
            {t(
              '수집한 자료를 ‘고립-연결 융합 데이터셋’으로 구축하고, 이를 바탕으로 서사 기반 사회적 처방 모델을 설계합니다. 컨소시엄의 공동연구와 연계해 ‘한국형 사회적 처방 툴킷’ 개발과 정책 제언을 추진하며, 연구 성과가 지역사회의 연결 회복에 기여하도록 합니다.',
            )}
          </p>
        </section>
      </div>
    </>
  );
}
