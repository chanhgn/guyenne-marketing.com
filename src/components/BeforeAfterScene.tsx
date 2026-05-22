import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { theme, fontStack } from '../theme';
import { Background } from './Background';
import type { BeforeAfterPair } from '../data/beforeAfter';

export const BEFORE_AFTER_DURATION_SEC = 7;

export const BeforeAfterScene: React.FC<{ pair: BeforeAfterPair }> = ({ pair }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const exit = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const titleOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' });

  // Both halves enter on the first beat, then the AVANT/APRÈS labels appear
  const avantOpacity = interpolate(frame, [4, 22], [0, 1], { extrapolateRight: 'clamp' });
  const apresOpacity = interpolate(
    frame,
    [Math.round(0.9 * fps), Math.round(0.9 * fps) + 18],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Subtle Ken Burns push to keep the side-by-side alive
  const avantScale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.04],
    { extrapolateRight: 'clamp' },
  );
  const apresScale = interpolate(
    frame,
    [0, durationInFrames],
    [1.04, 1],
    { extrapolateRight: 'clamp' },
  );

  const cardStyle: React.CSSProperties = {
    flex: 1,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: pair.objectPosition,
  };

  const labelBox: React.CSSProperties = {
    position: 'absolute',
    top: 40,
    padding: '14px 28px',
    background: 'rgba(8, 17, 58, 0.78)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.coral}66`,
    color: theme.paper,
    fontFamily: fontStack.sans,
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: 8,
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: 18,
  };

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      <Background variant="dark" />

      {/* Top title */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 60,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            fontFamily: fontStack.sans,
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: theme.coralLight,
            marginBottom: 14,
          }}
        >
          Résultats · النتائج
        </div>
        <div
          style={{
            opacity: titleOpacity,
            display: 'flex',
            gap: 22,
            alignItems: 'center',
            fontFamily: fontStack.serif,
            fontSize: 42,
            fontWeight: 400,
            color: theme.paper,
            letterSpacing: 0.5,
          }}
        >
          <span>{pair.title}</span>
          <span style={{ opacity: 0.5, fontSize: 32 }}>·</span>
          <span
            style={{
              fontFamily: fontStack.arabic,
              fontSize: 36,
              fontWeight: 500,
              color: theme.coralLight,
              direction: 'rtl',
            }}
          >
            {pair.titleAr}
          </span>
        </div>
      </AbsoluteFill>

      {/* Two halves */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '180px 100px 100px 100px',
          gap: 30,
        }}
      >
        {/* AVANT */}
        <div style={{ ...cardStyle, opacity: avantOpacity }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${avantScale * pair.imageScale})`,
              transformOrigin: '50% 50%',
            }}
          >
            <Img src={staticFile(pair.avantFile)} style={imgStyle} />
          </div>
          {/* Soft inner shadow to anchor */}
          <AbsoluteFill
            style={{
              boxShadow: 'inset 0 0 80px rgba(8,17,58,0.6)',
              pointerEvents: 'none',
            }}
          />
          <div style={labelBox}>
            <span>AVANT</span>
            <span style={{ opacity: 0.4, letterSpacing: 0 }}>·</span>
            <span
              style={{
                fontFamily: fontStack.arabic,
                letterSpacing: 0,
                textTransform: 'none',
                fontSize: 26,
                direction: 'rtl',
              }}
            >
              قبل
            </span>
          </div>
        </div>

        {/* APRÈS */}
        <div style={{ ...cardStyle, opacity: apresOpacity }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: `scale(${apresScale * pair.imageScale})`,
              transformOrigin: '50% 50%',
            }}
          >
            <Img src={staticFile(pair.apresFile)} style={imgStyle} />
          </div>
          <AbsoluteFill
            style={{
              boxShadow: 'inset 0 0 80px rgba(8,17,58,0.6)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              ...labelBox,
              background: 'rgba(222, 32, 104, 0.82)',
              border: `1px solid ${theme.coralLight}`,
              color: theme.paper,
              right: 0,
              left: 'auto',
            }}
          >
            <span>APRÈS</span>
            <span style={{ opacity: 0.5, letterSpacing: 0 }}>·</span>
            <span
              style={{
                fontFamily: fontStack.arabic,
                letterSpacing: 0,
                textTransform: 'none',
                fontSize: 26,
                direction: 'rtl',
              }}
            >
              بعد
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* Subtle vertical separator */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '23%',
            bottom: '12%',
            left: '50%',
            width: 1,
            background: 'rgba(222, 32, 104, 0.6)',
            opacity: titleOpacity,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
