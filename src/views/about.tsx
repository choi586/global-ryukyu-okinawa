import { translate, type Locale } from '@/i18n/config';
import Link from '@/components/localized-link';
import { institute } from '@/data/institute';
export const metadata = { title: '연구소 소개' };
const paragraphs = [
  '동아시아에서 오키나와가 지니고 있는 위상은 상당히 문제적입니다. 오키나와는 일본제국주의를 거치면서 ‘제국’의 일원인 동시에 ‘제국’의 억압과 차별의 당사자였고, 제2차 세계대전 이후에는 미국이라는 새로운 ‘제국’의 질서가 구체적이고 현실적인 억압과 차별로 작동한 지역이었습니다.',
  '일본제국주의는 몰락했지만 그것이 동아시아에서 식민주의의 단절을 의미하는 것은 아니었습니다. 미국이라는 ‘제국’의 등장은 새로운 식민주의의 시작이었으며, 이러한 동아시아의 문제적 상황은 오키나와라는 구체적 지역에서 극명하게 드러나기 시작했습니다.',
  '일본 패전 이후 오키나와에 주둔하게 된 미군 기지는 이후 미국의 동아시아 지배 전략의 교두보로 활용되고 있으며, 한국전쟁과 베트남전쟁을 거치면서 오키나와와 미군 기지는 미국의 세계질서를 유지하는 상수로 작용하고 있습니다.',
  '이에 본 <글로벌류큐•오키나와연구센터>는 인문학을 기반으로 한 지역학을 지향하며, 서구, 비서구지역 연구자 및 오키나와 문인과 사상가로 구성된 인적 네트워크를 최대한 살려 연구의 질적 강화와 새로운 담론의 창출을 도모해 갈 것입니다.',
];

export default function About({ locale = 'ko' }: { locale?: Locale } = {}) {
  const t = (text: string) => translate(locale, text);

  return (
    <>
      <div className="page-banner">
        <div className="shell">
          <p className="breadcrumb">
            <Link href="/">{t('홈')}</Link>
            {t(' / 연구소 소개')}
          </p>
          <p className="eyebrow">ABOUT THE INSTITUTE</p>
          <h1>{t('연구소 소개')}</h1>
        </div>
      </div>
      <section className="shell institute-about">
        <div className="about-heading">
          <h2>{t(institute.mission)}</h2>
          <p>{t(institute.name)}</p>
        </div>
        <div className="about-prose">
          {paragraphs.map((p) => (
            <p key={p}>{t(p)}</p>
          ))}
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
          <ol className="about-visions">
            {institute.visions.map((v, i) => (
              <li key={v.number}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <p>{t(v.description)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
