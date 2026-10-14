'use client';
import { useEffect, useState } from 'react';
import { type Greetings, youtubeId } from '@/lib/greeting-types';
export function GreetingsList({ locale = 'ko' }: { locale?: 'ko' | 'ja' }) {
  const ja = locale === 'ja';
  const [data, setData] = useState<Greetings | null>(null);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState<string[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/greetings', { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setData)
      .catch((e) => {
        if (e.name !== 'AbortError') setError(true);
      });
    return () => controller.abort();
  }, []);
  if (error)
    return (
      <p role="alert">
        {ja
          ? '読み込めませんでした。ページを再読み込みしてください。'
          : '불러오지 못했습니다. 새로고침해주세요.'}
      </p>
    );
  if (!data) return <p role="status">{ja ? '読み込み中…' : '불러오는 중…'}</p>;
  return (
    <>
      {data.poster && (
        <details className="launch-poster">
          <summary>{ja ? '発足式のご案内を見る' : '출범식 안내 보기'}</summary>
          <a href={'/api/greetings/' + data.poster.id} target="_blank" rel="noopener noreferrer">
            <img
              src={'/api/greetings/' + data.poster.id}
              alt={ja ? 'コンソーシアム発足式の案内ポスター' : '컨소시엄 출범식 안내 포스터'}
            />
          </a>
        </details>
      )}
      <h2 className="greetings-heading">{ja ? 'お祝いのメッセージ' : '축하 메시지'}</h2>
      {!data.items.length && (
        <p>{ja ? '登録されたメッセージはありません。' : '등록된 축사가 없습니다.'}</p>
      )}
      <div className="greetings-grid">
        {data.items.map((item) => (
          <article className="greeting-card" key={item.id}>
            <div className="greeting-person" lang="ko">
              <h3>{item.name}</h3>
              <p>{item.affiliation}</p>
            </div>
            {item.kind === 'pdf' && item.document ? (
              <>
                <a
                  className="greeting-preview"
                  href={'/api/greetings/' + item.document.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name + (ja ? ' 祝辞PDF（新しいタブ）' : ' 축사 PDF (새 탭)')}
                >
                  {item.preview ? (
                    <img
                      src={'/api/greetings/' + item.preview.id}
                      loading="lazy"
                      alt={item.name + (ja ? ' 祝辞の最初のページ' : ' 축사 첫 페이지')}
                    />
                  ) : (
                    <span>PDF</span>
                  )}
                </a>
                <div className="greeting-links">
                  <a
                    href={'/api/greetings/' + item.document.id}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ja ? '祝辞を見る ↗' : '축사 보기 ↗'}
                  </a>
                  <a href={'/api/greetings/' + item.document.id + '?download=1'}>
                    {ja ? 'PDFダウンロード' : 'PDF 다운로드'}
                  </a>
                </div>
              </>
            ) : (
              youtubeId(item.youtube) && (
                <div className="greeting-video">
                  {playing.includes(item.id) ? (
                    <iframe
                      title={item.name + (ja ? ' お祝いのメッセージ' : ' 영상 축사')}
                      src={'https://www.youtube-nocookie.com/embed/' + youtubeId(item.youtube)}
                      allow="encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <button type="button" onClick={() => setPlaying((p) => [...p, item.id])}>
                      {ja ? '▶ 動画を開く' : '▶ 영상 열기'}
                    </button>
                  )}
                </div>
              )
            )}
          </article>
        ))}
      </div>
    </>
  );
}
