import { ConsortiumNav } from '@/components/consortium-nav';
import type { Content } from '@/content/types';

import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/500.css';
import '@fontsource/noto-sans-kr/700.css';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import '../app/globals.css';
import '../app/consortium.css';

// Shared <html> frame for the Korean and Japanese root layouts.
export function ConsortiumShell({ c, children }: { c: Content; children: React.ReactNode }) {
  return (
    <html lang={c.locale}>
      <body>
        <div className="cs">
          <a className="skip-link" href="#main">
            {c.ui.skip}
          </a>
          <ConsortiumNav c={c} />
          <main id="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
