import Link from '@/components/localized-link';
import { YoutubeEmbed } from '@/components/youtube-embed';
import { jointResearchVideos } from '@/data/archive-videos';
import { pageDescriptions } from '@/data/seo';
import type { Locale } from '@/i18n/config';

export const metadata = {
  alternates: { canonical: '/archive', languages: { ko: '/archive', ja: '/ja/archive' } },
  title: '아카이브',
  description: pageDescriptions.ko.archive,
};

const kindsJa: Record<string, string> = {
  심포지엄: 'シンポジウム',
  답사: '踏査',
  콜로키움: 'コロキウム',
};
const placesJa: Record<string, string> = { 제주: '済州', 오키나와: '沖縄', 대만: '台湾' };

export default function Archive({ locale = 'ko' }: { locale?: Locale } = {}) {
  const ja = locale === 'ja';
  return (
    <>
      <div className="page-banner">
        <div className="shell">
          <p className="breadcrumb">
            <Link href="/">{ja ? 'ホーム' : '홈'}</Link>
            {ja ? ' / アーカイブ' : ' / 아카이브'}
          </p>
          <p className="eyebrow">ARCHIVE</p>
          <h1>{ja ? 'アーカイブ' : '아카이브'}</h1>
        </div>
      </div>
      <div className="shell archive-page">
        <nav className="archive-tabs" aria-label={ja ? 'アーカイブの区分' : '아카이브 구분'}>
          <span className="archive-tab current" aria-current="page">
            {ja ? '一般共同研究' : '일반공동연구'}
          </span>
          {/* The consortium's videos live on its own site, so they are kept in one place only. */}
          <a className="archive-tab" href="/consortium/records/">
            {ja ? '孤立コンソーシアム ↗' : '고립컨소시엄 ↗'}
          </a>
        </nav>
        {jointResearchVideos.length ? (
          <ul className="archive-videos">
            {jointResearchVideos.map((video) => {
              const title = (ja && video.titleJa) || video.title;
              const kind = ja ? (kindsJa[video.kind] ?? video.kind) : video.kind;
              const place =
                video.place && ja ? (placesJa[video.place] ?? video.place) : video.place;
              return (
                <li key={video.youtube}>
                  <YoutubeEmbed
                    url={video.youtube}
                    title={title}
                    vertical={video.vertical}
                    thumb={video.thumb}
                    playLabel={ja ? '再生' : '재생'}
                  />
                  <p className="archive-video-meta">
                    {[kind, place, video.date].filter(Boolean).join(' · ')}
                  </p>
                  <h2>{title}</h2>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="archive-empty">
            {ja ? '映像を準備しています。' : '영상을 준비하고 있습니다.'}
          </p>
        )}
      </div>
    </>
  );
}
