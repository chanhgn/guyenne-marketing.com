import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { kebabTheme } from '../theme';

// Fond sombre chaud avec halo or qui respire + grain leger.
export const KebabBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const breathe = interpolate(frame % 240, [0, 120, 240], [0.34, 0.5, 0.34]);
  const drift = interpolate(frame, [0, 900], [0, 18], { extrapolateRight: 'extend' });

  return (
    <AbsoluteFill style={{ background: kebabTheme.black }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + drift * 0.2}% 18%, rgba(217,164,65,${breathe * 0.5}) 0%, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 80% 92%, rgba(226,84,30,${breathe * 0.35}) 0%, transparent 50%)`,
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
