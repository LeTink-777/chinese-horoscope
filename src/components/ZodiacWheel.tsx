'use client';

import { ANIMAL_CHARS, ANIMALS } from '@/lib/chineseZodiac';

type Spin = 'idle' | 'fast' | 'settle';

interface Props {
  size?: number;
  spin?: Spin;
  settleIndex?: number;
  centerChar?: string;
  centerLabel?: string;
}

const R_OUTER = 148;
const R_RING = 132;
const R_CHAR = 112;
const R_INNER = 78;
const R_CORE = 46;

export default function ZodiacWheel({
  size = 300,
  spin = 'idle',
  settleIndex = 0,
  centerChar = '蛇',
  centerLabel = '2026',
}: Props) {
  const ticks = Array.from({ length: 12 }, (_, i) => i);

  const groupClass =
    spin === 'fast' ? 'wheel-rotate wheel-fast' : spin === 'settle' ? undefined : 'wheel-rotate';

  const groupStyle =
    spin === 'settle'
      ? {
          transform: `rotate(${1080 - settleIndex * 30}deg)`,
          transition: 'transform 1.5s cubic-bezier(0.12, 0.72, 0.18, 1)',
          transformOrigin: '50% 50%',
        }
      : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="-160 -160 320 320"
      role="img"
      aria-label="Круг китайского зодиака из двенадцати знаков"
    >
      <defs>
        <radialGradient id="wheelCore" cx="50%" cy="40%">
          <stop offset="0%" stopColor="rgba(196,30,30,0.55)" />
          <stop offset="100%" stopColor="rgba(196,30,30,0.03)" />
        </radialGradient>
        <linearGradient id="wheelGold" x1="0" y1="-1" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0C040" />
          <stop offset="100%" stopColor="#8C6A0F" />
        </linearGradient>
      </defs>

      {/* Неподвижная подсветка и указатель */}
      <circle cx="0" cy="0" r={R_CORE} fill="url(#wheelCore)" />
      <polygon points="0,-154 -7,-166 7,-166" fill="#F0C040" />

      <g className={groupClass} style={groupStyle}>
        <circle cx="0" cy="0" r={R_OUTER} fill="none" stroke="url(#wheelGold)" strokeWidth="1.2" />
        <circle cx="0" cy="0" r={R_RING} fill="none" stroke="#C41E1E" strokeWidth="0.6" opacity="0.75" />
        <circle cx="0" cy="0" r={R_INNER} fill="none" stroke="#D4A017" strokeWidth="0.6" opacity="0.6" />

        {ticks.map((i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const cx = Math.cos(angle) * R_CHAR;
          const cy = Math.sin(angle) * R_CHAR;
          const dividerAngle = ((i * 30 + 15 - 90) * Math.PI) / 180;

          return (
            <g key={i}>
              {/* радиальный разделитель сектора */}
              <line
                x1={Math.cos(dividerAngle) * R_INNER}
                y1={Math.sin(dividerAngle) * R_INNER}
                x2={Math.cos(dividerAngle) * R_OUTER}
                y2={Math.sin(dividerAngle) * R_OUTER}
                stroke="#3A1A0A"
                strokeWidth="0.8"
              />
              {/* геометрический знак животного */}
              <polygon
                points={`${cx},${cy - 22} ${cx + 19},${cy} ${cx},${cy + 22} ${cx - 19},${cy}`}
                fill="rgba(196,30,30,0.14)"
                stroke="#D4A017"
                strokeWidth="0.7"
              />
              <text
                x={cx}
                y={cy + 7}
                textAnchor="middle"
                fontSize="19"
                fill="#F0C040"
                className="cjk"
              >
                {ANIMAL_CHARS[i]}
              </text>
              <title>{ANIMALS[i]}</title>
            </g>
          );
        })}
      </g>

      {/* Неподвижный центр */}
      <circle cx="0" cy="0" r={R_CORE} fill="#0A0604" stroke="#D4A017" strokeWidth="0.8" />
      <text x="0" y="4" textAnchor="middle" fontSize="34" fill="#D4A017" className="cjk">
        {centerChar}
      </text>
      <text
        x="0"
        y="30"
        textAnchor="middle"
        fontSize="11"
        fill="#7A6A55"
        letterSpacing="2"
        fontFamily="var(--font-space-mono), monospace"
      >
        {centerLabel}
      </text>
    </svg>
  );
}
