export type Attachment = { id: string; name: string; type: string; size: number; alt: string };
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
};
export function dateLabel(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}
