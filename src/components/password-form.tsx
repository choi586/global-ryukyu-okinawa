'use client';
import Link from 'next/link';
import { useState } from 'react';
export function PasswordForm() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  if (done) return <div className="stack-form"><p className="success-message" role="status">비밀번호를 변경했습니다. 새 비밀번호로 다시 로그인해주세요.</p><Link className="button" href="/admin/login">다시 로그인</Link></div>;
  return <form className="stack-form" onSubmit={async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get('currentPassword') || '');
    const newPassword = String(data.get('newPassword') || '');
    const confirmation = String(data.get('confirmation') || '');
    setError('');
    if (newPassword !== confirmation) { setError('새 비밀번호와 확인 값이 다릅니다.'); return; }
    setBusy(true);
    try {
      const response = await fetch('/api/auth/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword, confirmation }) });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      form.reset();
      setDone(true);
    } catch (e) { setError(e instanceof Error ? e.message : '변경하지 못했습니다.'); }
    finally { setBusy(false); }
  }}>
    <label>현재 비밀번호<input type="password" name="currentPassword" autoComplete="current-password" required maxLength={256} /></label>
    <label>새 비밀번호<input type="password" name="newPassword" autoComplete="new-password" required minLength={12} maxLength={256} aria-describedby="password-help" /></label>
    <label>새 비밀번호 확인<input type="password" name="confirmation" autoComplete="new-password" required minLength={12} maxLength={256} /></label>
    <p id="password-help">12자 이상 입력해주세요. 변경하면 다른 기기를 포함한 기존 로그인이 해제됩니다.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button type="submit" className="button" disabled={busy}>{busy ? '변경 중…' : '비밀번호 변경하기'}</button>
  </form>;
}
