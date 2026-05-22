import { theme, fontStack } from '../theme';

type Props = {
  width: number;
  /** Render the logo in a single-tone variant by applying a CSS filter. */
  monotone?: 'navy' | 'paper' | 'coral' | 'none';
};

// Sandbox placeholder: inline SVG wordmark while the official PNG is unavailable.
// Replace this component (or restore staticFile('logo-lakhssassi.png')) once the asset is in /public.
export const LogoMark: React.FC<Props> = ({ width, monotone = 'none' }) => {
  const aspect = 420 / 130;
  const height = width / aspect;
  const accent = monotone === 'paper' ? theme.paper : theme.coral;
  const main = monotone === 'paper' ? theme.paper : theme.navy;

  return (
    <svg
      viewBox="0 0 420 130"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="210"
        y="62"
        textAnchor="middle"
        fontFamily={fontStack.serif}
        fontSize="46"
        fontWeight={500}
        letterSpacing="2"
        fill={main}
      >
        Dr K. Lakhssassi
      </text>
      <line x1="120" y1="80" x2="300" y2="80" stroke={accent} strokeWidth="1.5" />
      <text
        x="210"
        y="108"
        textAnchor="middle"
        fontFamily={fontStack.sans}
        fontSize="14"
        letterSpacing="6"
        fill={accent}
      >
        DERMATOLOGIE · LASER
      </text>
    </svg>
  );
};
