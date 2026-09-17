import Link from 'next/link';
import { getCarousel } from '@/lib/carousel';
import { CarouselEditor } from '@/components/carousel-editor';
export const metadata = { title: '메인 캐러셀 관리' };
export default async function Page() {
  return (
    <>
      <div className="section-heading">
        <div>
          <p className="eyebrow">MAIN CAROUSEL</p>
          <h1>메인 캐러셀 관리</h1>
        </div>
        <Link href="/" target="_blank" className="text-link">
          메인화면 보기 ↗
        </Link>
      </div>
      <CarouselEditor initial={await getCarousel()} />
    </>
  );
}
