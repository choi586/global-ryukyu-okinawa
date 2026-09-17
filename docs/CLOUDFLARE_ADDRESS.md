# 요청한 테스트 주소 설정

목표: `https://khu.okinawa.workers.dev`

2026-09-18 확인 당시 실제 운영 계정에는 Worker `global-ryukyu-okinawa` 하나만 있으며 계정 하위 도메인은 `ryukyu-okinawa`였습니다. `khu` Worker는 아직 존재하지 않았습니다. 사용자 지시에 따라 새 Worker 생성과 계정 하위 도메인 변경은 실행하지 않았습니다.

1. Cloudflare의 Workers & Pages에서 **Your subdomain → Change**를 선택하고 `okinawa`를 입력합니다. 사용 가능한 이름인 경우 변경할 수 있습니다. 이는 계정의 모든 Workers 기본 주소에 영향을 줍니다.
2. 실제 기존 Worker의 이름도 `khu`인지 확인합니다. 현재 이름이 그대로라면 기존 Worker의 이름 변경 기능을 이용해야 하며, 새 Worker를 만들거나 D1/R2를 다시 생성하지 않습니다.
3. 주소 변경 후 기존 Worker의 `APP_URL`을 `https://khu.okinawa.workers.dev`로 맞춥니다. 관리자 저장의 출처 확인에 사용하는 값입니다. 저장소의 `wrangler.jsonc`에서도 `name`과 `vars.APP_URL`을 실제 이름/주소와 맞춰야 다음 배포에 잘못된 이름이 생성되지 않습니다.
4. `DB` 바인딩의 D1 ID `93aa30c7-901b-4d11-b379-2e5cf38f2cfb`, `MEDIA` 바인딩의 버킷 `global-ryukyu-okinawa-media`, 관리자 비밀 설정은 그대로 유지합니다. 이름 변경을 위해 데이터 복사나 재이전을 하지 않습니다.

변경한 주소에서는 관리자 로그인을 다시 해야 합니다. `okinawa` 사용 가능 여부는 아직 확인하지 않았습니다.

공식 안내: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
