# 글로벌류큐·오키나와연구소 홈페이지

로컬 테스트용 Next.js 홈페이지입니다. 메인, 공지·소식(NEWS), 학술활동(ACTIVITIES), 연구·출판(PUBLICATIONS), 관리자 기능을 제공합니다. 나머지 메뉴는 준비 중입니다.

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

## Cloudflare: 추후 연결

사용자 결정에 따라 Vercel·Supabase 연결 작업은 중단했습니다. Cloudflare 리소스는 아직 생성하거나 배포하지 않았습니다.

- Workers: 홈페이지와 서버 기능
- D1: 공지·소식, 학술활동, 연구성과, 관리자 세션
- R2: 사진, 포스터, PDF 및 미리보기

현재 실행 저장소는 로컬 SQLite와 파일입니다. 클라우드 연결 시 `src/lib/store.ts`를 D1/R2 바인딩을 사용하는 어댑터로 교체하고 Workers용 프레임워크 빌드를 설정해야 합니다. 로컬 SQLite 모드를 그대로 Workers에 배포하면 안 됩니다.

```sh
pnpm export:cloudflare
```

위 명령은 `.data/cloudflare-export/`에 D1용 SQL, R2 파일, 크기와 SHA-256을 포함한 목록을 만듭니다. 네트워크 작업은 하지 않으며 로그인 세션과 비밀번호는 내보내지 않습니다. `cloudflare/schema.sql`은 추후 D1 초기화용입니다. SQL은 중복 ID가 있으면 실패하여 기존 온라인 글을 덮어쓰지 않습니다. 운영 데이터가 생긴 후 재이전은 별도 비교가 필요합니다.

연결 시 R2는 비공개 버킷으로 두고 Workers가 게시 상태를 확인한 후 파일을 제공합니다. `APP_URL`·관리자 해시는 서버 설정으로만 전달하며 Git에 넣지 않습니다. 배포 후 로그인·글 등록·수정·삭제, 초안 및 미리보기 접근 차단, 재배포 후 데이터 보존을 검증합니다.

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
