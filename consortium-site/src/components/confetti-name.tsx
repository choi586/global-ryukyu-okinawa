'use client';

const colors = ['#a5dbe0', '#d6eef2', '#f4c95d', '#ef8a6f', '#8fb8ff', '#ffffff', '#55707f'];

// A name that throws a short burst of confetti from where it was pressed.
// Pieces are plain elements animated once and then removed.
export function ConfettiName({ name }: { name: string }) {
  const burst = (x: number, y: number) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = document.createElement('div');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = 'position:fixed;inset:0;z-index:200;pointer-events:none;overflow:hidden';
    document.body.appendChild(layer);
    const count = 70;
    let longest = 0;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      const size = 6 + Math.random() * 7;
      const round = Math.random() < 0.3;
      piece.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${
        round ? size : size * 0.45
      }px;border-radius:${round ? '50%' : '1px'};background:${
        colors[i % colors.length]
      };will-change:transform,opacity`;
      layer.appendChild(piece);
      // Fan upward, then fall.
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25;
      const speed = 160 + Math.random() * 300;
      const dx = Math.cos(angle) * speed;
      const up = Math.sin(angle) * speed;
      const fall = 260 + Math.random() * 320;
      const spin = (Math.random() - 0.5) * 1080;
      const duration = 1300 + Math.random() * 900;
      longest = Math.max(longest, duration);
      piece.animate(
        [
          { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
          {
            transform: `translate(calc(-50% + ${dx * 0.7}px), calc(-50% + ${up}px)) rotate(${spin * 0.5}deg)`,
            opacity: 1,
            offset: 0.35,
          },
          {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${up + fall}px)) rotate(${spin}deg)`,
            opacity: 0,
          },
        ],
        { duration, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'forwards' },
      );
    }
    window.setTimeout(() => layer.remove(), longest + 100);
  };

  return (
    <button
      type="button"
      className="cs-confetti-name"
      onClick={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        // Keyboard presses have no pointer position, so start from the name itself.
        const fromKeyboard = event.detail === 0;
        burst(
          fromKeyboard ? box.left + box.width / 2 : event.clientX,
          fromKeyboard ? box.top + box.height / 2 : event.clientY,
        );
      }}
    >
      <strong>{name}</strong>
    </button>
  );
}
