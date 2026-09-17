# 글로벌류큐·오키나와연구소 홈페이지

Cloudflare에 배포하는 Next.js 홈페이지입니다. 연구소 소개, 연구진 소개(연구책임자), 메인, 공지·소식(NEWS), 학술활동(ACTIVITIES), 연구·출판(PUBLICATIONS), 관리자 기능과 메인 사진 캐러셀을 제공합니다. 나머지 메뉴는 준비 중입니다.

## 실행

Node.js 24, pnpm 11을 사용합니다.

```sh
pnpm install
pnpm setup
pnpm dev
```

홈페이지 http://localhost:3000 · 관리자 http://localhost:3000/admin

기존 `.env.local`이 있으면 setup은 덮어쓰지 않습니다. 초기 관리자 로그인 정보는 `.data/ADMIN-LOGIN.txt`에만 보관하며 Git에 포함하지 않습니다. `APP_URL`을 접속 주소와 일치시켜야 관리자 저장이 작동합니다.

## 게시물과 사진

관리자에서 게시 영역, 제목·본문, 행사일·발행일, 초안·공개 상태를 설정할 수 있습니다. 사진과 PDF는 본문 아래에 표시됩니다. 사진은 브라우저에서 자동으로 긴 변 1920px 이내의 WebP로 최적화하며 작은 파일은 유지합니다. PDF는 변환하지 않습니다. 새 첨부파일은 최적화 후 합계 3MB, 글당 최대 10개입니다. 기존 자료에서 이전한 PDF는 원본 크기를 유지합니다.

초안과 첨부파일은 관리자만 열람할 수 있으며 공개 해제 즉시 파일 접근도 차단됩니다. 본문은 실행 가능한 HTML이 아닌 일반 텍스트로 저장합니다. 단일 관리자, 세션 만료, 쓰기 요청 출처 확인, 로그인 횟수 제한을 적용합니다.

## 메인 캐러셀 운영

`/admin` → **메인 캐러셀 관리**에서 사진 추가·교체·삭제·순서 변경·제목·짧은 설명·링크·공개 여부를 바꾼 뒤 **캐러셀 저장하기**를 누릅니다. 코드 수정이나 재배포가 필요하지 않습니다. 메인에는 최대 5장(3~5장 권장), 비공개 포함 최대 15장을 보관합니다. 포스터는 ‘전체 보이기’, 풍경이나 행사 사진은 ‘화면 채우기’를 선택합니다.

5초마다 페이드 전환하며 좌우 버튼, 현재 위치 표시, 터치 넘기기를 제공합니다. 마우스를 올리거나 키보드로 조작하는 동안 자동재생이 멈추며 직접 넘긴 뒤에는 10초간 대기합니다. 화면이 숨겨졌거나 사용자가 모션 줄이기를 설정한 경우에도 자동재생을 멈춥니다. 별도 재생 정지 버튼이 있습니다. 열려 있는 메인화면도 5초마다 변경 내용을 확인합니다.

사진과 설정은 모두 서버에 저장합니다. 관리자 미리보기에서 편집 후 저장을 눌러야 공개 화면에 반영됩니다. 두 관리 창이 같은 설정을 덮어쓰려 하면 저장 충돌을 알려줍니다. 비공개·삭제한 사진은 공개 파일 주소로 열 수 없습니다.

## 티스토리 자료 이전

원본 블로그: https://ryukyuokinawa2.tistory.com/

`scripts/import-tistory.py`는 공개 글의 제목·게시일·본문·이미지·PDF를 수집합니다. 원래 소개 글은 기존 홈페이지 소개와 중복되어 별도 게시하지 않고, 이미 등록한 연구과제 선정 공지에는 사진만 합칩니다. 글의 행사일·발행일은 제목에 명시된 날짜가 있는 경우에만 별도 필드로 추출합니다. 원문 본문에 있는 일정은 그대로 유지합니다.

사진 원본은 `.data/tistory/*.original`, 웹용 이미지는 `.data/uploads/`에 저장합니다. 본문용은 긴 변 1920px, 목록용은 640px 이내로 만들고 종횡비를 유지합니다. 첫 사진을 대표 이미지로 사용하며 사진이 없는 자료는 텍스트 카드로 표시합니다. 외부 이미지를 직접 연결하지 않습니다. 관리자에 다시 저장해도 내부 원문 기록과 날짜를 보존합니다.

Python 의존성: BeautifulSoup4, Pillow.

```sh
python3 scripts/import-tistory.py          # 수집 목록 확인
python3 scripts/import-tistory.py --media  # 이미지 최적화 및 파일 준비
python3 scripts/import-tistory.py --apply  # DB 백업 후 로컬 반영
```

이미 이전한 글은 관리자 수정 내용을 덮어쓰지 않습니다. 새 수집이 필요하면 해당 `.data/tistory/<번호>.html` 캐시와 prepared.json을 별도로 보관한 뒤 새로 수집합니다. 게시글·파일·원문 백업은 Git에 포함되지 않습니다.

## Cloudflare 운영

홈페이지: https://global-ryukyu-okinawa.ryukyu-okinawa.workers.dev
관리자: https://global-ryukyu-okinawa.ryukyu-okinawa.workers.dev/admin

- Workers: 홈페이지와 서버 기능 (vinext 빌드)
- D1 `global-ryukyu-okinawa`: 게시물, 캐러셀 정보, 관리자 세션
- 비공개 R2 `global-ryukyu-okinawa-media`: 사진, 포스터, PDF

온라인 관리자 로그인 정보는 `.data/ONLINE-ADMIN-LOGIN.txt`에만 보관합니다. 온라인 운영 데이터는 D1/R2에 저장되며 로컬 SQLite와 자동 동기화하지 않습니다. 배포 후 게시물과 사진 수정은 온라인 관리자에서 진행합니다. 코드 배포는 운영 데이터를 덮어쓰지 않습니다.

```sh
pnpm build:vinext
pnpm exec wrangler deploy --config dist/server/wrangler.json
```

최초 배포에서는 `--secrets-file .data/production-secrets.json`으로 관리자 아이디와 비밀번호 해시를 설정합니다. 이후 일반 배포는 기존 비밀 값을 유지합니다. `APP_URL`은 실제 접속 주소와 일치해야 합니다. `.env.local`은 로컬 실행 전용이며 Worker 빌드는 이를 읽지 않습니다. `.dev.vars`는 로컬 Workers 검증 전용입니다.

로컬 Workers 검증은 `pnpm export:cloudflare`, `node scripts/seed-cloudflare-local.mjs`, `pnpm start:vinext` 순서로 실행할 수 있습니다. 초기 온라인 이전용 파일은 `.data/cloudflare-export/`에 생성됩니다. `scripts/upload-cloudflare-media.mjs`는 파일 해시를 확인하며 업로드 완료 기록으로 재개할 수 있습니다. 내보내기는 로그인 세션과 비밀번호를 포함하지 않습니다. 이미 운영 중인 D1에 전체 SQL을 다시 넣지 말고 변경 내용을 비교해야 합니다.

R2는 직접 공개하지 않으며 Workers가 글과 캐러셀의 공개 상태를 확인한 후 파일을 제공합니다.

## 검증

```sh
pnpm build
pnpm typecheck
pnpm test
pnpm test:persistence
```

브라우저 검증은 설치된 Chrome과 별도 포트 3100, 임시 DB를 사용합니다. 로컬 원본 데이터는 건드리지 않습니다. 재시작 검증은 3200 포트를 사용합니다. 현재 테스트 사이트는 검색엔진 색인을 차단합니다.

## 백업

게시물·로그인 세션: `.data/institute.sqlite` · 첨부파일: `.data/uploads/`

SQLite 백업 API 또는 서버 정지 후 `.data` 전체 복사로 백업합니다. 원본 자료·로그인 정보·환경변수는 GitHub가 백업하지 않습니다. 현재 로컬 모드는 한 서버 인스턴스 전용입니다.
