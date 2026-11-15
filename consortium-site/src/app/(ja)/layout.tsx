import { ConsortiumShell } from '@/components/consortium-shell';
import { ja } from '@/content/ja';
import { siteMetadata } from '@/lib/site-meta';

export const metadata = siteMetadata(ja);

export default function JapaneseLayout({ children }: { children: React.ReactNode }) {
  return <ConsortiumShell c={ja}>{children}</ConsortiumShell>;
}
