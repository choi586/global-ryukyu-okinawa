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
  /** 현장 사진. public/images/consortium/events/ 에 넣은 파일 이름. link 가 있으면 사진을 눌러도 그 글로 갑니다. */
  image?: string;
  /** 사진 설명 (화면 낭독기용) */
  imageAlt?: string;
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
  {
    kind: '콜로키움',
    title: '동아시아 고립 서사 콜로키움 02: 폐쇄적 관계망의 해체와 주체적 연결의 회복',
    date: '2026. 11. 13.',
    place: '경희대학교 국제캠퍼스',
    summary:
      '서브컬처 텍스트에 나타난 고립의 서사와 실천을 살폈습니다. 오시미 슈조의 『피의 흔적』과 후지모토 타츠야의 『파이어펀치』를 중심으로 이상혁 교수(조선대학교)가 발표했습니다.',
    image: 'colloquium-02.webp',
    imageAlt: '동아시아 고립 서사 콜로키움 02 포스터',
    link: 'https://okinawa.khu.ac.kr/activities/east-asian-isolation-narratives-colloquium-02',
  },
  {
    kind: '워크숍',
    title: '제주-오키나와 국제워크숍: 섬의 타자들, 고립의 기억',
    date: '2026. 10. 30.',
    place: '제주대학교',
    summary:
      '오키나와·대만·제주의 한센병, 전쟁, 국가폭력을 둘러싼 고립의 기억을 살펴본 컨소시엄 학술행사입니다. 제주대학교 인문대학 현석재에서 대면과 Zoom으로 함께 진행했습니다.',
    image: 'workshop-2026-jeju.webp',
    imageAlt: '제주-오키나와 국제워크숍 참가자들이 현수막을 들고 찍은 단체사진',
    link: 'https://okinawa.khu.ac.kr/activities/jeju-okinawa-international-workshop-2026',
  },
  {
    kind: '콜로키움',
    title: '동아시아 고립 서사 콜로키움 01: 역사의 주변부에서 들려오는 목소리',
    date: '2026. 10. 12.',
    place: '온라인(Zoom)',
    summary:
      '식민과 냉전이 낳은 다층적 고립을 넘어서. 최말순 교수(대만 국립정치대학)가 「전쟁·식민·국가: 대만을 중심으로 본 동아시아의 역사 경험과 문학적 재현」을 발제했습니다.',
    image: 'colloquium-01.webp',
    imageAlt: '동아시아 고립 서사 콜로키움 01 포스터',
    link: 'https://okinawa.khu.ac.kr/activities/east-asian-isolation-narratives-colloquium-01',
  },
];
