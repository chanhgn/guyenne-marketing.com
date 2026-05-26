import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { kebabTheme, kebabFonts } from '../theme';
import { brand } from '../data/menu';
import { KebabBg } from './KebabBg';
import { KebabLogo } from './KebabLogo';

const InfoChip: React.FC<{ label: string; opacity: number }> = ({ label, opacity }) => (
  <div
    style={{
      opacity,
      fontFamily: kebabFonts.sans,
      fontWeight: 600,
      fontSize: 34,
      color: kebabTheme.cream,
      border: `2px solid ${kebabTheme.goldDeep}`,
      borderRadius: 999,
      padding: '12px 28px',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
);

export const OutroScene: React.FC<{ portrait?: boolean }> = ({ portrait = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contact } = brand;

  const logoIn = spring({ frame, fps, config: { damping: 200, mass: 0.7 }, from: 0.85, to: 1 });
  const logoO = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp' });
  const ctaPop = spring({ frame: frame - 18, fps, config: { damping: 11, mass: 0.7 }, from: 0, to: 1 });
  const chipsO = interpolate(frame, [34, 52], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = 1 + 0.03 * Math.sin((frame / fps) * Math.PI * 2.4);

  return (
    <AbsoluteFill>
      <KebabBg>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: portrait ? 64 : 52, padding: 60 }}>
          <div style={{ transform: `scale(${logoIn})`, opacity: logoO }}>
            <KebabLogo width={portrait ? 860 : 800} />
          </div>

          <div
            style={{
              transform: `scale(${ctaPop * pulse})`,
              fontFamily: kebabFonts.display,
              fontSize: portrait ? 104 : 92,
              color: kebabTheme.black,
              background: kebabTheme.goldGradient,
              padding: '18px 54px',
              borderRadius: 26,
              letterSpacing: 2,
              boxShadow: kebabTheme.goldGlow,
              textAlign: 'center',
            }}
          >
            COMMANDEZ MAINTENANT
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 18,
              justifyContent: 'center',
              maxWidth: portrait ? 900 : 1500,
            }}
          >
            <InfoChip label={`📍 ${contact.address}`} opacity={chipsO} />
            <InfoChip label={`📞 ${contact.phone}`} opacity={chipsO} />
            <InfoChip label={`🕒 ${contact.hours}`} opacity={chipsO} />
            <InfoChip label={`🛵 ${contact.delivery}`} opacity={chipsO} />
            <InfoChip label={contact.instagram} opacity={chipsO} />
          </div>
        </AbsoluteFill>
      </KebabBg>
    </AbsoluteFill>
  );
};
