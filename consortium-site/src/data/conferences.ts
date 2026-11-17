// 학술대회 목록입니다. 항목을 하나 추가하고 GitHub에 올리면 사이트에 자동으로
// 반영됩니다. 가장 최근 것을 맨 위에 적습니다.

// 페이지의 구분 버튼입니다. 이름을 바꾸거나 순서를 바꾸려면 여기만 고칩니다.
export const conferenceKinds = ['국제학술대회', '심포지엄', '포럼', '콜로키움', '워크숍'] as const;
export type ConferenceKind = (typeof conferenceKinds)[number];

export type Conference = {
  kind: ConferenceKind;
  /** 행사 제목 */
  title: string;
  /** 날짜 (예: '2026. 10. 31.') */
  date?: string;
  /** 아직 열리지 않은 행사면 true ('예정' 표시가 붙습니다) */
  upcoming?: boolean;
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
export const conferences: Conference[] = [
  {
    kind: '포럼',
    title: '현지 학술답사·포럼: 남겨진 공간, 지워진 서사 / 배제된 자들의 목소리',
    date: '2027. 2. 14.–15.',
    upcoming: true,
    place: '군산 · 서울',
    summary:
      '와세다대학교 고미부치 노리쓰구 교수와 함께합니다. 14일은 군산 적산가옥 일대 현지 학술답사와 라운드테이블, 15일은 서울에서 포럼과 현장조사를 진행합니다.',
  },
];
