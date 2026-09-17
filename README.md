# 글로벌류큐·오키나와연구소 홈페이지

메인화면, 공지사항 게시판, 관리자 기능을 구현한 테스트 버전입니다. 나머지 메뉴는 ‘준비 중’으로 표시되며 이동하지 않습니다. 메인 소개·비전은 공식 연구소 소개 페이지에 근거하며, 제공받은 로고를 사용합니다. 출처와 디자인 참고 사항은 `docs/CONTENT_SOURCES.md`에 기록했습니다.

## 구현된 기능

- 반응형 메인화면, 최신 공지 연동
- 공지 목록·상세, 중요 공지 고정, 페이지 이동
- 관리자 로그인·로그아웃, 초안·공개, 등록·수정·삭제
- JPG·PNG·WEBP 이미지와 PDF 첨부, 이미지 설명
- 초안 및 첨부파일의 서버 측 접근 제어
- 로컬 SQLite 저장 및 업로드 파일 보존
- 온라인 배포용 Supabase DB·비공개 파일 저장소 어댑터

## 실행

Node.js 22.13 이상(24 권장), pnpm 11 이상을 사용합니다.

```sh
pnpm install
pnpm setup
pnpm dev
```

- 홈페이지: http://localhost:3000
- 공지사항: http://localhost:3000/news
- 관리자: http://localhost:3000/admin
- 초기 로그인 정보: `.data/ADMIN-LOGIN.txt` (로컬 전용, Git 제외)

`pnpm setup`은 강한 무작위 비밀번호와 해시를 만들고 `.env.local`에 설정합니다. 기존 설정이 있으면 덮어쓰지 않습니다. 로그인 정보 파일은 개인 컴퓨터에서만 보관하세요. 비밀번호 변경 시 새 salt와 scrypt 해시로 `ADMIN_PASSWORD_HASH`를 교체하면 기존 세션도 무효화됩니다.

```sh
pnpm build
pnpm start
```

`APP_URL`과 브라우저 주소를 맞추세요. 기본값이 `http://localhost:3000`이면 `127.0.0.1` 대신 `localhost`로 접속합니다. 개발·기본 실행은 로컬 인터페이스에만 바인딩합니다.

## 공지 운영

1. 관리자 로그인 후 ‘새 공지 작성’을 선택합니다.
2. 제목과 본문을 입력합니다. 본문은 일반 텍스트이며 줄바꿈을 유지합니다.
3. 필요하면 이미지를 첨부하고 설명을 입력합니다. 이미지는 본문 아래에 표시됩니다.
4. 초안 또는 공개를 선택하고 저장합니다. 공개 시 메인과 공지 목록에 즉시 반영됩니다.
5. 기존 글의 ‘수정’에서 내용을 바꾸거나 공개를 해제할 수 있습니다.
6. 삭제는 확인창에서 다시 확인한 뒤 진행합니다.

새로 첨부하는 파일 합계는 3MB 이하, 글당 최대 10개입니다. PDF는 다운로드로 제공하며 SVG·HTML 등 실행 가능한 형식은 받지 않습니다. 일반 회원가입과 댓글은 없습니다.

## 저장 방식

### 현재 로컬 테스트

`STORAGE_DRIVER=local`을 사용합니다. 게시물과 세션은 `.data/institute.sqlite`, 파일은 `.data/uploads/`에 보관합니다. 서버를 재시작하거나 코드를 다시 빌드해도 데이터는 남습니다. `.data`와 `.env.local`은 Git에 포함되지 않습니다.

로컬 저장소는 **Vercel에 사용할 수 없습니다.** Vercel에서 로컬 모드를 선택하면 실패하도록 하여 임시 파일시스템에 게시물이 저장·유실되는 일을 방지합니다.

### Vercel 온라인 테스트 준비

실제 Supabase 프로젝트와 Vercel 프로젝트 연결은 아직 수행하지 않았습니다.

1. 본인 소유 Supabase 프로젝트에서 `supabase/schema.sql`을 실행합니다. DB 테이블 및 비공개 `notice-files` 버킷을 생성합니다.
2. Vercel에서 이 GitHub 저장소를 가져오고 Next.js 및 Node.js 24를 선택합니다.
3. 환경변수에 다음을 설정합니다.
   - `APP_URL`: 테스트 홈페이지의 정확한 HTTPS 주소
   - `STORAGE_DRIVER=supabase`
   - `SUPABASE_URL`: Supabase 프로젝트 주소
   - `SUPABASE_SERVICE_ROLE_KEY`: 서버 전용 서비스 키
   - `SUPABASE_STORAGE_BUCKET=notice-files`
   - `ADMIN_USERNAME`: 관리자 아이디
   - `ADMIN_PASSWORD_HASH`: 새 관리자 비밀번호의 scrypt 해시 (`salt:64바이트 해시의 hex`)
4. 배포 후 관리자 등록·수정·삭제, 초안 파일 접근 차단, 재배포 후 보존을 확인합니다.

서비스 키·비밀번호 해시는 `NEXT_PUBLIC_` 변수로 만들거나 GitHub에 올리지 않습니다. DB에 브라우저 직접 접근을 허용하지 않으며 서비스 키는 서버에서만 사용합니다. 미리보기 배포마다 주소가 다르면 `APP_URL`도 맞춰야 하므로 고정 테스트 주소를 권합니다. 테스트용 DB와 향후 정식 DB는 분리합니다.

현재 Supabase 어댑터는 구현되어 있지만 실제 원격 프로젝트 검증은 연결 이후 필요합니다. 배포 준비가 된 것과 온라인 배포가 완료된 것은 구분합니다.

## 검증

```sh
pnpm build
pnpm typecheck
pnpm test
pnpm test:persistence
```

브라우저 테스트는 설치된 Google Chrome을 사용하며, 임시 DB와 별도 포트 3100에서 작동합니다. 개발 중 사용하는 데이터에는 영향을 주지 않습니다. Chrome이 없는 환경에서는 Playwright Chromium을 설치하고 `playwright.config.ts`의 `channel`을 조정하세요.

검증 항목: 375~1440px 화면, 모바일 메뉴와 키보드 복귀, 비활성 메뉴, 목록·상세·404, 관리자 로그인, 초안 비공개, 파일 권한, 공개·수정·삭제, 페이지 이동, 업로드 제한, 로그아웃 후 기존 세션 무효화. 별도 재시작 테스트는 3200 포트에서 게시물·첨부파일·로그인 세션의 보존을 확인합니다.

## 폴더 구조

- `src/app/`: 공개 페이지·관리자 페이지·서버 API
- `src/components/`: 공통 UI, 목록, 관리자 입력 화면
- `src/lib/`: 인증, 저장소, 게시물 및 파일 처리
- `scripts/`: 초기 설정과 재시작 테스트
- `supabase/schema.sql`: 온라인 저장소 초기화
- `tests/`: 브라우저 검증
- `docs/PROJECT_SPEC.md`: 확정 기획서

## 학교 서버 이전

서버 OS, Node.js 버전, 프로세스 상시 실행, HTTPS, 도메인, 지속 저장 볼륨, 백업 권한을 확인한 뒤 결정합니다. Node 서버로 옮기면 Supabase 연결을 유지할 수 있습니다. 로컬 SQLite를 사용할 경우 `.data`를 배포 디렉터리 외부의 지속 볼륨에 두고 `DATA_DIR`로 지정하세요. SQLite 모드는 한 서버 인스턴스용입니다.

SQLite 백업은 서비스를 중지한 뒤 `.data` 전체(업로드 포함)를 복사하는 방법을 권합니다. 온라인 데이터는 DB의 `records`와 `login_limits`, Storage의 `notice-files`를 별도로 백업합니다. 다른 DB로 이전하려면 `src/lib/store.ts` 어댑터 및 데이터 이관 작업이 필요합니다. GitHub에는 게시물·첨부파일이 백업되지 않습니다.

이번 버전은 단일 관리자 테스트 범위입니다. 메인 문안 관리, 다른 게시판, 검색, 다국어는 후속 개발 대상입니다. 테스트 동안 검색엔진 색인을 막고 있으며, 정식 공개 시 기관 정보와 메타데이터를 확정하고 색인 설정을 변경하세요.
