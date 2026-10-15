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
export type LaunchBanner = {
  project: string;
  title: string;
  date: string;
  venue: string;
  href: string;
};
export const defaultLaunchBanner: LaunchBanner = {
  project: '생애주기별 사회적 고립의 이해와 사회적 연결 회복을 위한 융합연구',
  title: '컨소시엄 출범식',
  date: '2026. 10. 16. (금) 16:00',
  venue: '고려대학교 SK미래관 최종현홀',
  href: '/launch',
};
export type Greetings = {
  revision: number;
  poster?: Attachment;
  banner?: LaunchBanner;
  items: Greeting[];
};
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
