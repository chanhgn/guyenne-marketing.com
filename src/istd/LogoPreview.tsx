import React from 'react';
import { AbsoluteFill } from 'remotion';
import { IstdLogo } from './IstdLogo';
import { istd, istdFonts } from './theme';

/** Planche de contrôle : le logo reconstruit sur les 3 fonds de la charte. */
export const LogoPreview: React.FC = () => (
  <AbsoluteFill style={{ background: istd.bgLight, fontFamily: istdFonts.body }}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        alignItems: 'center',
        height: '100%',
      }}
    >
      {[
        { bg: istd.white, label: 'Fond blanc' },
        { bg: istd.bgBeige, label: 'Fond beige #F3E9E1' },
        { bg: istd.bgDark, label: 'Fond sombre #1C1C1C' },
      ].map((cell) => (
        <div
          key={cell.label}
          style={{
            background: cell.bg,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 48,
          }}
        >
          <IstdLogo style={{ width: '62%' }} />
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: cell.bg === istd.bgDark ? istd.white : istd.body,
            }}
          >
            {cell.label}
          </span>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
