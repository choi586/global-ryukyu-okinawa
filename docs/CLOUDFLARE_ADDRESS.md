# 운영 주소와 배포 대상

홈페이지: https://khu.ryukyu-okinawa.workers.dev
관리자: https://khu.ryukyu-okinawa.workers.dev/admin

## 현재 확인 결과

Cloudflare에 별도 Worker 두 개가 있으며 모두 workers.dev 접속이 활성화돼 있습니다.

- 유지: `khu`, Worker ID `b5cd159b6a604d54bfde8bdecee65bc4`. 기존 Worker를 이름 변경한 리소스입니다.
- 정리 후보: `global-ryukyu-okinawa`, Worker ID `b0be2c2d8e0249c08fe49df1b1173de6`. 2026-09-17 23:09 UTC에 별도 생성됐습니다.
- 두 Worker 모두 D1 `global-ryukyu-okinawa` (ID `93aa30c7-901b-4d11-b379-2e5cf38f2cfb`)를 `DB`로 연결합니다.
- 두 Worker 모두 R2 `global-ryukyu-okinawa-media`를 `MEDIA`로 연결합니다.
- 홈페이지, 공지, 소개, 연구진, 관리자 페이지와 공개 공지/캐러셀 API는 양쪽 모두 HTTP 200으로 확인했습니다. 이 점검은 관리자 쓰기 기능이나 CPU 성능 전체 검증은 아닙니다.

GitHub main은 b1a10fb 커밋에서 Worker 이름과 APP_URL을 khu로 변경했습니다. 이전 이름으로 배포된 Worker는 이 설정 변경만으로 제거되지 않습니다. 두 번째 Worker의 정확한 생성 경로는 미확인입니다. Cloudflare Builds 조회 API가 현재 인증 권한으로 403을 반환해 GitHub 연결과 배포 명령을 대시보드에서 추가 확인해야 합니다. GitHub 저장소에는 Cloudflare Actions workflow나 일반 webhook이 없지만, 이것만으로 Cloudflare GitHub App 연결이 없다고 판단할 수 없습니다. GitHub Pages 조회도 404로 활성 여부를 확인하지 못했습니다.

## 앞으로 사용할 배포 설정

GitHub 저장소 `choi586/global-ryukyu-okinawa`, 운영 브랜치 `main` → `khu` → 기존 D1 + R2.
저장소 이름과 package.json의 프로젝트 이름은 Worker 주소와 무관하므로 유지합니다.

Cloudflare → Workers & Pages → **khu** → Settings → Build:

- 저장소: `choi586/global-ryukyu-okinawa`
- 운영 브랜치: `main`
- 루트: 저장소 루트
- 빌드 명령: `pnpm build:vinext`
- 배포 명령: `pnpm deploy:vinext`
- 다른 브랜치의 자동 배포가 불필요하면 비활성화

위 대시보드 설정은 이 점검에서 변경하지 않았습니다. 실제 연결 상태를 확인 후 적용해야 합니다.

로컬에서도 위 두 명령을 순서대로 실행합니다. 배포 전 검사에서 소스와 빌드 결과 모두 Worker 이름, 계정, APP_URL, D1 ID, R2 이름이 일치해야 진행합니다. `/news` 최적화 결과가 없는 빌드도 거부합니다. `--name`으로 다른 이름을 지정하거나 원본 wrangler.jsonc를 직접 배포하지 않습니다.

## 이전 Worker 정리 순서 — 아직 실행하지 않음

1. `khu`의 Build 연결 및 위 명령을 확인합니다.
2. `global-ryukyu-okinawa`의 Settings → Build에 저장소가 연결돼 있으면 그 Worker의 연결만 해제합니다. GitHub App 자체를 계정에서 삭제하지 않습니다.
3. `khu`에서 공지, 이미지, 관리자 로그인을 최종 확인합니다.
4. 이전 Worker의 Settings → Domains & Routes에서 workers.dev와 Preview URL을 비활성화하면 우선 되돌릴 수 있는 상태로 옛 주소를 닫을 수 있습니다.
5. 이후 불필요함을 확인하고 이전 Worker의 Settings에서 **Worker만 삭제**합니다.

D1 데이터베이스와 R2 버킷은 절대 삭제하거나 새로 만들지 않습니다. khu의 DB/MEDIA 바인딩과 관리자 비밀값도 유지합니다. 기존 주소 삭제는 이전 링크를 사용할 수 없게 하므로 필요하면 삭제 대신 리디렉션을 별도로 검토합니다.
