import { ContentBoard } from '@/components/content-board';
export const dynamic = 'force-dynamic';
export const metadata = {
  alternates: {
    canonical: '/publications',
    languages: { ko: '/publications', ja: '/ja/publications' },
  },
  title: '연구·출판',
};
export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return <ContentBoard category="publications" page={(await searchParams).page} />;
}
