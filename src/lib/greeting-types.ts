import type { Attachment } from './types';
export type Greeting = {
  id: string;
  name: string;
  affiliation: string;
  published: boolean;
  kind: 'pdf' | 'youtube';
  youtube: string;
  document?: Attachment;
  preview?: Attachment;
};
export type Greetings = { revision: number; poster?: Attachment; items: Greeting[] };
export function youtubeId(value: string): string | null {
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.username || u.password || u.port) return null;
    let id: string | null = null;
    if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(u.hostname)) {
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      else id = /^\/(?:embed|shorts)\/([^/]+)$/.exec(u.pathname)?.[1] || null;
    }
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
export const emptyGreetings: Greetings = { revision: 0, items: [] };
