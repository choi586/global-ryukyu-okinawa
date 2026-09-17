'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export function LoginForm({ enabled }: { enabled: boolean }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setError('');
        setBusy(true);
        const form = new FormData(event.currentTarget);
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: form.get('username'),
              password: form.get('password'),
            }),
          });
          const result = await response.json();
          if (!response.ok) throw Error(result.error);
          router.replace('/admin');
          router.refresh();
        } catch (error) {
          setError(error instanceof Error ? error.message : '로그인하지 못했습니다.');
        } finally {
          setBusy(false);
        }
      }}
      className="stack-form"
    >
      {!enabled && (
        <p className="form-error" role="alert">
          관리자 계정을 먼저 설정해주세요. 프로젝트의 초기 설정 안내를 확인해주세요.
        </p>
      )}
      <label>
        아이디
        <input
          name="username"
          autoComplete="username"
          required
          maxLength={100}
          placeholder="관리자 아이디"
        />
      </label>
      <label>
        비밀번호
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={256}
          placeholder="비밀번호 입력"
        />
      </label>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <button className="button full-width" disabled={busy || !enabled} type="submit">
        {busy ? '로그인 중…' : '로그인'} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
