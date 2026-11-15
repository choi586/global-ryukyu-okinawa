import type { Locale } from '@/i18n/config';

// A short self-drawing map of the Ryukyu arc. CSS animations run once and
// end on their final frame, so after ~4 seconds it is a still image.
// Coordinates are real (degrees); the projection is a simple equirectangular box.

const W = 560;
const H = 520;
const LON = [119, 133] as const;
const LAT = [22.5, 38] as const;
const PAD = 28;

function project(lat: number, lon: number): [number, number] {
  const x = PAD + ((lon - LON[0]) / (LON[1] - LON[0])) * (W - PAD * 2);
  const y = PAD + ((LAT[1] - lat) / (LAT[1] - LAT[0])) * (H - PAD * 2);
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

type Place = { ko: string; ja: string; lat: number; lon: number; size: number; label?: 'l' | 'r' | 'b' };

// Ordered north-east to south-west along the arc.
const chain: Place[] = [
  { ko: '가고시마', ja: '鹿児島', lat: 31.6, lon: 130.56, size: 3, label: 'r' },
  { ko: '아마미', ja: '奄美', lat: 28.3, lon: 129.5, size: 3.2, label: 'r' },
  { ko: '도쿠노시마', ja: '徳之島', lat: 27.8, lon: 128.95, size: 2.2 },
  { ko: '오키나와', ja: '沖縄', lat: 26.5, lon: 127.95, size: 0 },
  { ko: '미야코', ja: '宮古', lat: 24.8, lon: 125.3, size: 2.8, label: 'r' },
  { ko: '이시가키', ja: '石垣', lat: 24.4, lon: 124.16, size: 3, label: 'b' },
  { ko: '요나구니', ja: '与那国', lat: 24.47, lon: 122.99, size: 2.2 },
  { ko: '타이베이', ja: '台北', lat: 25.03, lon: 121.56, size: 3.4, label: 'l' },
];
const links: Place[] = [
  { ko: '제주', ja: '済州', lat: 33.4, lon: 126.55, size: 3.4, label: 'l' },
  { ko: '서울', ja: 'ソウル', lat: 37.57, lon: 126.98, size: 3.4, label: 'l' },
];
const naha = project(26.21, 127.68);

// Catmull-Rom through the chain, as cubic Bézier segments.
function smoothPath(points: [number, number][]) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function arc(from: [number, number], to: [number, number], bend: number) {
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  return `M${from[0]},${from[1]} Q${(mx - dy * bend).toFixed(1)},${(my + dx * bend).toFixed(1)} ${to[0]},${to[1]}`;
}

export function HeroMap({ locale }: { locale: Locale }) {
  const name = (p: Place) => (locale === 'ja' ? p.ja : p.ko);
  const chainPoints = chain.map((p) => project(p.lat, p.lon));
  const okinawa = chainPoints[3];
  const latLines = [24, 26, 28, 30, 32, 34, 36];
  const lonLines = [120, 122, 124, 126, 128, 130, 132];
  const islandsStart = 1.2;
  return (
    <figure className="hero-map" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} role="presentation" focusable="false">
        <g className="hero-map-grid">
          {latLines.map((lat, i) => {
            const y = project(lat, LON[0])[1];
            return (
              <g key={`lat${lat}`} style={{ animationDelay: `${i * 0.05}s` }}>
                <line x1={PAD} x2={W - PAD} y1={y} y2={y} />
                <text x={W - PAD + 4} y={y + 3}>
                  {lat}°
                </text>
              </g>
            );
          })}
          {lonLines.map((lon, i) => {
            const x = project(LAT[0], lon)[0];
            return (
              <g key={`lon${lon}`} style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                <line x1={x} x2={x} y1={PAD} y2={H - PAD} />
                <text x={x} y={H - PAD + 14} textAnchor="middle">
                  {lon}°
                </text>
              </g>
            );
          })}
        </g>

        <g className="hero-map-links">
          {links.map((p, i) => (
            <path
              key={p.ko}
              d={arc(okinawa, project(p.lat, p.lon), i === 0 ? -0.28 : 0.14)}
              pathLength={1}
              style={{ animationDelay: `${2.5 + i * 0.25}s` }}
            />
          ))}
        </g>

        <path className="hero-map-arc" d={smoothPath(chainPoints)} pathLength={1} />

        <g className="hero-map-places">
          {[...chain, ...links].map((p, i) => {
            if (!p.size) return null;
            const [x, y] = project(p.lat, p.lon);
            const isLink = i >= chain.length;
            const delay = isLink ? 2.9 + (i - chain.length) * 0.25 : islandsStart + i * 0.16;
            return (
              <g
                key={p.ko}
                className={isLink ? 'hero-map-place is-link' : 'hero-map-place'}
                style={{ animationDelay: `${delay}s` }}
              >
                <circle cx={x} cy={y} r={p.size} />
                {p.label && (
                  <text
                    x={p.label === 'r' ? x + 9 : p.label === 'l' ? x - 9 : x}
                    y={p.label === 'b' ? y + 18 : y + 4}
                    textAnchor={p.label === 'r' ? 'start' : p.label === 'l' ? 'end' : 'middle'}
                  >
                    {name(p)}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        <g className="hero-map-okinawa">
          <circle className="hero-map-pulse" cx={naha[0]} cy={naha[1]} r={9} />
          <circle className="hero-map-ring" cx={naha[0]} cy={naha[1]} r={14} />
          <ellipse
            className="hero-map-main"
            cx={okinawa[0] - 2}
            cy={okinawa[1] + 2}
            rx={3}
            ry={10}
            transform={`rotate(38 ${okinawa[0] - 2} ${okinawa[1] + 2})`}
          />
          <g className="hero-map-label">
            <line x1={naha[0] + 16} y1={naha[1] + 4} x2={naha[0] + 54} y2={naha[1] + 4} />
            <text className="hero-map-label-name" x={naha[0] + 60} y={naha[1] + 2}>
              {locale === 'ja' ? '沖縄' : '오키나와'}
            </text>
            <text className="hero-map-label-coord" x={naha[0] + 60} y={naha[1] + 18}>
              26°12′N 127°41′E
            </text>
          </g>
        </g>
      </svg>
    </figure>
  );
}
