import Link from '@/components/localized-link';
import { GreetingsList } from '@/components/greetings';
import type { Locale } from '@/i18n/config';
export const metadata = { title: '컨소시엄 출범식 · 축하 메시지' };
export default function Launch({ locale = 'ko' }: { locale?: Locale } = {}) {
  const ja = locale === 'ja';
  return (
    <>
      <div className="page-banner">
        <div className="shell">
          <p className="breadcrumb">
            <Link href="/">{ja ? 'ホーム' : '홈'}</Link>
            {ja ? ' / コンソーシアム発足式' : ' / 컨소시엄 출범식'}
          </p>
          <p className="eyebrow">CONSORTIUM LAUNCH</p>
          <h1>{ja ? 'コンソーシアム発足式' : '컨소시엄 출범식'}</h1>
        </div>
      </div>
      <div className="shell launch-page">
        <section className="launch-intro">
          <p className="eyebrow">
            {ja
              ? '韓国研究財団 グローバル人文社会融合研究支援事業'
              : '한국연구재단 글로벌인문사회 융합연구지원사업'}
          </p>
          <h2>
            {ja
              ? 'ライフステージ別の社会的孤立の理解と社会的つながりの回復に向けた融合研究'
              : '생애주기별 사회적 고립의 이해와 사회적 연결 회복을 위한 융합연구'}
          </h2>
          <p>
            {ja
              ? 'コンソーシアムの発足に寄せられたお祝いのメッセージをご紹介します。'
              : '컨소시엄의 출범을 맞아 보내주신 축하의 말씀을 함께 나눕니다.'}
          </p>
          <dl>
            <div>
              <dt>{ja ? '日時' : '일시'}</dt>
              <dd>{ja ? '2026年10月16日（金）16:00' : '2026년 10월 16일 (금) 오후 4시'}</dd>
            </div>
            <div>
              <dt>{ja ? '会場' : '장소'}</dt>
              <dd>
                {ja
                  ? '高麗大学校 ソウルキャンパス SK未来館 チェ・ジョンヒョンホール'
                  : '고려대학교 서울캠퍼스 SK미래관 최종현홀'}
              </dd>
            </div>
          </dl>
        </section>
        <GreetingsList locale={locale} />
      </div>
    </>
  );
}
