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
const CROWN_LEFT = 'M 32,246 C 26,120 66,34 124,33 C 186,32 232,74 264,128';
const CROWN_RIGHT = 'M 231,128 C 262,74 300,32 356,33 C 420,34 460,122 466,246';

// Racines : deux paires d'arcs qui convergent vers une pointe.
const ROOTS = [
  'M 109,445 C 110,530 122,600 137,650',
  'M 183,445 C 182,528 158,600 143,648',
  'M 305,445 C 306,530 318,600 333,650',
  'M 397,445 C 396,528 356,600 340,648',
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
        <path d="M 555,7 L 582,7 L 643,692 L 573,478 Z" fill={istd.orange} />
        <path d="M 646,7 L 689,7 L 761,145 L 527,692 Z" fill={istd.blue} />
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
        x={14}
        y={412}
        textLength={500}
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
