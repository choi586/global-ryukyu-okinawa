# 사회적연결회복 컨소시엄 사업단 사이트

연구소 앱과 별도로 설치·빌드하는 정적 사이트입니다. 홈페이지 경로는 `/`입니다.

```sh
cd consortium-site
pnpm install --frozen-lockfile
pnpm dev
```

개발 주소: http://127.0.0.1:3200

```sh
pnpm typecheck
pnpm build
```

배포 파일은 `out/`에 생성됩니다. Cloudflare Pages 등 정적 호스팅에 이 폴더만 올리면 됩니다. 연구소의 Worker나 데이터베이스는 필요하지 않습니다.

연구소 관련 링크는 https://okinawa.khu.ac.kr 의 전체 주소를 사용합니다.
테스트 단계이므로 검색 수집은 차단했습니다. 공식 주소가 정해지면 `SITE_URL`을 지정하고 `src/app/layout.tsx`, `src/app/robots.ts`의 검색 설정을 변경하세요.
연구소에서 사업단으로 가는 링크는 사업단의 실제 배포 주소가 확정된 뒤 추가합니다.

기존 연구소 앱의 `/consortium`은 비교 확인용으로 유지했습니다. 독립 사이트 수정은 이 폴더에서 진행합니다.
