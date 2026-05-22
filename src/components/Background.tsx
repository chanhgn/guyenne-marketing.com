import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { theme } from '../theme';

type Variant = 'light' | 'dark';

export const Background: React.FC<{ variant?: Variant }> = ({ variant = 'light' }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 600], [0, 30], { extrapolateRight: 'extend' });

  if (variant === 'dark') {
    return (
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${50 + drift * 0.2}% 30%, #1B2E6B 0%, ${theme.navyDeep} 65%, #04081F 100%)`,
        }}
      >
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 80% 75%, rgba(222, 32, 104, 0.18) 0%, transparent 55%)`,
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${theme.paper} 0%, ${theme.bgWarm} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${30 + drift * 0.1}% 20%, rgba(222, 32, 104, 0.08) 0%, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${70 - drift * 0.1}% 80%, rgba(20, 38, 99, 0.09) 0%, transparent 60%)`,
        }}
      />
    </AbsoluteFill>
  );
};
