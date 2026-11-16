// Search-engine facing facts about the institute. Keep in sync with the footer.

export const siteUrl = 'https://okinawa.khu.ac.kr';

// Paste the content value of each search console's "HTML tag" verification here.
// Google Search Console: <meta name="google-site-verification" content="...">
// Naver Search Advisor:  <meta name="naver-site-verification" content="...">
export const siteVerification = {
  google: 'iGMlijM_TBaCiqQ2STK3Ut0s2PrzpEyvC-oIOZjdm1E',
  naver: '',
};

// Names people actually type when searching, so engines connect them to this site.
const alternateNames = [
  '글로벌류큐·오키나와연구소',
  '글로벌류큐오키나와연구소',
  '경희대 글로벌류큐오키나와연구소',
  '경희대 오키나와연구소',
  '경희대학교 오키나와연구소',
  '오키나와연구소',
  'Global Institute for Ryukyu and Okinawa Studies',
  'グローバル琉球・沖縄研究所',
  '慶熙大学校 グローバル琉球・沖縄研究所',
];

export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '경희대학교 글로벌류큐·오키나와연구소',
    alternateName: alternateNames,
    url: `${siteUrl}/`,
    inLanguage: ['ko', 'ja'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ResearchOrganization',
    name: '경희대학교 글로벌류큐·오키나와연구소',
    alternateName: alternateNames,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/images/institute-mark.png`,
    image: `${siteUrl}/images/og-image.png`,
    email: 'okinawa@khu.ac.kr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '덕영대로 1732 경희대학교 외국어대학관 233호',
      addressLocality: '용인시 기흥구',
      addressRegion: '경기도',
      addressCountry: 'KR',
    },
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: '경희대학교',
      alternateName: 'Kyung Hee University',
      url: 'https://www.khu.ac.kr/',
    },
    sameAs: ['https://ryukyuokinawa2.tistory.com/'],
  },
];

// Per-page descriptions shown under the title in search results.
export const pageDescriptions = {
  ko: {
    home: '경희대학교 글로벌류큐·오키나와연구소(경희대 오키나와연구소) 공식 홈페이지. 인문학을 기반으로 류큐·오키나와와 동아시아의 제국주의·식민주의 문제를 연구하며, 학술행사와 공동연구, 연구성과를 소개합니다.',
    about:
      '경희대학교 글로벌류큐·오키나와연구소의 설립 목적과 비전을 소개합니다. 오키나와의 경험을 통해 동아시아의 제국주의와 식민주의 문제를 인문학적으로 살펴봅니다.',
    people: '경희대학교 글로벌류큐·오키나와연구소의 연구책임자와 연구진을 소개합니다.',
    research:
      '글로벌류큐·오키나와연구소의 연구사업과 사회적연결회복 컨소시엄 등 공동연구를 소개합니다.',
    news: '경희대학교 글로벌류큐·오키나와연구소의 공지사항, 채용과 행사 소식입니다.',
    activities:
      '콜로키움, 국제워크숍, 학술대회 등 글로벌류큐·오키나와연구소의 학술활동 기록입니다.',
    publications: '글로벌류큐·오키나와연구소의 연구 성과와 출판물, 언론 서평을 소개합니다.',
    launch: '사회적연결회복 컨소시엄 출범식 안내와 축하 메시지입니다.',
    archive: '글로벌류큐·오키나와연구소의 공동연구 활동을 영상으로 기록해 모아 둔 아카이브입니다.',
  },
  ja: {
    home: '慶熙大学校グローバル琉球・沖縄研究所の公式サイト。人文学を基盤に、琉球・沖縄と東アジアにおける帝国主義・植民地主義の問題を研究し、学術活動や共同研究、研究成果を紹介します。',
    about: '慶熙大学校グローバル琉球・沖縄研究所の設立目的とビジョンを紹介します。',
    people: '慶熙大学校グローバル琉球・沖縄研究所の研究代表者と研究者を紹介します。',
    research:
      'グローバル琉球・沖縄研究所の研究事業と、社会的つながり回復コンソーシアムなどの共同研究を紹介します。',
    news: '慶熙大学校グローバル琉球・沖縄研究所のお知らせです。',
    activities:
      'コロキウム、国際ワークショップ、学術大会など、グローバル琉球・沖縄研究所の学術活動の記録です。',
    publications: 'グローバル琉球・沖縄研究所の研究成果と出版物を紹介します。',
    launch: '社会的つながり回復コンソーシアム発足式のご案内と祝辞です。',
    archive: 'グローバル琉球・沖縄研究所の共同研究活動を映像で記録したアーカイブです。',
  },
} as const;
