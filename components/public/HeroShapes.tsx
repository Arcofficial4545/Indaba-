/**
 * The four floating shapes at the hero corners: donut, star, spring and cube.
 *
 * They are inline SVG rather than rendered images so they weigh nothing, stay
 * sharp at any size and can pick up theme colours. They are decorative, so all
 * four are hidden from assistive technology, and they disappear below the sm
 * breakpoint where they would only crowd the text.
 */

function Donut() {
  return (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="shape-donut" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8ff7a" />
          <stop offset="55%" stopColor="#d9f65f" />
          <stop offset="100%" stopColor="#a4c521" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke="url(#shape-donut)"
        strokeWidth="20"
      />
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="4"
        strokeDasharray="30 170"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="shape-star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc75a" />
          <stop offset="60%" stopColor="#f5a623" />
          <stop offset="100%" stopColor="#d98a12" />
        </linearGradient>
      </defs>
      {/* A four point sparkle reads better than a five point star at this size */}
      <path
        d="M50 6 C54 32 68 46 94 50 C68 54 54 68 50 94 C46 68 32 54 6 50 C32 46 46 32 50 6 Z"
        fill="url(#shape-star)"
      />
    </svg>
  );
}

function Spring() {
  return (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="shape-spring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4170" />
          <stop offset="100%" stopColor="#1b1f3b" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <ellipse
          key={i}
          cx="50"
          cy={26 + i * 16}
          rx="30"
          ry="11"
          fill="none"
          stroke="url(#shape-spring)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function Cube() {
  return (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="shape-cube-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6ffcf" />
          <stop offset="100%" stopColor="#d9f65f" />
        </linearGradient>
      </defs>
      {/* Top face */}
      <path d="M50 12 L88 34 L50 56 L12 34 Z" fill="url(#shape-cube-a)" />
      {/* Left face, darkened */}
      <path d="M12 34 L50 56 L50 92 L12 70 Z" fill="#a4c521" />
      {/* Right face, darkest, so the form reads as solid */}
      <path d="M88 34 L88 70 L50 92 L50 56 Z" fill="#7d9718" />
    </svg>
  );
}

const SHAPES = [
  { Component: Donut, position: "top-6 left-6 size-16 lg:size-20", animation: "animate-float" },
  { Component: Star, position: "top-10 right-8 size-12 lg:size-16", animation: "animate-float-delayed" },
  { Component: Spring, position: "bottom-10 left-10 size-14 lg:size-18", animation: "animate-float-delayed" },
  { Component: Cube, position: "right-6 bottom-6 size-16 lg:size-20", animation: "animate-float" },
] as const;

export function HeroShapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
      {SHAPES.map(({ Component, position, animation }, index) => (
        <div
          key={index}
          className={`absolute drop-shadow-[0_12px_24px_rgba(15,23,42,0.28)] ${position} ${animation}`}
        >
          <Component />
        </div>
      ))}
    </div>
  );
}
