import { ContentBoard } from '@/components/content-board';
export const dynamic = 'force-dynamic';
export const metadata = { title: '학술활동' };
export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  return <ContentBoard category="activities" page={(await searchParams).page} />;
}
