'use client';
import { useState } from 'react';
import { youtubeId } from '@/lib/youtube';

// Shows only the thumbnail until the visitor presses play, so a page with many
// videos stays light and nothing is requested from the player before then.
export function YoutubePlayer({
  url,
  title,
  vertical = false,
}: {
  url: string;
  title: string;
  vertical?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  const frame = 'cs-media-frame' + (vertical ? ' is-vertical' : '');
  if (!id) {
    return (
      <a className={frame + ' cs-media-missing'} href={url} target="_blank" rel="noreferrer">
        영상 열기 ↗
      </a>
    );
  }
  if (playing) {
    return (
      <div className={frame}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button
      type="button"
      className={frame + ' cs-media-poster'}
      onClick={() => setPlaying(true)}
      aria-label={`${title} 재생`}
    >
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
      <span className="cs-media-play" aria-hidden="true" />
    </button>
  );
}
