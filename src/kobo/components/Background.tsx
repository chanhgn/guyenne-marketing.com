import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { kobo } from '../theme';

type Variant = 'dark' | 'light';

// Fond signature KOBO : trame "blueprint" (plan d'architecte) + halo cuivré + drift lent.
export const Background: React.FC<{ variant?: Variant }> = ({ variant = 'dark' }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 900], [0, 26], { extrapolateRight: 'extend' });

  const isDark = variant === 'dark';
  const base = isDark
    ? `radial-gradient(120% 90% at ${48 + drift * 0.15}% -10%, ${kobo.inkSoft} 0%, ${kobo.ink} 45%, ${kobo.inkDeep} 100%)`
    : `linear-gradient(180deg, ${kobo.paper} 0%, ${kobo.paperCool} 100%)`;
  const grid = isDark ? kobo.gridDark : kobo.gridLight;

  return (
    <AbsoluteFill style={{ background: base }}>
      {/* Trame blueprint */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          backgroundPosition: `${drift}px ${drift * 0.5}px`,
          maskImage: 'radial-gradient(130% 120% at 50% 40%, #000 55%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(130% 120% at 50% 40%, #000 55%, transparent 100%)',
        }}
      />
      {/* Halo cuivré */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 50% at ${82 - drift * 0.1}% 78%, rgba(202,138,4,${isDark ? 0.16 : 0.10}) 0%, transparent 60%)`,
        }}
      />
      {/* Vignettage doux */}
      {isDark && (
        <AbsoluteFill
          style={{
            background: 'radial-gradient(120% 100% at 50% 50%, transparent 60%, rgba(4,8,18,0.55) 100%)',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
