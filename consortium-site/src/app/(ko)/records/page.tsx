import type { Metadata } from 'next';
import { RecordList } from '@/components/record-list';
import { SiteFooter } from '@/components/site-footer';
import { ko } from '@/content/ko';
import { activityRecords } from '@/data/media';
import { basePath } from '@/lib/base-path';

const title = '활동 기록 | 사회적연결회복 컨소시엄 사업단';
const description = '답사와 학술활동의 현장을 영상으로 기록해 쌓아 가는 곳입니다.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${basePath}/records/` },
  openGraph: { title, description, url: `${basePath}/records/` },
};

export default function Page() {
  return (
    <>
      <header className="cs-page-hero">
        <div className="cs-shell">
          <p className="cs-label cs-label-light">학술활동의 기록</p>
          <h1>활동 기록</h1>
          <p className="cs-page-lead">
            답사와 학술활동의 현장을 영상으로 남겨 차곡차곡 쌓아 갑니다.
          </p>
        </div>
      </header>
      <section className="cs-section cs-page-body" aria-label="활동 기록 목록">
        <div className="cs-shell">
          <RecordList items={activityRecords} />
        </div>
      </section>
      <SiteFooter c={ko} />
    </>
  );
}
