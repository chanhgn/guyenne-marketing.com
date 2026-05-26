import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { kebabTheme, kebabFonts } from '../theme';
import { KebabBg } from './KebabBg';
import { KebabLogo } from './KebabLogo';

const Chevron: React.FC<{ size: number; opacity: number }> = ({ size, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity, filter: 'drop-shadow(0 0 18px rgba(244,206,114,0.55))' }}>
    <path d="M28 10 L70 50 L28 90" fill="none" stroke={kebabTheme.goldBright} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DirectionScene: React.FC<{ portrait?: boolean }> = ({ portrait = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 200, mass: 0.6 }, from: 0.9, to: 1 });
  const logoO = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp' });
  const iciPop = spring({ frame: frame - 8, fps, config: { damping: 11, mass: 0.7, stiffness: 130 }, from: 0, to: 1 });
  const subO = interpolate(frame, [26, 44], [0, 1], { extrapolateRight: 'clamp' });

  // Pulsation du titre + glow qui respire
  const t = frame / fps;
  const iciPulse = 1 + 0.05 * Math.sin(t * Math.PI * 2.2);
  const glow = 0.4 + 0.35 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2.2));

  // Bandeau de chevrons qui defile vers la droite en continu
  const N = portrait ? 4 : 6;
  const chevSize = portrait ? 140 : 130;
  const flow = (t * 1.1) % 1; // lumiere qui avance
  const chOpacity = (i: number) => {
    const phase = (i / N - flow + 1) % 1;
    return 0.3 + 0.7 * Math.max(0, Math.cos(phase * Math.PI * 2));
  };
  const groupSlide = 30 * Math.sin(t * Math.PI * 2.2);

  const big = portrait ? 230 : 190;

  return (
    <AbsoluteFill>
      <KebabBg>
        {/* Glow directionnel qui respire */}
        <AbsoluteFill style={{ background: `radial-gradient(circle at 80% 50%, rgba(244,206,114,${glow * 0.45}) 0%, transparent 55%)` }} />

        {/* Logo */}
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 70 }}>
          <div style={{ transform: `scale(${logoIn})`, opacity: logoO }}>
            <KebabLogo width={portrait ? 660 : 520} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30 }}>
          <div
            style={{
              transform: `scale(${iciPop * iciPulse})`,
              fontFamily: kebabFonts.display,
              fontSize: big,
              lineHeight: 0.88,
              background: kebabTheme.goldGradient,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: 2,
              filter: `drop-shadow(0 0 ${glow * 40}px rgba(244,206,114,0.6))`,
              textAlign: 'center',
            }}
          >
            C'EST ICI
          </div>

          {/* Bandeau "PAR ICI" + chevrons qui defilent */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, transform: `translateX(${groupSlide}px)` }}>
            <div style={{ fontFamily: kebabFonts.display, fontSize: portrait ? 78 : 68, color: kebabTheme.white, letterSpacing: 1, marginRight: 20, whiteSpace: 'nowrap', flexShrink: 0, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              PAR ICI
            </div>
            {Array.from({ length: N }).map((_, i) => (
              <Chevron key={i} size={chevSize} opacity={chOpacity(i)} />
            ))}
          </div>

          <div style={{ opacity: subO, fontFamily: kebabFonts.arabic, fontWeight: 800, fontSize: portrait ? 72 : 60, color: kebabTheme.goldBright, direction: 'rtl', marginTop: 12 }}>
            راه هنا، تفضّلوا
          </div>
          <div style={{ opacity: subO, fontFamily: kebabFonts.sans, fontWeight: 700, fontSize: portrait ? 48 : 40, color: kebabTheme.cream }}>
            Notre restaurant vous attend
          </div>
        </AbsoluteFill>
      </KebabBg>
    </AbsoluteFill>
  );
};
