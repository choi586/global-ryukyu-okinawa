// 아카이브 > 일반공동연구 영상 목록입니다. 가장 최근 것을 맨 위에 적습니다.
// 유튜브 주소는 주소창의 것을 그대로 붙여 넣으면 됩니다.
// 고립컨소시엄 영상은 사업단 사이트(consortium-site/src/data/media.ts)에서 관리합니다.

export type ArchiveVideo = {
  /** 활동 종류 (예: '심포지엄', '답사') */
  kind: string;
  /** 영상 제목 */
  title: string;
  /** 일본어 제목 (없으면 title 을 그대로 씁니다) */
  titleJa?: string;
  /** 장소 */
  place?: string;
  /** 날짜 (예: '2026. 10. 31.') */
  date?: string;
  /** 유튜브 주소 */
  youtube: string;
  /** 세로 영상(쇼츠)이면 true */
  vertical?: boolean;
};

export const jointResearchVideos: ArchiveVideo[] = [
  {
    kind: '심포지엄',
    title: '제주·오키나와 심포지엄 기록: 군사화된 인류세와 섬들의 생존',
    titleJa: '済州・沖縄シンポジウム「軍事化された人新世と島々の生存」',
    place: '제주',
    date: '2026. 10. 31.',
    youtube: 'https://youtu.be/2UzxYx6d-Us',
  },
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
