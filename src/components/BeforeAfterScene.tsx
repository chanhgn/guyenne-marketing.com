import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { theme, fontStack } from '../theme';
import { Background } from './Background';
import type { BeforeAfterPair } from '../data/beforeAfter';

export const BEFORE_AFTER_DURATION_SEC = 6;

export const BeforeAfterScene: React.FC<{ pair: BeforeAfterPair }> = ({ pair }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const exit = interpolate(frame, [BEFORE_AFTER_DURATION_SEC * 30 - 14, BEFORE_AFTER_DURATION_SEC * 30 - 2], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = enter * exit;

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: pair.objectPosition,
    transform: `scale(${pair.imageScale})`,
  };

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 36,
    fontFamily: fontStack.sans,
    fontSize: 18,
    letterSpacing: 6,
    textTransform: 'uppercase',
    color: theme.paper,
    padding: '10px 22px',
    background: 'rgba(8, 17, 58, 0.7)',
    border: `1px solid ${theme.coral}88`,
  };

  return (
    <AbsoluteFill style={{ opacity }}>
      <Background variant="dark" />
      <AbsoluteFill style={{ flexDirection: 'row' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Img src={staticFile(pair.avantFile)} style={imgStyle} />
          <div style={{ ...labelStyle, left: 36 }}>Avant</div>
        </div>
        <div style={{ width: 4, background: theme.coral }} />
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Img src={staticFile(pair.apresFile)} style={imgStyle} />
          <div style={{ ...labelStyle, right: 36 }}>Après</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 48,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: fontStack.serif,
            fontSize: 58,
            color: theme.paper,
            background: 'rgba(8, 17, 58, 0.55)',
            padding: '14px 36px',
            border: `1px solid ${theme.coral}66`,
          }}
        >
          {pair.title}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
