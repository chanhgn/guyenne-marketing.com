import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { kebabTheme, kebabFonts } from '../theme';
import { KebabBg } from './KebabBg';
import { KebabLogo } from './KebabLogo';

export const IntroScene: React.FC<{ titleFr: string; titleAr: string; portrait?: boolean }> = ({
  titleFr,
  titleAr,
  portrait = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 200, mass: 0.7 }, from: 0.8, to: 1 });
  const logoO = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp' });
  const titleO = interpolate(frame, [18, 36], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [18, 36], [24, 0], { extrapolateRight: 'clamp' });
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <KebabBg>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: portrait ? 60 : 48 }}>
          <div style={{ transform: `scale(${logoIn})`, opacity: logoO }}>
            <KebabLogo width={portrait ? 820 : 760} />
          </div>
          <div style={{ textAlign: 'center', opacity: titleO, transform: `translateY(${titleY}px)` }}>
            <div
              style={{
                fontFamily: kebabFonts.display,
                fontSize: portrait ? 110 : 96,
                background: kebabTheme.goldGradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: 2,
              }}
            >
              {titleFr}
            </div>
            <div style={{ fontFamily: kebabFonts.arabic, fontWeight: 700, fontSize: portrait ? 64 : 56, color: kebabTheme.cream, direction: 'rtl', marginTop: 6 }}>
              {titleAr}
            </div>
          </div>
        </AbsoluteFill>
      </KebabBg>
    </AbsoluteFill>
  );
};
