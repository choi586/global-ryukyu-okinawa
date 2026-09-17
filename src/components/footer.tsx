import Link from 'next/link';
import { institute } from '@/data/institute';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div>
          <p className="eyebrow">{institute.englishName}</p>
          <strong>글로벌류큐·오키나와연구소</strong>
          <p>경희대학교</p>
        </div>
        <div className="footer-links">
          <Link href="/news">공지사항</Link>
          <Link href="/admin">관리자 로그인</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>
          © {new Date().getFullYear()} {institute.englishName}.
        </span>
        <span>홈페이지 테스트 운영 중</span>
      </div>
    </footer>
  );
}
