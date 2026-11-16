'use client';
import { useState } from 'react';
import { asset } from '@/lib/base-path';
import { regions, type Audiobook, type Region } from '@/data/media';
import { YoutubePlayer } from './youtube-player';

type Filter = '전체' | Region;

export function AudiobookList({ items }: { items: Audiobook[] }) {
  const [filter, setFilter] = useState<Filter>('전체');
  const shown = filter === '전체' ? items : items.filter((item) => item.region === filter);
  const count = (region: Filter) =>
    region === '전체' ? items.length : items.filter((item) => item.region === region).length;

  return (
    <>
      <div className="cs-tabs" role="group" aria-label="지역별 보기">
        {(['전체', ...regions] as Filter[]).map((region) => (
          <button
            key={region}
            type="button"
            className={'cs-tab' + (filter === region ? ' is-active' : '')}
            aria-pressed={filter === region}
            onClick={() => setFilter(region)}
          >
            {region}
            <span>{count(region)}</span>
          </button>
        ))}
      </div>
      {shown.length ? (
        <ul className="cs-audio-list">
          {shown.map((item) => (
            <li key={item.title} className="cs-audio">
              <div className="cs-audio-player">
                {item.youtube ? (
                  <YoutubePlayer url={item.youtube} title={item.title} />
                ) : item.audio ? (
                  <audio controls preload="none" src={asset(`/audio/${item.audio}`)} />
                ) : (
                  <p className="cs-media-frame cs-media-missing">공개 준비 중</p>
                )}
              </div>
              <div className="cs-audio-body">
                <p className="cs-card-type">
                  {[item.region, item.length].filter(Boolean).join(' · ')}
                </p>
                <h3>{item.title}</h3>
                {item.credit ? <p className="cs-audio-credit">{item.credit}</p> : null}
                {item.summary ? <p>{item.summary}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="cs-empty">
          {filter === '전체'
            ? '오디오북을 준비하고 있습니다.'
            : `${filter} 편을 준비하고 있습니다.`}
          <span>공개되는 대로 이곳에 차례로 올립니다.</span>
        </p>
      )}
    </>
  );
}
