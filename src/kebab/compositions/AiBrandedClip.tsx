import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { kebabTheme, kebabFonts } from '../theme';
import { brand } from '../data/menu';
import { KebabLogo } from '../components/KebabLogo';
import { PriceTag } from '../components/PriceTag';

// Clip IA (fond video plein cadre) + habillage marque Remotion.
export const AiBrandedClip: React.FC<{
  clip: string;
  name: string;
  accentAr?: string;
  price: number;
  portrait?: boolean;
  showCta?: boolean;
}> = ({ clip, name, accentAr, price, portrait = true, showCta = true }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 200, mass: 0.6 }, from: 0.9, to: 1 });
  const logoO = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const accentO = interpolate(frame, [24, 42], [0, 1], { extrapolateRight: 'clamp' });
  const nameY = interpolate(frame, [30, 50], [40, 0], { extrapolateRight: 'clamp' });
  const nameO = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });

  // CTA qui apparait sur la fin
  const ctaStart = durationInFrames - 70;
  const ctaPop = spring({ frame: frame - ctaStart, fps, config: { damping: 12, mass: 0.7 }, from: 0, to: 1 });
  const pulse = 1 + 0.03 * Math.sin((frame / fps) * Math.PI * 2.4);

  return (
    <AbsoluteFill style={{ background: kebabTheme.black }}>
      <OffthreadVideo src={staticFile(clip)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* Scrims lisibilite */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 22%)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 32%, transparent 52%)' }} />

      {/* Logo haut */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 70 }}>
        <div style={{ transform: `scale(${logoIn})`, opacity: logoO }}>
          <KebabLogo width={portrait ? 620 : 520} />
        </div>
      </AbsoluteFill>

      {/* Prix haut-droite */}
      <AbsoluteFill style={{ alignItems: 'flex-end', justifyContent: 'flex-start', padding: '64px 48px 0 0' }}>
        <PriceTag price={price} delay={20} />
      </AbsoluteFill>

      {/* Bloc texte bas */}
      <AbsoluteFill style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '0 60px 130px' }}>
        {accentAr ? (
          <div
            style={{
              fontFamily: kebabFonts.arabic,
              fontWeight: 800,
              fontSize: 50,
              color: kebabTheme.goldBright,
              opacity: accentO,
              direction: 'rtl',
              marginBottom: 8,
              textShadow: '0 2px 16px rgba(0,0,0,0.7)',
            }}
          >
            {accentAr}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: kebabFonts.display,
            fontSize: 110,
            lineHeight: 0.96,
            color: kebabTheme.white,
            transform: `translateY(${nameY}px)`,
            opacity: nameO,
            letterSpacing: 1,
            textShadow: '0 6px 30px rgba(0,0,0,0.8)',
          }}
        >
          {name}
        </div>
      </AbsoluteFill>

      {/* CTA fin */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 40, display: showCta ? 'flex' : 'none' }}>
        <div
          style={{
            transform: `scale(${Math.max(0, ctaPop) * pulse})`,
            fontFamily: kebabFonts.display,
            fontSize: 64,
            color: kebabTheme.black,
            background: kebabTheme.goldGradient,
            padding: '14px 40px',
            borderRadius: 20,
            letterSpacing: 1,
            boxShadow: kebabTheme.goldGlow,
            opacity: ctaPop > 0.02 ? 1 : 0,
          }}
        >
          {brand.contact.delivery} · À EMPORTER
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
