import type { Content } from '@/content/types';
import { asset } from '@/lib/base-path';

export function SiteFooter({ c }: { c: Content }) {
  const { footer } = c;
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
            <strong>{footer.name}</strong>
            <span>{footer.institute}</span>
            <span lang="en">The Global Research Institute for Ryukyu-Okinawa Studies</span>
          </p>
        </div>
        <address>
          <p>{footer.address}</p>
          <p>
            E-MAIL. <a href="mailto:okinawa@khu.ac.kr">okinawa@khu.ac.kr</a>
          </p>
        </address>
        <nav aria-label={c.ui.footerNavLabel}>
          {footer.links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="cs-shell cs-footer-bottom">
        <p>{footer.funding}</p>
        <p>{footer.copyright}</p>
      </div>
    </footer>
  );
}
