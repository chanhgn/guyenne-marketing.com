import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background';
import { CornerBracket, Logo, useSceneExit } from '../components/atoms';
import { kobo, font } from '../theme';
import { brand } from '../data';

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = useSceneExit(20);

  const logoSp = spring({ frame, fps, config: { damping: 200, mass: 0.8 }, from: 0.9, to: 1 });
  const logoOp = interpolate(frame, [0, 26], [0, 1], { extrapolateRight: 'clamp' });

  const ruleW = interpolate(frame, [40, 78], [0, 420], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const speakerOp = interpolate(frame, [66, 92], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const speakerY = interpolate(frame, [66, 92], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bracket = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Background variant="dark" />
      <CornerBracket corner="tr" size={150} progress={bracket} />
      <CornerBracket corner="bl" size={150} progress={bracket} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${logoSp})`, opacity: logoOp }}>
          <Logo variant="light" full width={720} />
        </div>

        <div style={{ marginTop: 54, height: 2, width: ruleW, background: kobo.copperBright }} />

        <div
          style={{
            opacity: speakerOp,
            transform: `translateY(${speakerY}px)`,
            marginTop: 40,
            textAlign: 'center',
            fontFamily: font.sans,
          }}
        >
          <div style={{ fontSize: 38, fontWeight: 700, color: kobo.white, letterSpacing: 0.5 }}>
            {brand.speaker}
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: kobo.slateLine,
            }}
          >
            {brand.speakerRole}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
