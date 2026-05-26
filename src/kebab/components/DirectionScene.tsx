import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { kebabTheme, kebabFonts } from '../theme';
import { KebabBg } from './KebabBg';
import { KebabLogo } from './KebabLogo';

// Chevron simple pointant a droite
const Chevron: React.FC<{ size: number; opacity: number }> = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
    <path
      d="M30 12 L68 50 L30 88"
      fill="none"
      stroke={kebabTheme.goldBright}
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DirectionScene: React.FC<{ portrait?: boolean }> = ({ portrait = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 200, mass: 0.6 }, from: 0.9, to: 1 });
  const logoO = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp' });

  const iciPop = spring({ frame: frame - 12, fps, config: { damping: 12, mass: 0.7, stiffness: 130 }, from: 0, to: 1 });
  const subO = interpolate(frame, [30, 48], [0, 1], { extrapolateRight: 'clamp' });

  // Mouvement de la fleche vers la droite (va-et-vient)
  const slide = 26 * Math.sin((frame / fps) * Math.PI * 2.2);
  // Chevrons qui s'allument en cascade
  const t = (frame / fps) % 1;
  const ch = (i: number) => {
    const phase = (t + i * 0.18) % 1;
    return 0.35 + 0.65 * Math.max(0, Math.sin(phase * Math.PI));
  };

  const big = portrait ? 150 : 130;

  return (
    <AbsoluteFill>
      <KebabBg>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 70 }}>
          <div style={{ transform: `scale(${logoIn})`, opacity: logoO }}>
            <KebabLogo width={portrait ? 640 : 520} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              transform: `scale(${iciPop})`,
              fontFamily: kebabFonts.display,
              fontSize: portrait ? 200 : 170,
              lineHeight: 0.9,
              background: kebabTheme.goldGradient,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: 2,
              textShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
          >
            C'EST ICI
          </div>

          {/* Fleche + chevrons vers la droite */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, transform: `translateX(${slide}px)` }}>
            <div
              style={{
                fontFamily: kebabFonts.display,
                fontSize: portrait ? 70 : 60,
                color: kebabTheme.cream,
                letterSpacing: 1,
                marginRight: 18,
              }}
            >
              PAR ICI
            </div>
            <Chevron size={big} opacity={ch(0)} />
            <Chevron size={big} opacity={ch(1)} />
            <Chevron size={big} opacity={ch(2)} />
          </div>

          <div
            style={{
              opacity: subO,
              fontFamily: kebabFonts.arabic,
              fontWeight: 800,
              fontSize: portrait ? 66 : 56,
              color: kebabTheme.goldBright,
              direction: 'rtl',
              marginTop: 8,
            }}
          >
            راه هنا، تفضّلوا
          </div>
          <div
            style={{
              opacity: subO,
              fontFamily: kebabFonts.sans,
              fontWeight: 600,
              fontSize: portrait ? 42 : 36,
              color: kebabTheme.cream,
            }}
          >
            Notre restaurant vous attend
          </div>
        </AbsoluteFill>
      </KebabBg>
    </AbsoluteFill>
  );
};
