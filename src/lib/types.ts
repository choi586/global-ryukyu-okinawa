export type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  alt: string;
  width?: number;
  height?: number;
  thumbnail?: { id: string; size: number; width: number; height: number };
};
export const categories = {
  news: '공지·소식',
  activities: '학술활동',
  publications: '연구·출판',
} as const;
export type Category = keyof typeof categories;
export type Notice = {
  id: string;
  slug: string;
  title: string;
  body: string;
  status: 'draft' | 'published';
  pinned: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
  category?: Category;
  eventDate?: string | null;
  sourceUrl?: string;
  sourceCategory?: string;
};
export function noticePath(notice: Notice) {
  return `/${notice.category || 'news'}/${notice.slug}`;
}
export function dateLabel(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}
