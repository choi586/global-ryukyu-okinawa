import type { Metadata } from 'next';
import { AudiobookList } from '@/components/audiobook-list';
import { SiteFooter } from '@/components/site-footer';
import { ko } from '@/content/ko';
import { audiobooks } from '@/data/media';
import { basePath } from '@/lib/base-path';

const title = '동아시아 고립 서사 오디오북 | 사회적연결회복 컨소시엄 사업단';
const description =
  '한국, 대만, 오키나와(일본)의 고립 서사를 목소리로 옮긴 오디오북을 모아 둔 곳입니다.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${basePath}/audiobook/` },
  openGraph: { title, description, url: `${basePath}/audiobook/` },
};

export default function Page() {
  return (
    <>
      <header className="cs-page-hero">
        <div className="cs-shell">
          <p className="cs-label cs-label-light">오디오북</p>
          <h1>동아시아 고립 서사 오디오북</h1>
          <p className="cs-page-lead">
            한국, 대만, 오키나와(일본). 세 지역의 고립 서사를 목소리로 옮겨 차례로 싣습니다.
          </p>
        </div>
      </header>
      <section className="cs-section cs-page-body" aria-label="오디오북 목록">
        <div className="cs-shell">
          <AudiobookList items={audiobooks} />
        </div>
      </section>
      <SiteFooter c={ko} />
    </>
  );
}
