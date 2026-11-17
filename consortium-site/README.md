# 사회적연결회복 컨소시엄 사업단 사이트

연구소 앱과 별도로 설치·빌드하는 정적 사이트입니다. 공개 주소는 연구소 주소 아래의
`https://okinawa.khu.ac.kr/consortium/` 이며, 모든 페이지와 파일이 `/consortium` 경로 아래에 놓입니다.

```sh
cd consortium-site
pnpm install --frozen-lockfile
pnpm dev
```

개발 주소: http://127.0.0.1:3200/consortium/

```sh
pnpm typecheck
pnpm build
```

## 주소가 연결되는 방식

1. `pnpm build`는 배포 파일을 `dist/`에 만듭니다. 실제 사이트는 `dist/consortium/` 안에 있고,
   `dist/_redirects`가 맨 앞 주소(`/`)를 `/consortium/`으로 보냅니다.
2. 이 `dist/` 폴더를 Cloudflare Pages 프로젝트 `social-connectedness-consortium`에 올립니다.
   단독 주소는 `https://social-connectedness-consortium.pages.dev/consortium/` 입니다.
3. 연구소 주소의 연결 통로(`cloudflare-pages/public/_worker.js`, Pages 프로젝트 `khu-okinawa`)가
   `/consortium`으로 들어온 요청만 위 Pages 프로젝트로 넘깁니다. 나머지 주소는 그대로 연구소
   Worker로 갑니다. 연구소의 Worker, 데이터베이스, 로그인 쿠키는 사업단 사이트로 전달되지 않습니다.

경로 이름을 바꾸려면 `next.config.ts`의 `basePath`와 연결 통로의 `/consortium` 조건을 함께 바꿉니다.
Pages 프로젝트 이름이 바뀌면 연결 통로의 `consortiumOrigin`을 고칩니다.

## 배포

### GitHub에서 고치면 자동으로 배포되게 하기 (권장)

Cloudflare 대시보드 → Workers & Pages → Create → Pages → **Connect to Git** 에서 저장소
`choi586/global-ryukyu-okinawa`를 연결하고 아래처럼 설정합니다.

| 항목 | 값 |
| --- | --- |
| Production branch | 사업단 사이트 코드가 있는 브랜치 (`main`에 합친 뒤에는 `main`) |
| Root directory | `consortium-site` |
| Build command | `pnpm install --frozen-lockfile && pnpm build` |
| Build output directory | `dist` |

직접 올리기로 만든 기존 프로젝트는 Git 연결로 바꿀 수 없으므로 새 프로젝트를 만들어야 합니다.
새 프로젝트의 `pages.dev` 주소가 달라지면 연결 통로의 `consortiumOrigin`을 그 주소로 고치고
`pnpm deploy:pages`로 연결 통로를 다시 배포합니다.

### 직접 올리기

`pnpm build` 후 `dist/` 폴더를 Pages 프로젝트의 Create deployment 화면에 올립니다.

## 오디오북과 활동 기록 추가하기

메뉴의 **오디오북**(`/consortium/audiobook/`)과 **활동 기록**(`/consortium/records/`)은
`src/data/media.ts` 한 파일에서 목록을 읽습니다. 파일 안의 예시를 복사해 항목을 하나 추가하고
GitHub에 올리면 자동으로 배포됩니다.

- 오디오북: 지역(`한국` / `대만` / `오키나와(일본)`), 제목, 유튜브 주소. 음성 파일을 직접 올릴 때는
  `public/audio/`에 파일을 넣고 `audio`에 파일 이름을 적습니다.
- 활동 기록: 종류(`답사`, `콜로키움` 등), 제목, 장소, 날짜, 유튜브 주소. 종류가 두 가지 이상이면
  종류별 보기 버튼이 자동으로 생깁니다.

- 학술대회(`/consortium/conference/`): `src/data/conferences.ts`에서 읽습니다. 구분(국제학술대회 / 심포지엄 /
  콜로키움 / 워크숍), 제목, 날짜, 장소를 적고, 기록 영상이나 자세한 글 주소가 있으면 함께 적습니다.
  구분 이름은 같은 파일의 `conferenceKinds`에서 바꿉니다.

유튜브 주소는 주소창의 것을 그대로 붙여 넣으면 됩니다.

## 검색 노출

테스트 단계이므로 페이지에 검색 수집 차단(`noindex`)을 넣어 두었습니다. 공개할 때
`SITE_URL=https://okinawa.khu.ac.kr`을 지정하고 `src/app/layout.tsx`의 `robots` 설정을 변경하세요.

연구소 관련 링크는 https://okinawa.khu.ac.kr 의 전체 주소를 사용합니다.
