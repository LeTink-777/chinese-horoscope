import Link from 'next/link';

/** Бамбуковый паттерн фоном, 3% прозрачности. */
const BAMBOO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="320" viewBox="0 0 220 320">
  <g fill="none" stroke="#F5EDD8" stroke-width="2" stroke-linecap="round">
    <path d="M30 -10 V330 M58 -10 V330"/>
    <path d="M30 58 h28 M30 152 h28 M30 246 h28"/>
    <path d="M150 -10 V330 M172 -10 V330"/>
    <path d="M150 14 h22 M150 106 h22 M150 198 h22 M150 290 h22"/>
    <path d="M58 74 q42 -12 62 -44 M58 168 q48 -8 72 -38"/>
    <path d="M150 128 q-40 -14 -56 -44 M150 224 q-44 -10 -62 -40"/>
  </g>
</svg>`;

export function BambooBackground() {
  const url = `url("data:image/svg+xml,${encodeURIComponent(BAMBOO_SVG)}")`;
  return <div className="bamboo-bg" style={{ backgroundImage: url }} aria-hidden="true" />;
}

interface LanternSpec {
  left: string;
  width: number;
  cord: number;
  delay: string;
  duration: string;
  opacity: number;
}

const LANTERNS: LanternSpec[] = [
  { left: '6%', width: 54, cord: 80, delay: '0s', duration: '7s', opacity: 0.95 },
  { left: '20%', width: 34, cord: 150, delay: '1.2s', duration: '8.5s', opacity: 0.6 },
  { left: '48%', width: 26, cord: 60, delay: '2.4s', duration: '9.5s', opacity: 0.4 },
  { left: '73%', width: 44, cord: 120, delay: '0.7s', duration: '7.8s', opacity: 0.75 },
  { left: '89%', width: 62, cord: 46, delay: '1.9s', duration: '8.2s', opacity: 0.9 },
];

/** Вертикальные красные фонари с золотыми кистями. */
export function Lanterns() {
  return (
    <div className="lantern-field" aria-hidden="true">
      {LANTERNS.map((l, i) => (
        <div
          key={i}
          className="lantern"
          style={
            {
              left: l.left,
              opacity: l.opacity,
              animationDelay: l.delay,
              animationDuration: l.duration,
              '--w': `${l.width}px`,
              '--cord': `${l.cord}px`,
            } as React.CSSProperties
          }
        >
          <div className="lantern-cord" />
          <div className="lantern-cap" />
          <div className="lantern-body" />
          <div className="lantern-cap" />
          <div className="lantern-tassel" />
          <div className="lantern-tassel-knot" />
        </div>
      ))}
    </div>
  );
}

export function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="logo">
          <span className="logo-glyph cjk">龙</span>
          <span className="logo-text">Китайский гороскоп</span>
        </Link>
        <span className="topbar-tagline">Прогноз на 2026 год</span>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <span>Евдокимов Даниил Владимирович · ИНН 381928138362 · Самозанятый</span>
        <span style={{ display: 'flex', gap: 18 }}>
          <Link href="/blog">Блог</Link>
          <Link href="/privacy">Политика конфиденциальности</Link>
          <Link href="/offer">Оферта</Link>
        </span>
      </div>
    </footer>
  );
}
