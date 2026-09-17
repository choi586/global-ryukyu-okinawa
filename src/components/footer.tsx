import Link from 'next/link';
import { institute } from '@/data/institute';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div>
          <p className="eyebrow">{institute.englishName}</p>
          <strong>글로벌류큐·오키나와연구소</strong>
          <address className="footer-contact">
            <p>경기 용인시 기흥구 덕영대로 1732 경희대학교 외국어대학관 335호</p>
            <p>
              E-MAIL. <a href="mailto:okinawa@khu.ac.kr">okinawa@khu.ac.kr</a>
            </p>
          </address>
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
      </div>
    </footer>
  );
}
