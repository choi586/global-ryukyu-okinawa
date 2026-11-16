'use client';
import { useState } from 'react';

function youtubeId(url: string): string | null {
  const match = url
    .trim()
    .match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
    );
  return match ? match[1] : null;
}

// Shows only the thumbnail until the visitor presses play, so the page stays
// light and nothing is requested from the player before then.
export function YoutubeEmbed({
  url,
  title,
  vertical = false,
  playLabel,
}: {
  url: string;
  title: string;
  vertical?: boolean;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  const frame = 'video-frame' + (vertical ? ' vertical' : '');
  if (!id) {
    return (
      <a className={frame + ' video-missing'} href={url} target="_blank" rel="noreferrer">
        {title} ↗
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
      className={frame + ' video-poster'}
      onClick={() => setPlaying(true)}
      aria-label={`${title} ${playLabel}`}
    >
      <img
        // Shorts have a true 9:16 thumbnail; other videos try the sharp one first.
        src={`https://i.ytimg.com/vi/${id}/${vertical ? 'oardefault' : 'maxresdefault'}.jpg`}
        alt=""
        loading="lazy"
        onError={(event) => {
          const image = event.currentTarget;
          if (image.dataset.fallback) return;
          image.dataset.fallback = '1';
          image.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        }}
      />
      <span className="video-play" aria-hidden="true" />
    </button>
  );
}
