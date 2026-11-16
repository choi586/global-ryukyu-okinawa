import { asset } from '@/lib/base-path';

export function SiteFooter() {
  return (
    <footer className="cs-footer">
      <div className="cs-shell cs-footer-inner">
        <div className="cs-footer-brand">
          <img
            src={asset('/images/consortium/mark-white.png')}
            width={800}
            height={358}
            alt=""
            loading="lazy"
          />
          <p>
            <strong>사회적연결회복 컨소시엄 사업단</strong>
            <span>경희대학교 글로벌류큐·오키나와연구소</span>
            <span lang="en">The Global Research Institute for Ryukyu-Okinawa Studies</span>
          </p>
        </div>
        <address>
          <p>경기 용인시 기흥구 덕영대로 1732 경희대학교 외국어대학관 233호</p>
          <p>
            E-MAIL. <a href="mailto:okinawa@khu.ac.kr">okinawa@khu.ac.kr</a>
          </p>
        </address>
        <nav aria-label="관련 사이트">
          <a href="https://okinawa.khu.ac.kr/">글로벌류큐·오키나와연구소 홈</a>
          <a href="https://okinawa.khu.ac.kr/research">연구사업 안내</a>
          <a href="https://okinawa.khu.ac.kr/launch">컨소시엄 출범식</a>
        </nav>
      </div>
      <div className="cs-shell cs-footer-bottom">
        <p>
          이 연구는 한국연구재단 글로벌인문사회융합연구지원사업의 지원을 받아 수행하고 있습니다.
        </p>
        <p>© 2026 경희대학교 글로벌류큐·오키나와연구소</p>
      </div>
    </footer>
  );
}
