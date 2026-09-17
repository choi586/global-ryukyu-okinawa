import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { Logout } from '@/components/admin-actions';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: '공지사항 관리' };
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin-surface">
      <div className="admin-bar">
        <div className="shell">
          <Link href="/admin">
            연구소 관리자 <span>/ 공지사항</span>
          </Link>
          <Logout />
        </div>
      </div>
      <div className="shell admin-content">{children}</div>
    </div>
  );
}
