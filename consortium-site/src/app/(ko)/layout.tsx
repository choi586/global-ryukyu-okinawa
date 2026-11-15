import { ConsortiumShell } from '@/components/consortium-shell';
import { ko } from '@/content/ko';
import { siteMetadata } from '@/lib/site-meta';

export const metadata = siteMetadata(ko);

export default function KoreanLayout({ children }: { children: React.ReactNode }) {
  return <ConsortiumShell c={ko}>{children}</ConsortiumShell>;
}
