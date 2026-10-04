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
        <section className="project-block" aria-labelledby="methods-heading">
          <div className="section-heading">
            <h2 id="methods-heading">{t('연구 방법과 검증 체계')}</h2>
          </div>
          <p>
            {t('컨소시엄은 요인 규명부터 현장 검증과 정책 적용까지 연결하는 연구를 추진합니다.')}
          </p>
          <ol className="project-methods">
            <li>
              <span className="project-method-number" aria-hidden="true">
                01
              </span>
              <div>
                <h3>{t('요인 규명')}</h3>
                <p>
                  {t(
                    '심리·신경생물·사회·문화·보건 요인을 함께 탐색해 사회적 고립의 위험요인과 보호요인, 발생·지속 기제를 규명합니다.',
                  )}
                </p>
              </div>
            </li>
            <li>
              <span className="project-method-number" aria-hidden="true">
                02
              </span>
              <div>
                <h3>{t('측정·데이터 구축')}</h3>
                <p>
                  {t(
                    '다면적 측정·평가 체계와 공동 데이터베이스를 구축하고, 한·일 비교연구를 통해 척도를 검증합니다.',
                  )}
                </p>
              </div>
            </li>
            <li>
              <span className="project-method-number" aria-hidden="true">
                03
              </span>
              <div>
                <h3>{t('통합 분석')}</h3>
                <p>
                  {t(
                    '행정·패널 데이터로 질병부담과 건강불평등을 분석하고, 한·일 종단연구로 시간에 따른 고립의 유지 기제와 회복 과정을 추적합니다. 역사·문화적 서사 분석을 연결해 고립을 다층적으로 해석합니다.',
                  )}
                </p>
              </div>
            </li>
            <li>
              <span className="project-method-number" aria-hidden="true">
                04
              </span>
              <div>
                <h3>{t('현장 검증')}</h3>
                <p>
                  {t(
                    '협력기관에서 예방·개입 프로그램을 시범 적용하고, 효과성·실행 가능성·수용성을 검증해 모델을 정교화합니다.',
                  )}
                </p>
              </div>
            </li>
            <li>
              <span className="project-method-number" aria-hidden="true">
                05
              </span>
              <div>
                <h3>{t('정책 적용')}</h3>
                <p>
                  {t(
                    '검증 결과를 프로그램·매뉴얼·실무자 교육자료와 정책 제언으로 연결하고, 지역사회 서비스와 제도 설계를 지원합니다.',
                  )}
                </p>
              </div>
            </li>
          </ol>
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
          <div className="project-analysis">
            <h3>{t('데이터로 확장하는 인문·지역연구')}</h3>
            <p>
              {t(
                '연구소는 구술·문헌 자료의 맥락을 해석하는 질적 연구에 계산적 분석과 공간 분석을 결합할 계획입니다.',
              )}
            </p>
            <ul className="project-partners">
              <li>
                <h4>{t('구술·문헌 데이터셋')}</h4>
                <p>
                  {t(
                    '구술 생애사와 희귀 문헌, 문학·미디어 자료를 수집·정비하고, ‘고립·단절·폭력·연결’ 키워드와 의미망을 활용해 다국어 메타데이터를 구축합니다.',
                  )}
                </p>
              </li>
              <li>
                <h4>{t('텍스트마이닝·감성 분석')}</h4>
                <p>
                  {t(
                    'BERT 기반 토픽 모델링과 감성 분석을 활용해 고립 담론의 주제와 정서적 양상을 분석합니다.',
                  )}
                </p>
              </li>
              <li>
                <h4>{t('공간 분석·시각화')}</h4>
                <p>
                  {t(
                    'QGIS를 활용한 고립의 공간 지도화를 추진해 연구 결과를 공간적 관점에서 시각화합니다.',
                  )}
                </p>
              </li>
            </ul>
          </div>
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
