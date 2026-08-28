import React from 'react';
import { istd, istdFonts } from './theme';

/**
 * Reconstruction vectorielle du logo ISTD Fès.
 *
 * Le logo original n'est disponible qu'en .webp raster sur istd.ma. Le redessiner
 * en SVG permet d'animer ce qu'un bitmap ne permet pas : le tracé de la dent qui
 * s'écrit, et le balayage des deux fanions.
 *
 * `draw` (0 → 1) anime le tracé de la dent.
 * `flags` (0 → 1) anime l'entrée des fanions par la droite.
 */

const VB = { w: 768, h: 709 };

// Couronne : deux arcs qui se croisent au centre pour former l'encoche.
const CROWN_LEFT = 'M 74,250 C 58,138 102,44 166,44 C 220,44 248,98 258,136';
const CROWN_RIGHT = 'M 246,140 C 258,94 294,44 352,46 C 416,50 452,148 466,244';

// Racines : deux paires d'arcs qui convergent vers une pointe.
const ROOTS = [
  'M 120,448 C 116,542 132,628 150,674',
  'M 210,448 C 208,540 192,618 176,666',
  'M 310,448 C 306,542 322,628 340,672',
  'M 398,448 C 396,540 380,618 364,664',
];

// Longueurs approximatives pour le stroke-dash (pas besoin d'être exactes,
// seulement supérieures à la longueur réelle du tracé).
const CROWN_LEN = 460;
const ROOT_LEN = 240;

type Props = {
  draw?: number;
  flags?: number;
  className?: string;
  style?: React.CSSProperties;
};

export const IstdLogo: React.FC<Props> = ({ draw = 1, flags = 1, style }) => {
  const d = Math.max(0, Math.min(1, draw));
  const f = Math.max(0, Math.min(1, flags));

  const strokeCommon = {
    fill: 'none',
    stroke: istd.blue,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      role="img"
      aria-label="ISTD Fès — École africaine de prothésistes dentaires"
    >
      {/* ---- Fanions : le orange passe derrière, le bleu devant ---- */}
      <g
        style={{
          transform: `translateX(${(1 - f) * 260}px)`,
          opacity: f,
          transformBox: 'fill-box',
        }}
      >
        <path d="M 556,6 L 598,6 L 638,692 L 572,470 Z" fill={istd.orange} />
        <path d="M 646,6 L 684,6 L 766,142 L 528,694 L 566,520 Z" fill={istd.blue} />
      </g>

      {/* ---- Dent : couronne puis racines ---- */}
      <g>
        <path
          {...strokeCommon}
          strokeWidth={16}
          d={CROWN_LEFT}
          strokeDasharray={CROWN_LEN}
          strokeDashoffset={CROWN_LEN * (1 - d)}
        />
        <path
          {...strokeCommon}
          strokeWidth={16}
          d={CROWN_RIGHT}
          strokeDasharray={CROWN_LEN}
          strokeDashoffset={CROWN_LEN * (1 - d)}
        />
        {ROOTS.map((path, i) => (
          <path
            key={i}
            {...strokeCommon}
            strokeWidth={11}
            d={path}
            strokeDasharray={ROOT_LEN}
            strokeDashoffset={ROOT_LEN * (1 - d)}
          />
        ))}
      </g>

      {/* ---- Logotype ISTD ---- */}
      <text
        x={26}
        y={412}
        textLength={496}
        lengthAdjust="spacingAndGlyphs"
        fill={istd.orange}
        style={{
          fontFamily: istdFonts.display,
          fontWeight: 700,
          fontStyle: 'italic',
          fontSize: 200,
          letterSpacing: '-0.02em',
        }}
      >
        ISTD
      </text>
    </svg>
  );
};
