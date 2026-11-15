'use client';
import { useEffect, useRef, type ReactNode } from 'react';

// Holds the hero animation until it scrolls into view (e.g. below the text on phones).
// Without JavaScript the animation simply plays on load.
export function HeroMotionPlay({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) return;
    node.dataset.waiting = '';
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          delete node.dataset.waiting;
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="hero-motion-play" ref={ref}>
      {children}
    </div>
  );
}
