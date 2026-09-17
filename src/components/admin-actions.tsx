'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export function Logout() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  return (
    <div>
      <button
        className="text-link"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (!response.ok) throw Error();
            router.replace('/admin/login');
            router.refresh();
          } catch {
            setError('로그아웃하지 못했습니다. 다시 시도해주세요.');
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? '로그아웃 중…' : '로그아웃'}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
