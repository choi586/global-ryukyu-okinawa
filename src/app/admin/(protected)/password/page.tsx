import { requireAdmin } from '@/lib/auth';
import { PasswordForm } from '@/components/password-form';
export const metadata = { title: '비밀번호 변경' };
export default async function PasswordPage() {
  await requireAdmin();
  return <section style={{ maxWidth: 560 }}><div className="section-heading"><h1>비밀번호 변경</h1></div><PasswordForm /></section>;
}
