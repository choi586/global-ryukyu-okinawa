import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { configured, isAdmin } from '@/lib/auth';
import { LoginForm } from '@/components/login-form';
export const metadata: Metadata = { title: '관리자 로그인' };
export default async function Login() {
  if (await isAdmin()) redirect('/admin');
  return (
    <section className="login-section">
      <div className="login-card">
        <p className="eyebrow">ADMINISTRATOR</p>
        <h1>관리자 로그인</h1>
        <p className="login-description">연구소 공지사항을 관리합니다.</p>
        <LoginForm enabled={configured()} />
        <Link href="/" className="back-home">
          ← 홈페이지로 돌아가기
        </Link>
      </div>
    </section>
  );
}
