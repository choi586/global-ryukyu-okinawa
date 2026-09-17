import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="shell empty-state standalone">
      <p className="eyebrow">404</p>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>주소가 변경되었거나 공개되지 않은 페이지입니다.</p>
      <Link className="button" href="/news">
        공지사항으로 이동
      </Link>
    </section>
  );
}
