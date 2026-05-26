import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { kebabTheme, kebabFonts } from '../theme';

export const PriceTag: React.FC<{ price: number; currency?: string; delay?: number; size?: number }> = ({
  price,
  currency = 'Dh',
  delay = 0,
  size = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 12, mass: 0.7, stiffness: 140 }, from: 0, to: 1 });
  const rot = spring({ frame: frame - delay, fps, config: { damping: 14 }, from: -8, to: -4 });

  return (
    <div
      style={{
        transform: `scale(${pop}) rotate(${rot}deg)`,
        background: kebabTheme.goldGradient,
        color: kebabTheme.black,
        borderRadius: 24 * size,
        padding: `${14 * size}px ${30 * size}px`,
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 6 * size,
        boxShadow: `${kebabTheme.glow}, ${kebabTheme.goldGlow}`,
        border: `${3 * size}px solid ${kebabTheme.black}`,
      }}
    >
      <span style={{ fontFamily: kebabFonts.display, fontSize: 92 * size, lineHeight: 0.9 }}>{price}</span>
      <span style={{ fontFamily: kebabFonts.sans, fontWeight: 800, fontSize: 38 * size }}>{currency}</span>
    </div>
  );
};
