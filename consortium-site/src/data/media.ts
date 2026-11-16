// 오디오북과 활동 기록(답사 영상 등) 목록입니다. 항목을 하나 추가하고 GitHub에 올리면
// 사이트에 자동으로 반영됩니다. 가장 최근 것을 맨 위에 적습니다.
//
// 유튜브 주소는 주소창의 것을 그대로 붙여 넣으면 됩니다.
//   https://www.youtube.com/watch?v=XXXXXXXXXXX
//   https://youtu.be/XXXXXXXXXXX

export const regions = ['한국', '대만', '오키나와(일본)'] as const;
export type Region = (typeof regions)[number];

export type Audiobook = {
  /** 지역. 비워 두면 '전체'에서만 보입니다. */
  region?: Region;
  /** 작품 제목 */
  title: string;
  /** 지은이, 옮긴이, 낭독자 등 한 줄 */
  credit?: string;
  /** 짧은 소개 */
  summary?: string;
  /** 재생 시간 (예: '12분') */
  length?: string;
  /** 유튜브 주소. 음성 파일을 직접 올릴 때는 audio 를 씁니다. */
  youtube?: string;
  /** public/audio/ 에 넣은 파일 이름 (예: 'okinawa-01.mp3') */
  audio?: string;
};

export type ActivityRecord = {
  /** 활동 종류 (예: '답사', '콜로키움', '워크숍', '낭독회') */
  kind: string;
  /** 영상 제목 */
  title: string;
  /** 장소 (예: '제주') */
  place?: string;
  /** 활동 날짜 (예: '2026. 10. 30.') */
  date?: string;
  /** 짧은 설명 */
  summary?: string;
  /** 유튜브 주소 */
  youtube: string;
  /** 세로 영상(쇼츠)이면 true */
  vertical?: boolean;
  /** 썸네일로 쓸 유튜브 자동 장면: 쇼츠는 'oar1'·'oar2'·'oar3', 일반 영상은 '1'·'2'·'3' */
  thumb?: string;
};

/*
  추가 예시:

  {
    region: '오키나와(일본)',
    title: '작품 제목',
    credit: '지은이 · 옮긴이 · 낭독',
    summary: '한두 문장 소개',
    length: '12분',
    youtube: 'https://youtu.be/XXXXXXXXXXX',
  },
*/
export const audiobooks: Audiobook[] = [
  {
    region: '오키나와(일본)',
    title: '소설 《백지 무루치》',
    youtube: 'https://youtu.be/wapjX__NzQI',
  },
];

/*
  추가 예시:

  {
    kind: '답사',
    title: '영상 제목',
    place: '제주',
    date: '2026. 10. 30.',
    summary: '한두 문장 설명',
    youtube: 'https://youtu.be/XXXXXXXXXXX',
  },
*/
export const activityRecords: ActivityRecord[] = [
  {
    kind: '답사',
    title: '제주 × 오키나와 4박5일 2편',
    place: '제주',
    youtube: 'https://youtu.be/Nm7rplMjz54',
    vertical: true,
  },
  {
    kind: '답사',
    title: '제주 × 오키나와 4박5일 1편',
    place: '제주',
    youtube: 'https://youtu.be/uqkbVAeJVQo',
    vertical: true,
  },
];
