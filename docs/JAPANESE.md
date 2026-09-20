# Japanese public pages

- Korean URLs remain unchanged; Japanese pages use `/ja` and the same path/slug.
- `src/views/` contains the single shared page implementation. Korean route files and the Japanese catch-all are routing adapters, not duplicated pages.
- `src/i18n/ja.ts` contains Japanese translations of the existing Korean text. `config.ts` centralizes supported locales, translation fallback and internal links.
- The root provider receives a request-scoped locale from middleware. Language switching performs a document navigation and retains path, query and hash. No global mutable locale or automatic browser-language redirection.
- English remains unavailable. Admin and APIs stay unprefixed and Korean. No authentication, upload, D1 or R2 changes.
- Posts, carousel captions, attachments and bibliography remain in their source language, with Japanese original-language notices. The dictionary translates UI/static institute content only; it must never translate arbitrary database content by matching titles.
- 孫知延 is supported by the university's Japanese department publications listing: https://com.khu.ac.kr/japanese/user/bbs/BMSR00044/list.do?menuNo=2200025 . Bibliographical titles remain as supplied in the source data.
- About paragraphs and the five visions follow the existing Korean originals. `研究センター` in the fourth historical paragraph preserves the source's `연구센터`; current site labels use `研究所`.
- `scripts/prepare-static-pages.mjs` produces HTML/RSC for Korean and Japanese news/about/people. `cloudflare/worker.ts` serves these before loading the framework. Public news API remains bounded and unchanged.
- Japanese text uses natural wrapping without changing Korean styles, logos or assets.

Validation: Next and vinext builds; ten Playwright tests including the existing admin/media suite; local Workers language switching, query/hash retention, static page hydration, 404, mobile/tablet overflow checks (320/390/1024/1440 px).
