import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { kebabTheme, kebabFonts } from '../theme';
import { KebabLogo } from '../components/KebabLogo';

export type PriceItem = { label: string; price: number; from?: boolean };

const Pill: React.FC<{ item: PriceItem; index: number }> = ({ item, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 18 - index * 7, fps, config: { damping: 14, mass: 0.7 }, from: 0, to: 1 });
  return (
    <div
      style={{
        transform: `translateY(${(1 - pop) * 40}px)`,
        opacity: pop,
        display: 'flex',
        alignItems: 'baseline',
        gap: 14,
        background: 'rgba(0,0,0,0.55)',
        border: `2px solid ${kebabTheme.goldDeep}`,
        borderRadius: 18,
        padding: '14px 26px',
        backdropFilter: 'blur(2px)',
      }}
    >
      <span style={{ fontFamily: kebabFonts.sans, fontWeight: 800, fontSize: 40, color: kebabTheme.cream, letterSpacing: 0.5 }}>
        {item.label}
      </span>
      {item.from ? (
        <span style={{ fontFamily: kebabFonts.sans, fontWeight: 700, fontSize: 22, color: kebabTheme.goldBright, letterSpacing: 1 }}>
          DÈS
        </span>
      ) : null}
      <span style={{ fontFamily: kebabFonts.display, fontSize: 56, lineHeight: 0.9, color: kebabTheme.goldBright }}>
        {item.price}
      </span>
      <span style={{ fontFamily: kebabFonts.sans, fontWeight: 800, fontSize: 26, color: kebabTheme.goldBright }}>Dh</span>
    </div>
  );
};

// Clip montage IA (fond video plein cadre 16:9) + habillage marque persistant.
export const MontageOverlay: React.FC<{
  clip: string;
  titleFr: string;
  titleAr: string;
  accentAr?: string;
  items: PriceItem[];
}> = ({ clip, titleFr, titleAr, accentAr, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 200, mass: 0.6 }, from: 0.9, to: 1 });
  const logoO = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp' });
  const titleO = interpolate(frame, [10, 28], [0, 1], { extrapolateRight: 'clamp' });
  const accentO = interpolate(frame, [22, 40], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: kebabTheme.black }}>
      <OffthreadVideo src={staticFile(clip)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* Scrims */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 20%)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 28%, transparent 46%)' }} />

      {/* Logo haut-gauche */}
      <div style={{ position: 'absolute', top: 50, left: 56, transform: `scale(${logoIn})`, opacity: logoO, transformOrigin: 'left top' }}>
        <KebabLogo width={360} />
      </div>

      {/* Titre ecran haut-droite */}
      <div style={{ position: 'absolute', top: 56, right: 60, textAlign: 'right', opacity: titleO }}>
        <div style={{ fontFamily: kebabFonts.display, fontSize: 64, color: kebabTheme.white, letterSpacing: 1, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
          {titleFr}
        </div>
        <div style={{ fontFamily: kebabFonts.arabic, fontWeight: 700, fontSize: 40, color: kebabTheme.goldBright, direction: 'rtl' }}>
          {titleAr}
        </div>
      </div>

      {/* Bas : punchline + bandeau prix */}
      <div style={{ position: 'absolute', left: 56, right: 56, bottom: 60 }}>
        {accentAr ? (
          <div
            style={{
              fontFamily: kebabFonts.arabic,
              fontWeight: 800,
              fontSize: 48,
              color: kebabTheme.goldBright,
              direction: 'rtl',
              marginBottom: 18,
              opacity: accentO,
              textShadow: '0 2px 16px rgba(0,0,0,0.8)',
            }}
          >
            {accentAr}
          </div>
        ) : null}
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          {items.map((it, i) => (
            <Pill key={it.label} item={it} index={i} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
