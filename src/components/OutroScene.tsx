import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme, fontStack } from '../theme';
import { cabinet } from '../data/cabinet';
import { Background } from './Background';
import { LogoMark } from './LogoMark';

export const OUTRO_DURATION_SEC = 7;

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const enter = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const logoOpacity = interpolate(frame, [4, 28], [0, 1], { extrapolateRight: 'clamp' });
  const ctaOpacity = interpolate(frame, [16, 40], [0, 1], { extrapolateRight: 'clamp' });
  const ctaY = interpolate(frame, [16, 40], [22, 0], { extrapolateRight: 'clamp' });
  const lineWidth = interpolate(frame, [28, 70], [0, 420], { extrapolateRight: 'clamp' });
  const taglineOpacity = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' });
  const exit = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      <Background variant="light" />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.ink,
          textAlign: 'center',
        }}
      >
        <div style={{ opacity: logoOpacity, marginBottom: 56 }}>
          <LogoMark width={620} />
        </div>

        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            display: 'flex',
            gap: 28,
            alignItems: 'center',
            fontFamily: fontStack.sans,
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: theme.coral,
          }}
        >
          <span>{cabinet.outroLabel}</span>
          <span style={{ opacity: 0.5, letterSpacing: 0 }}>·</span>
          <span
            style={{
              fontFamily: fontStack.arabic,
              letterSpacing: 0,
              textTransform: 'none',
              direction: 'rtl',
              fontSize: 28,
            }}
          >
            {cabinet.outroLabelAr}
          </span>
        </div>

        <div
          style={{
            marginTop: 32,
            height: 1,
            width: lineWidth,
            background: theme.coral,
          }}
        />

        <div
          style={{
            opacity: taglineOpacity,
            marginTop: 32,
            fontFamily: fontStack.serif,
            fontStyle: 'italic',
            fontSize: 32,
            color: theme.ink,
            letterSpacing: 0.5,
          }}
        >
          {cabinet.tagline}
        </div>

        <div
          style={{
            opacity: taglineOpacity,
            marginTop: 14,
            fontFamily: fontStack.arabic,
            fontSize: 30,
            fontWeight: 500,
            color: theme.coral,
            direction: 'rtl',
          }}
        >
          {cabinet.taglineAr}
        </div>

        <div
          style={{
            opacity: taglineOpacity,
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
