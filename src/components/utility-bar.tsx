'use client';

import { useState } from 'react';

// Connect each language to its real page when translated pages are available.
const languages: { code: string; label: string; href: string | null }[] = [
  { code: 'ko', label: '한국어', href: null },
  { code: 'ja', label: '日本語', href: null },
  { code: 'en', label: 'English', href: null },
];

export function UtilityBar({ currentLanguage = 'ko' }: { currentLanguage?: string }) {
  const [message, setMessage] = useState('');

  return (
    <div className="topline">
      <div className="shell utility-inner">
        <a
          className="university-link"
          href="https://www.khu.ac.kr/kor/user/main/view.do"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="경희대학교 공식 홈페이지 (새 탭)"
        >
          경희대학교 <span aria-hidden="true">↗</span>
        </a>
        <div className="language-control">
          <select
            aria-label="언어 선택 / Language"
            value={currentLanguage}
            onChange={(event) => {
              const language = languages.find((item) => item.code === event.target.value);
              if (!language || language.code === currentLanguage) {
                setMessage('');
              } else if (language.href) {
                window.location.assign(language.href);
              } else {
                setMessage(`${language.label} 페이지는 준비 중입니다. 현재 한국어로 제공됩니다.`);
              }
            }}
            onBlur={() => setMessage('')}
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code} lang={language.code}>
                {language.label}
              </option>
            ))}
          </select>
          <span className="language-chevron" aria-hidden="true">⌄</span>
          <div role="status" className={message ? 'language-notice' : 'visually-hidden'}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
