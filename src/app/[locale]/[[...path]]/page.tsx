import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Home from '@/views/home';
import About from '@/views/about';
import People from '@/views/people';
import News from '@/views/news';
import Detail, { generateMetadata as detailMetadata } from '@/views/detail';
import { ContentBoard } from '@/components/content-board';
import { localePath } from '@/i18n/config';
export const dynamic = 'force-dynamic';
type Props = {
  params: Promise<{ locale: string; path?: string[] }>;
  searchParams: Promise<{ page?: string }>;
};
const titles: Record<string, string> = {
  '': 'グローバル琉球・沖縄研究所',
  about: '研究所紹介',
  people: '研究者紹介',
  news: 'お知らせ',
  activities: '学術活動',
  publications: '研究・出版',
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, path = [] } = await params;
  if (locale !== 'ja') return {};
  const metadata =
    path.length === 2 && ['news', 'activities', 'publications'].includes(path[0])
      ? await detailMetadata({ params: Promise.resolve({ slug: path[1] }), locale: 'ja' })
      : { title: titles[path[0] || ''] };
  const pathname = '/' + path.join('/');
  return {
    ...metadata,
    alternates: {
      canonical: localePath(pathname, 'ja'),
      languages: { ko: pathname, ja: localePath(pathname, 'ja') },
    },
    openGraph: {
      title: typeof metadata.title === 'string' ? metadata.title : 'グローバル琉球・沖縄研究所',
      description:
        metadata.description ||
        '慶熙大学校グローバル琉球・沖縄研究所のお知らせと研究に関する最新情報をお届けします。',
      siteName: 'グローバル琉球・沖縄研究所',
      url: localePath(pathname, 'ja'),
      locale: 'ja_JP',
      type: 'website',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: '慶熙大学校 グローバル琉球・沖縄研究所',
        },
      ],
    },
  };
}
// Route dispatch only: every page and component below is shared with Korean.
export default async function JapanesePage({ params, searchParams }: Props) {
  const { locale, path = [] } = await params;
  if (locale !== 'ja') notFound();
  if (!path.length) return <Home locale="ja" />;
  if (path.length === 1) {
    if (path[0] === 'about') return <About locale="ja" />;
    if (path[0] === 'people') return <People locale="ja" />;
    if (path[0] === 'news') return <News locale="ja" />;
    if (path[0] === 'activities' || path[0] === 'publications')
      return <ContentBoard locale="ja" category={path[0]} page={(await searchParams).page} />;
  }
  if (path.length === 2 && ['news', 'activities', 'publications'].includes(path[0]))
    return <Detail locale="ja" params={Promise.resolve({ slug: path[1] })} />;
  notFound();
}
