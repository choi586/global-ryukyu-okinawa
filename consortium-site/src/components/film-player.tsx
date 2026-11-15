'use client';
import { useRef, useState } from 'react';

// Shows the full poster (including the institute name on its last line) with a
// single play button; native controls appear only once playback starts.
export function FilmPlayer({
  src,
  poster,
  label,
  playLabel,
}: {
  src: string;
  poster: string;
  label: string;
  playLabel: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  return (
    <div className={'cs-film-player' + (started ? ' is-started' : '')}>
      <video
        ref={video}
        controls={started}
        preload="none"
        playsInline
        poster={poster}
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
      </video>
      {!started && (
        <button
          type="button"
          className="cs-film-play"
          aria-label={playLabel}
          onClick={() => {
            setStarted(true);
            video.current?.play().catch(() => undefined);
          }}
        >
          <span aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
