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
  thumb,
  playLabel,
}: {
  url: string;
  title: string;
  vertical?: boolean;
  thumb?: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  // Thumbnails to try, best first. Shorts normally have a true 9:16 one; when
  // YouTube has none (for example after the owner sets a custom thumbnail), the
  // 16:9 one holds the vertical picture in its centre, which the frame crops to.
  const sources = [
    ...(thumb ? [thumb] : []),
    ...(vertical ? ['oardefault'] : []),
    'maxresdefault',
    'hqdefault',
  ];
  // Walk down the list until one of YouTube's sizes really exists.
  const nextSource = (image: HTMLImageElement) => {
    const next = Number(image.dataset.step ?? 0) + 1;
    if (next >= sources.length) return;
    image.dataset.step = String(next);
    if (sources[next] === 'hqdefault') image.dataset.fallback = '1';
    image.src = `https://i.ytimg.com/vi/${id}/${sources[next]}.jpg`;
  };
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
        src={`https://i.ytimg.com/vi/${id}/${sources[0]}.jpg`}
        alt=""
        loading="lazy"
        onError={(event) => nextSource(event.currentTarget)}
        // A missing size comes back as a 120px grey placeholder, not as an error.
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth <= 120) nextSource(event.currentTarget);
        }}
      />
      <span className="video-play" aria-hidden="true" />
    </button>
  );
}
