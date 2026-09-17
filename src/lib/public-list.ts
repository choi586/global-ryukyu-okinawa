import type { Attachment, Category } from './types';
export type NoticeSummary = {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  pinned: boolean;
  category: Category;
  attachmentCount: number;
  eventDate: string | null;
  body: string;
  sourceCategory: string;
  picture: Attachment | null;
};
export const publicWhere = `namespace='notices' AND json_extract(data,'$.status')='published' AND COALESCE(json_extract(data,'$.category'),'news')=?`;
export const countPublicSql = `SELECT COUNT(*) AS total FROM records WHERE ${publicWhere}`;
export const publicListSql = `SELECT id, json_extract(data,'$.slug') AS slug,
json_extract(data,'$.title') AS title, json_extract(data,'$.publishedAt') AS publishedAt,
json_extract(data,'$.pinned') AS pinned, COALESCE(json_extract(data,'$.category'),'news') AS category,
json_array_length(data,'$.attachments') AS attachmentCount,
json_extract(data,'$.eventDate') AS eventDate, substr(json_extract(data,'$.body'),1,600) AS body,
json_extract(data,'$.sourceCategory') AS sourceCategory,
(SELECT value FROM json_each(records.data,'$.attachments') WHERE json_extract(value,'$.type') LIKE 'image/%' LIMIT 1) AS picture
FROM records WHERE ${publicWhere}
ORDER BY json_extract(data,'$.pinned') DESC,json_extract(data,'$.publishedAt') DESC,id DESC LIMIT ? OFFSET ?`;
// The news list needs neither body text nor attachment metadata.
export const newsListSql = `SELECT id, json_extract(data,'$.slug') AS slug,
json_extract(data,'$.title') AS title,json_extract(data,'$.publishedAt') AS publishedAt,
json_extract(data,'$.pinned') AS pinned,json_array_length(data,'$.attachments') AS attachmentCount
FROM records WHERE ${publicWhere}
ORDER BY json_extract(data,'$.pinned') DESC,json_extract(data,'$.publishedAt') DESC,id DESC LIMIT ? OFFSET ?`;
export function pageNumber(value: unknown, pages: number) {
  const n = Number(value);
  return Math.min(pages, Math.max(1, Number.isFinite(n) ? Math.floor(n) : 1));
}
