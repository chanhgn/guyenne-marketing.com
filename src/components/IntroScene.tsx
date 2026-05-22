import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme, fontStack } from '../theme';
import { cabinet } from '../data/cabinet';
import { Background } from './Background';
import { LogoMark } from './LogoMark';

export const INTRO_DURATION_SEC = 6;

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 200, mass: 0.6 }, from: 0.92, to: 1 });
  const logoOpacity = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: 'clamp' });

  const taglineOpacity = interpolate(frame, [22, 44], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [22, 44], [16, 0], { extrapolateRight: 'clamp' });

  const lineWidth = interpolate(frame, [50, 84], [0, 360], { extrapolateRight: 'clamp' });

  const arOpacity = interpolate(frame, [70, 96], [0, 1], { extrapolateRight: 'clamp' });
  const cityOpacity = interpolate(frame, [90, 116], [0, 1], { extrapolateRight: 'clamp' });

  const exit = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Background variant="light" />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.ink,
        }}
      >
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            marginBottom: 64,
          }}
        >
          <LogoMark width={720} />
        </div>

        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            fontFamily: fontStack.sans,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: theme.inkSoft,
            textAlign: 'center',
          }}
        >
          {cabinet.specialty}
        </div>

        <div
          style={{
            marginTop: 36,
            height: 1,
            width: lineWidth,
            background: theme.coral,
          }}
        />

        <div
          style={{
            opacity: arOpacity,
            marginTop: 32,
            fontFamily: fontStack.serif,
            fontStyle: 'italic',
            fontSize: 36,
            color: theme.ink,
            letterSpacing: 0.5,
          }}
        >
          {cabinet.tagline}
        </div>

        <div
          style={{
            opacity: arOpacity,
            marginTop: 16,
            fontFamily: fontStack.arabic,
            fontSize: 32,
            fontWeight: 500,
            color: theme.coral,
            direction: 'rtl',
          }}
        >
          {cabinet.taglineAr}
        </div>

        <div
          style={{
            opacity: cityOpacity,
            marginTop: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            fontFamily: fontStack.sans,
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: theme.inkMute,
          }}
        >
          <span>{cabinet.cityLong}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ fontFamily: fontStack.arabic, letterSpacing: 0, textTransform: 'none', direction: 'rtl' }}>
            {cabinet.cityAr}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
