import type { Metadata } from 'next';
import { ConferenceList } from '@/components/conference-list';
import { SiteFooter } from '@/components/site-footer';
import { ko } from '@/content/ko';
import { conferences } from '@/data/conferences';
import { basePath } from '@/lib/base-path';

const title = '학술대회 | 사회적연결회복 컨소시엄 사업단';
const description = '사업단이 열거나 함께한 국제학술대회, 심포지엄, 콜로키움, 워크숍의 기록입니다.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${basePath}/conference/` },
  openGraph: { title, description, url: `${basePath}/conference/` },
};

export default function Page() {
  return (
    <>
      <header className="cs-page-hero">
        <div className="cs-shell">
          <p className="cs-label cs-label-light">학술대회</p>
          <h1>학술대회</h1>
          <p className="cs-page-lead">
            국제학술대회, 심포지엄, 콜로키움, 워크숍. 사업단이 열거나 함께한 학술 행사를 차례로
            기록합니다.
          </p>
        </div>
      </header>
      <section className="cs-section cs-page-body" aria-label="학술대회 목록">
        <div className="cs-shell">
          <ConferenceList items={conferences} />
        </div>
      </section>
      <SiteFooter c={ko} />
    </>
  );
}
