import { asset } from '@/lib/base-path';

export const dynamic = 'force-static';

const img = (name: string) => asset(`/images/consortium/${name}`);

const keywords = [
  {
    word: '섬',
    en: 'Island',
    text: '고립의 장소와 조건. 오키나와·제주·대만·소록도, 전쟁과 냉전이 경계로 만든 자리에서 고립을 봅니다.',
  },
  {
    word: '틈',
    en: 'Gap',
    text: '공적 기록과 개인 서사 사이의 간극. 측정으로는 잡히지 않는 ‘구조적 침묵’을 읽습니다.',
  },
  {
    word: '곁',
    en: 'Beside',
    text: '연결의 회복. 듣고, 옮기고, 이어서 이야기를 다시 관계로 돌려줍니다.',
  },
];

const facts = [
  ['지원사업', '2026 한국연구재단 글로벌인문사회융합연구지원사업 (컨소시엄형)'],
  ['총괄 과제', '생애주기별 사회적 고립의 이해와 사회적 연결 회복을 위한 융합연구'],
  ['세부과제 3', '동아시아 지역연구 관점에서 본 사회적 고립의 사회문화적 서사와 의미구조 분석'],
  ['연구책임자', '손지연 (경희대학교 교수, 글로벌류큐·오키나와연구소장)'],
  ['연구기간', '2026. 9. 1. – 2031. 8. 31.'],
];

const axes = [
  {
    no: '01',
    kind: '국가폭력',
    image: 'boundary.webp',
    title: '경계가 만든 침묵',
    places: '제주 4·3 · 대만 백색테러',
    text: '국가가 그은 경계 안팎에서 말할 수 없게 된 사람들의 기록을 재판 사료와 증언, 문학으로 다시 읽습니다.',
  },
  {
    no: '02',
    kind: '전쟁',
    image: 'routes.webp',
    title: '바다를 건넌 사람들',
    places: '오키나와전 · 재일 디아스포라',
    text: '전장과 이주의 경로를 따라 흩어진 삶을 추적하고, 두 사회 어디에도 온전히 속하지 못한 이중의 소외를 살핍니다.',
  },
  {
    no: '03',
    kind: '질병',
    image: 'segregation.webp',
    title: '격리의 섬',
    places: '소록도 · 애락원 · 남정원 · 낙생원',
    text: '한센병 요양소 네트워크가 남긴 격리의 경험을 원내 잡지와 문예, 증언집을 통해 네 지역에 걸쳐 비교합니다.',
  },
];

const stages = [
  {
    step: '1단계',
    name: '고립을 읽다',
    tag: '섬 · 틈',
    image: 'silence.webp',
    question: '공적 기록과 개인 서사 사이의 ‘구조적 침묵’은 어떻게 만들어지는가',
    years: [
      ['1차', '고립서사 자료 기반 구축'],
      ['2차', '증언·구술과 텍스트 분석'],
      ['3차', '공간·세대 융합 분석'],
    ],
  },
  {
    step: '2단계',
    name: '곁을 잇다',
    tag: '곁',
    image: 'connection.webp',
    question: '서사는 어떻게 관계를 회복시키는가',
    years: [
      ['4차', '동아시아 고립 유형론과 서사 모델'],
      ['5차', '세대 교차 현장 적용'],
      ['6차', '고립 인문학 집대성'],
    ],
  },
];

const methods = [
  ['질적 서사', '구술 생애사 · 심층면접 · 문학과 문화 서사 분석'],
  ['디지털 코퍼스', '토픽 모델링 · 감성 분석 · 다국어 메타데이터'],
  ['공간 분석', 'QGIS 기반 고립의 공간 지도화와 시각화'],
];

const shifts = [
  ['수치, 두려움, 체념', '경청, 응답, 환대'],
  ['침묵, 격리, 단절', '증언, 왕래, 잇기'],
  ['낙인, 망각, 빼앗긴 말', '이름 부르기, 기억, 섬말 되찾기'],
  ['수용소·요양소, 경계, 홀로', '마을, 가로지르기, 이야기 품앗이'],
];

const islandWords = [
  {
    place: '제주',
    word: '수눌음',
    reading: 'sunureum',
    text: '‘수눌어간다’에서 온 말. 이웃끼리 순번을 정해 품을 나누던 제주의 관행입니다.',
  },
  {
    place: '오키나와',
    word: '유이마루',
    reading: 'ゆいまーる',
    text: '맺음(結い)과 돌아감(回る). 차례로 일손을 나누던 관행에서 서로 돕는 마음을 가리키는 말이 되었습니다.',
  },
  {
    place: '대만',
    word: '방반',
    reading: '放伴 pàng-phuānn',
    text: '대만어로 ‘돌아가며 서로 돕다’. 서로 품을 바꾼다는 뜻의 相換工과 통합니다.',
  },
];

const programs = [
  {
    group: '서사 처방',
    items: [
      [
        '이야기 수눌음',
        '청년이 고립 노인과 국가폭력 경험 세대의 생애사를 듣고 기록하는 세대 교차 기록',
      ],
      ['이야기 처방전', '고립 청년과 노인을 위한 읽기·쓰기·낭독 프로그램'],
    ],
  },
  {
    group: '번역 · 낭독',
    items: [
      ['섬의 목소리 낭독회', '연구진이 번역한 작품을 낭독극과 북토크로 무대에 올립니다'],
      ['「고립을 읽다」 시리즈', '영상, 숏폼, 오디오북과 팟캐스트로 만나는 고립의 서사'],
    ],
  },
  {
    group: '인문강좌',
    items: [
      [
        '이달의 고립읽기',
        '오키나와·대만·재일 작가와 감독을 초청해 문학·영화·구술로 고립을 읽는 강좌',
      ],
      ['기억의 달력', '2·28, 4·3, 6·23 오키나와 위령의 날, 세계 한센병의 날에 맞춘 강좌'],
      ['고립을 보는 영화관', '증언·기록영화 상영과 해설'],
    ],
  },
  {
    group: '현장 답사',
    items: [
      ['길 위의 고립서사', '소록도, 제주 4·3 유적, 오키나와 애락원·남정원, 대만 낙생원 답사'],
      ['세 섬 인문답사', '제주·오키나와·대만을 잇는 학생 교류 답사'],
      ['찾아가는 고립인문학', '고등학교, 고립·은둔 지원센터, 복지관, 도서관, 독립서점 출강'],
    ],
  },
  {
    group: '연례 행사 · 시민 참여',
    items: [
      ['곁주간', '강연, 낭독극, 영화제, 콜로키엄, 전시를 한 주에 모은 인문 주간'],
      ['내 곁의 이야기 공모전', '고립과 회복의 수기·숏폼 공모, 수상작 선집 출간'],
      ['청소년 그래픽노블', '고립서사 만화를 제작해 학교와 청소년센터에 배포'],
    ],
  },
];

const outputs = [
  {
    type: '연구총서 1',
    status: '2차 연도 간행 예정',
    title: '『격리』',
    text: '제국의 요양소에서 동아시아의 증언으로. 제도, 기관지·잡지, 문학, 증언의 네 층위로 한센병 격리를 읽습니다.',
  },
  {
    type: '연구총서 2',
    status: '4차 연도 간행 예정',
    title: '『침묵』',
    text: '제주·오키나와·대만의 전쟁과 국가폭력. 말해지지 못한 것들의 자리를 추적합니다.',
  },
  {
    type: '자료·증언총서',
    status: '3–4차 연도 간행 예정',
    title: '증언과 구술의 선집',
    text: '한센병 증언·원내 잡지 문예 선역과, 사업단이 직접 채록한 구술 생애사 선집.',
  },
  {
    type: '디지털 아카이브',
    status: '3차 연도 1차 공개 예정',
    title: '목소리 군도',
    text: 'Archipelago of Voices. 섬마다 흩어진 목소리를 하나의 군도로 엮는 한·일·동아시아 비교 아카이브. 1,000건에서 3,000건으로 확장합니다.',
  },
];

const news = [
  {
    date: '2026. 10. 16.',
    kind: '행사',
    title: '사회적연결회복 컨소시엄 출범식 · 축하 메시지',
    href: 'https://okinawa.khu.ac.kr/launch',
  },
  {
    date: '2026. 10.',
    kind: '현장',
    title: '출범식 현장 사진 스케치',
    href: 'https://okinawa.khu.ac.kr/activities/social-connection-consortium-launch-photo-sketch',
  },
  {
    date: '',
    kind: '연구',
    title: '컨소시엄 연구 방법과 참여기관 역할 소개',
    href: 'https://okinawa.khu.ac.kr/research',
  },
];

const partners = [
  {
    name: '고려대학교 KU마음건강연구소',
    role: '주관 · 총괄',
    text: '심리·신경생물학적 기제 규명, 디지털 기반 측정·평가와 개입, 통합 설명모델',
  },
  {
    name: '고려대학교 고령사회연구원',
    role: '세부과제',
    text: '행정·건강보험·패널 데이터로 고립의 구조적 분포와 질병부담, 건강 불평등 분석',
  },
  {
    name: '경희대학교 글로벌류큐·오키나와연구소',
    role: '세부과제 3',
    text: '동아시아 지역연구와 서사 자료로 고립의 역사적·문화적 맥락과 의미구조 해석',
    home: true,
  },
  {
    name: '무사시노대학 인간과학연구소',
    role: '글로벌 협력',
    text: '히키코모리 연구 경험을 바탕으로 한·일 고립과 은둔의 형성·회복 과정 비교',
  },
];

const researchers = [
  ['최말순', '국립정치대학', '대만문학 · 문학사'],
  ['고미부치 노리쓰구', '와세다대학', '일본 근현대문학'],
  ['고성만', '제주대학교', '사회사 · 역사사회학'],
  ['홍윤신', '오키나와대학', '국제관계사'],
  ['오가와 쇼타', '나고야대학', '동아시아 영화'],
  ['이상혁', '조선대학교', '일본문화학 · 디지털 인문학'],
  ['조수일', '한림대학교', '비교문학 · 재일문학'],
];

function SectionHead({
  no,
  label,
  title,
  lead,
}: {
  no: string;
  label: string;
  title: React.ReactNode;
  lead?: string;
}) {
  return (
    <div className="cs-head cs-reveal">
      <p className="cs-label">
        <span>{no}</span>
        {label}
      </p>
      <h2>{title}</h2>
      {lead ? <p className="cs-head-lead">{lead}</p> : null}
    </div>
  );
}

export default function ConsortiumPage() {
  return (
    <>
      {/* 1. Hero: East Asia map */}
      <section className="cs-hero" id="top" aria-labelledby="cs-hero-title">
        <div className="cs-hero-map" aria-hidden="true">
          <div className="cs-hero-stage">
            <div className="cs-hero-drift">
              <img className="cs-hero-photo" src={img('hero-deep-sea.webp')} width={2048} height={1152} alt="" fetchPriority="high" />
              <svg className="cs-hero-lines" viewBox="0 0 2048 1152" preserveAspectRatio="none">
                <g className="cs-hero-gaps">
                  <path pathLength={1} d="M1396 398 Q1432 552 1323 687" />
                  <path pathLength={1} d="M1323 687 Q1130 690 928 812" />
                  <path pathLength={1} d="M928 812 Q1080 520 1396 398" />
                </g>
                <path className="cs-hero-glow cs-hero-l1" pathLength={1} d="M1396 398 Q1432 552 1323 687" />
                <path className="cs-hero-glow cs-hero-l2" pathLength={1} d="M1323 687 Q1130 690 928 812" />
                <path className="cs-hero-glow cs-hero-l3" pathLength={1} d="M928 812 Q1080 520 1396 398" />
                <path className="cs-hero-line cs-hero-l1" pathLength={1} d="M1396 398 Q1432 552 1323 687" />
                <path className="cs-hero-line cs-hero-l2" pathLength={1} d="M1323 687 Q1130 690 928 812" />
                <path className="cs-hero-line cs-hero-l3" pathLength={1} d="M928 812 Q1080 520 1396 398" />
                <path className="cs-hero-comet" pathLength={1} d="M1396 398 Q1432 552 1323 687 Q1130 690 928 812 Q1080 520 1396 398" />
                <circle className="cs-hero-ring cs-hero-p1" cx="1396" cy="398" r="26" />
                <circle className="cs-hero-ring cs-hero-p2" cx="1323" cy="687" r="26" />
                <circle className="cs-hero-ring cs-hero-p3" cx="928" cy="812" r="26" />
                <circle className="cs-hero-dot cs-hero-p1" cx="1396" cy="398" r="5" />
                <circle className="cs-hero-dot cs-hero-p2" cx="1323" cy="687" r="5" />
                <circle className="cs-hero-dot cs-hero-p3" cx="928" cy="812" r="5" />
              </svg>
            </div>
          </div>
        </div>
        <div className="cs-shell cs-hero-body">
          <p className="cs-hero-keys" aria-label="섬, 틈, 곁">
            <span>섬</span>
            <span>틈</span>
            <span>곁</span>
          </p>
          <h1 id="cs-hero-title">
            <span className="cs-hero-mask"><span>고립을 읽다,</span></span>
            <span className="cs-hero-mask"><span>곁을 잇다</span></span>
          </h1>
        </div>
        <a className="cs-scroll" href="#about" aria-label="사업단 소개로 내려가기"><span />SCROLL</a>
      </section>

      {/* 2. Statement */}
      <section className="cs-section cs-statement" id="about" aria-labelledby="cs-statement-title">
        <div className="cs-shell">
          <p className="cs-label cs-reveal">
            <span>01</span>사업단 소개
          </p>
          <h2 className="cs-statement-text cs-reveal" id="cs-statement-title">
            세 섬의 기억을 읽고,<br />다시 곁을 잇습니다.
          </h2>
          <p className="cs-intro-line">제주·오키나와·대만의 전쟁, 국가폭력, 질병의 경험을 증언과 번역, 서사로 잇는 연구.</p>
          <details className="cs-details"><summary>사업 개요</summary>
            <dl className="cs-facts">{facts.map(([term, value]) => (<div key={term}><dt>{term}</dt><dd>{value}</dd></div>))}</dl>
          </details>
          <ul className="cs-keywords">
            {keywords.map((keyword) => (
              <li key={keyword.word} className="cs-reveal">
                <p className="cs-keyword-word">
                  {keyword.word}
                  <span>{keyword.en}</span>
                </p>
                <p>{keyword.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Research */}
      <section className="cs-section cs-research" id="research" aria-labelledby="cs-research-title">
        <div className="cs-shell">
          <SectionHead
            no="02"
            label="주요 연구"
            title={<span id="cs-research-title">세 개의 축으로 고립을 읽습니다</span>}
          />
          <ul className="cs-axes">
            {axes.map((axis) => (
              <li key={axis.no} className="cs-axis cs-reveal">
                <div className="cs-axis-body">
                  <span className="cs-axis-no" aria-hidden="true">{axis.no}</span>
                  <p className="cs-axis-kind">{axis.kind}</p>
                  <h3>{axis.title}</h3>
                  <p className="cs-axis-places">{axis.places}</p>
                  <p className="cs-axis-text">{axis.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <details className="cs-details"><summary>연구 계획과 방법</summary>
          <div className="cs-stages">
            {stages.map((stage) => (
              <article key={stage.step} className="cs-stage cs-reveal">
                <div className="cs-stage-body">
                  <p className="cs-stage-step">
                    {stage.step}
                    <span>{stage.tag}</span>
                  </p>
                  <h3>{stage.name}</h3>
                  <p className="cs-stage-question">{stage.question}</p>
                  <ol>
                    {stage.years.map(([year, goal]) => (
                      <li key={year}>
                        <span>{year}</span>
                        {goal}
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            ))}
          </div>

          <div className="cs-method-row">
            <div className="cs-method cs-reveal">
              <h3>질적 · 양적 · 공간, 세 방법의 교차</h3>
              <dl>
                {methods.map(([name, text]) => (
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="cs-shift cs-reveal">
              <h3>고립에서 곁으로</h3>
              <table>
                <thead>
                  <tr>
                    <th scope="col">고립에서</th>
                    <th scope="col">곁으로</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map(([from, to]) => (
                    <tr key={from}>
                      <td>{from}</td>
                      <td>{to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </details>
        </div>
      </section>

      {/* Island words band */}
      <section className="cs-band" aria-labelledby="cs-band-title">
        <img
          className="cs-band-bg"
          src={img('sea-chain.webp')}
          width={1600}
          height={900}
          alt=""
          loading="lazy"
        />
        <div className="cs-shell cs-band-inner">
          <div className="cs-reveal">
            <p className="cs-label cs-label-light">이야기 품앗이 인문학</p>
            <h2 id="cs-band-title">
              섬마다 연결의 말이
              <br />
              있었습니다
            </h2>
            <p className="cs-band-lead">서로 돕고, 이야기를 나누던 섬의 언어.</p>
            <p className="cs-band-steps">
              <span>듣기</span>
              <span>옮기기</span>
              <span>잇기</span>
            </p>
          </div>
          <ul className="cs-words">
            {islandWords.map((item) => (
              <li key={item.word} className="cs-reveal">
                <p className="cs-word-place">{item.place}</p>
                <p className="cs-word">
                  {item.word}
                  <span>{item.reading}</span>
                </p>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Programs */}
      <section className="cs-section cs-programs" id="programs" aria-labelledby="cs-programs-title">
        <div className="cs-shell">
          <SectionHead
            no="03"
            label="대중 확산 프로그램"
            title={<span id="cs-programs-title">연구를 곁으로 옮기는 일</span>}
          />
          <div className="cs-program-layout">
            <div className="cs-program-groups">
              {programs.map((group, i) => (
                <section key={group.group} className="cs-program-group cs-reveal">
                  <h3>
                    <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    {group.group}
                  </h3>
                  <ul>
                    {group.items.map(([name, text]) => (
                      <li key={name}>
                        <strong>{name}</strong>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              <p className="cs-note">프로그램 명칭과 일정은 준비 과정에서 달라질 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Archive & outputs */}
      <section className="cs-section cs-archive" id="archive" aria-labelledby="cs-archive-title">
        <div className="cs-shell">
          <SectionHead
            no="04"
            label="아카이브 · 성과"
            title={<span id="cs-archive-title">흩어진 목소리를 하나의 군도로</span>}
          />
          <div className="cs-film cs-reveal">
            <div className="cs-film-player">
              <video
                controls
                preload="none"
                playsInline
                poster={img('film-poster.webp')}
                aria-label="사업단 영상 「고립을 읽다」 30초"
              >
                <source src={img('film.mp4')} type="video/mp4" />
              </video>
            </div>
            <div className="cs-film-copy">
              <p className="cs-card-type">영상 · 30초</p>
              <h3>마음을 잇다, 세상을 잇다</h3>

            </div>
          </div>
          <ul className="cs-outputs">
            {outputs.map((item) => (
              <li key={item.title} className="cs-output cs-reveal">
                <p className="cs-card-type">{item.type}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <p className="cs-output-status">{item.status}</p>
              </li>
            ))}
          </ul>
          <div className="cs-news cs-reveal">
            <h3>소식</h3>
            <ul>
              {news.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>
                    <span className="cs-news-kind">{item.kind}</span>
                    <span className="cs-news-title">{item.title}</span>
                    {item.date ? <time>{item.date}</time> : <span />}
                    <span className="cs-news-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* People */}
      <section className="cs-section cs-people" id="people" aria-labelledby="cs-people-title">
        <div className="cs-shell">
          <SectionHead
            no="05"
            label="연구진 · 컨소시엄"
            title={<span id="cs-people-title">네 연구소가 함께 묻습니다</span>}
          />
          <ul className="cs-partners">
            {partners.map((partner) => (
              <li key={partner.name} className={'cs-reveal' + (partner.home ? ' is-home' : '')}>
                <p className="cs-partner-role">{partner.role}</p>
                <h3>{partner.name}</h3>
                <p>{partner.text}</p>
              </li>
            ))}
          </ul>
          <div className="cs-team cs-reveal">
            <div className="cs-team-lead">
              <p className="cs-card-type">세부과제 3 연구책임자</p>
              <h3>손지연</h3>
              <p>
                경희대학교 교수 · 글로벌류큐·오키나와연구소장
                <br />
                일본 근현대문학, 오키나와 문학
              </p>
            </div>
            <div className="cs-team-list">
              <p className="cs-card-type">공동연구원</p>
              <ul>
                {researchers.map(([name, place, field]) => (
                  <li key={name}>
                    <strong>{name}</strong>
                    <span>{place}</span>
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="cs-footer">
        <div className="cs-shell cs-footer-inner">
          <div className="cs-footer-brand">
            <img src={img('mark-white.png')} width={800} height={358} alt="" loading="lazy" />
            <p>
              <strong>사회적연결회복 컨소시엄 사업단</strong>
              <span>경희대학교 글로벌류큐·오키나와연구소</span>
              <span lang="en">The Global Research Institute for Ryukyu-Okinawa Studies</span>
            </p>
          </div>
          <address>
            <p>경기 용인시 기흥구 덕영대로 1732 경희대학교 외국어대학관 233호</p>
            <p>
              E-MAIL. <a href="mailto:okinawa@khu.ac.kr">okinawa@khu.ac.kr</a>
            </p>
          </address>
          <nav aria-label="관련 사이트">
            <a href="https://okinawa.khu.ac.kr/">글로벌류큐·오키나와연구소 홈</a>
            <a href="https://okinawa.khu.ac.kr/research">연구사업 안내</a>
            <a href="https://okinawa.khu.ac.kr/launch">컨소시엄 출범식</a>
          </nav>
        </div>
        <div className="cs-shell cs-footer-bottom">
          <p>
            이 연구는 한국연구재단 글로벌인문사회융합연구지원사업의 지원을 받아 수행하고 있습니다.
          </p>
          <p>© 2026 경희대학교 글로벌류큐·오키나와연구소</p>
        </div>
      </footer>
    </>
  );
}
