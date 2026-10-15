'use client';
import { useEffect, useState } from 'react';
import Link from '@/components/localized-link';
import { defaultLaunchBanner, type LaunchBanner as Banner } from '@/lib/greeting-types';
export function LaunchBanner({ locale = 'ko' }: { locale?: 'ko' | 'ja' }) {
  const [banner, setBanner] = useState<Banner>(defaultLaunchBanner);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/greetings', { signal: controller.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.banner) setBanner(d.banner);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const ja = locale === 'ja';
  const text = (key: keyof Banner, translation: string) =>
    ja && banner[key] === defaultLaunchBanner[key] ? translation : banner[key];
  return (
    <div className="shell launch-home-link">
      <section className="launch-banner" aria-labelledby="launch-banner-title">
        <div className="launch-banner-copy">
          <p className="launch-banner-project">
            {text(
              'project',
              'ライフステージ別の社会的孤立の理解と社会的つながりの回復に向けた融合研究',
            )}
          </p>
          <h2 id="launch-banner-title">{text('title', 'コンソーシアム発足式')}</h2>
          <div className="launch-banner-info">
            <p>{text('date', '2026. 10. 16.（金）16:00')}</p>
            <p>{text('venue', '高麗大学校 SK未来館 チェ・ジョンヒョンホール')}</p>
          </div>
        </div>
        <Link className="launch-banner-button" href={banner.href}>
          {ja ? 'お祝いのメッセージを見る' : '축하 메시지 보기'}
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}
