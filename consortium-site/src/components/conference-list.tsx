'use client';
import { useState } from 'react';
import { asset } from '@/lib/base-path';
import { conferenceKinds, type Conference, type ConferenceKind } from '@/data/conferences';
import { YoutubePlayer } from './youtube-player';

type Filter = '전체' | ConferenceKind;

export function ConferenceList({ items }: { items: Conference[] }) {
  const [filter, setFilter] = useState<Filter>('전체');
  const shown = filter === '전체' ? items : items.filter((item) => item.kind === filter);
  const count = (kind: Filter) =>
    kind === '전체' ? items.length : items.filter((item) => item.kind === kind).length;

  return (
    <>
      <div className="cs-tabs" role="group" aria-label="학술대회 구분">
        {(['전체', ...conferenceKinds] as Filter[]).map((kind) => (
          <button
            key={kind}
            type="button"
            className={'cs-tab' + (filter === kind ? ' is-active' : '')}
            aria-pressed={filter === kind}
            onClick={() => setFilter(kind)}
          >
            {kind}
            <span>{count(kind)}</span>
          </button>
        ))}
      </div>
      {shown.length ? (
        <ul className="cs-audio-list">
          {shown.map((item) => (
            <li
              key={item.kind + item.title}
              className={'cs-audio' + (item.youtube || item.image ? '' : ' is-text')}
            >
              {item.youtube ? (
                <div className="cs-audio-player">
                  <YoutubePlayer url={item.youtube} title={item.title} />
                </div>
              ) : item.image ? (
                // The photo leads to the full write-up when there is one.
                item.link ? (
                  <a
                    className="cs-conference-photo"
                    href={item.link}
                    aria-label={`${item.title} 자세히 보기`}
                  >
                    <img
                      src={asset(`/images/consortium/events/${item.image}`)}
                      alt={item.imageAlt ?? ''}
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <span className="cs-conference-photo">
                    <img
                      src={asset(`/images/consortium/events/${item.image}`)}
                      alt={item.imageAlt ?? ''}
                      loading="lazy"
                    />
                  </span>
                )
              ) : null}
              <div className="cs-audio-body">
                <p className="cs-card-type">
                  {item.upcoming ? <span className="cs-badge">예정</span> : null}
                  {[item.kind, item.date, item.place].filter(Boolean).join(' · ')}
                </p>
                <h3>{item.title}</h3>
                {item.summary ? <p>{item.summary}</p> : null}
                {item.link ? (
                  <p className="cs-conference-link">
                    <a href={item.link}>자세히 보기 →</a>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="cs-empty">
          {filter === '전체'
            ? '학술대회 기록을 준비하고 있습니다.'
            : `${filter} 기록을 준비하고 있습니다.`}
          <span>공개되는 대로 이곳에 차례로 올립니다.</span>
        </p>
      )}
    </>
  );
}
