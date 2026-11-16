'use client';
import { useState } from 'react';
import type { ActivityRecord } from '@/data/media';
import { YoutubePlayer } from './youtube-player';

export function RecordList({ items }: { items: ActivityRecord[] }) {
  const kinds = [...new Set(items.map((item) => item.kind))];
  const [filter, setFilter] = useState('전체');
  const shown = filter === '전체' ? items : items.filter((item) => item.kind === filter);

  if (!items.length) {
    return (
      <p className="cs-empty">
        활동 기록을 준비하고 있습니다.
        <span>답사 영상부터 공개되는 대로 이곳에 차례로 올립니다.</span>
      </p>
    );
  }
  return (
    <>
      {kinds.length > 1 ? (
        <div className="cs-tabs" role="group" aria-label="활동 종류별 보기">
          {['전체', ...kinds].map((kind) => (
            <button
              key={kind}
              type="button"
              className={'cs-tab' + (filter === kind ? ' is-active' : '')}
              aria-pressed={filter === kind}
              onClick={() => setFilter(kind)}
            >
              {kind}
              <span>
                {kind === '전체' ? items.length : items.filter((item) => item.kind === kind).length}
              </span>
            </button>
          ))}
        </div>
      ) : null}
      <ul className="cs-video-grid">
        {shown.map((item) => (
          <li key={item.youtube} className="cs-video">
            <YoutubePlayer url={item.youtube} title={item.title} vertical={item.vertical} />
            <p className="cs-card-type">
              {[item.kind, item.place, item.date].filter(Boolean).join(' · ')}
            </p>
            <h2>{item.title}</h2>
            {item.summary ? <p>{item.summary}</p> : null}
          </li>
        ))}
      </ul>
    </>
  );
}
