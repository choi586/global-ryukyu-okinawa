// A quiet motion built on the institute symbol: the mark rises softly and
// ripples spread once and settle. CSS animations
// run a single time and end on their final frame, leaving a still image.

const SIZE = 520;
const C = SIZE / 2;
const ripples = [118, 158, 198, 238];

export function HeroRipple() {
  return (
    <figure className="hero-ripple" aria-hidden="true">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="presentation" focusable="false">
        <g className="hero-ripple-rings">
          {ripples.map((r, i) => (
            <circle key={r} cx={C} cy={C} r={r} style={{ animationDelay: `${0.9 + i * 0.35}s` }} />
          ))}
        </g>
        <image
          className="hero-ripple-mark"
          href="/images/institute-mark.png"
          x={C - 82}
          y={C - 66}
          width={164}
          height={133}
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    </figure>
  );
}
