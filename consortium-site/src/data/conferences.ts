// 학술대회 목록입니다. 항목을 하나 추가하고 GitHub에 올리면 사이트에 자동으로
// 반영됩니다. 가장 최근 것을 맨 위에 적습니다.

// 페이지의 구분 버튼입니다. 이름을 바꾸거나 순서를 바꾸려면 여기만 고칩니다.
export const conferenceKinds = ['국제학술대회', '심포지엄', '콜로키움', '워크숍'] as const;
export type ConferenceKind = (typeof conferenceKinds)[number];

export type Conference = {
  kind: ConferenceKind;
  /** 행사 제목 */
  title: string;
  /** 날짜 (예: '2026. 10. 31.') */
  date?: string;
  /** 장소 */
  place?: string;
  /** 짧은 소개 */
  summary?: string;
  /** 기록 영상의 유튜브 주소 */
  youtube?: string;
  /** 자세한 글이나 자료집 주소 */
  link?: string;
};

/*
  추가 예시:

  {
    kind: '심포지엄',
    title: '행사 제목',
    date: '2026. 10. 31.',
    place: '제주 4·3 평화재단',
    summary: '한두 문장 소개',
    youtube: 'https://youtu.be/XXXXXXXXXXX',
    link: 'https://okinawa.khu.ac.kr/activities/...',
  },
*/
export const conferences: Conference[] = [];
