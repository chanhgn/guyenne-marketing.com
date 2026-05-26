import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { kebabTheme, kebabFonts } from '../theme';
import type { Product } from '../data/menu';
import { PriceTag } from './PriceTag';

// Plein cadre, effet Ken Burns, texte en bas, prix qui pop.
// `portrait` adapte la mise en page pour le stop-trottoir 9:16.
export const ProductHero: React.FC<{ product: Product; index?: number; portrait?: boolean }> = ({
  product,
  index = 0,
  portrait = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Ken Burns : zoom + pan alternes selon l'index
  const dir = index % 2 === 0 ? 1 : -1;
  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1.2]);
  const panX = interpolate(frame, [0, durationInFrames], [0, 22 * dir]);

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  const nameY = interpolate(frame, [8, 28], [40, 0], { extrapolateRight: 'clamp' });
  const nameO = interpolate(frame, [8, 28], [0, 1], { extrapolateRight: 'clamp' });
  const tagO = interpolate(frame, [20, 38], [0, 1], { extrapolateRight: 'clamp' });
  const lineW = spring({ frame: frame - 14, fps, config: { damping: 200 }, from: 0, to: portrait ? 220 : 300 });

  const titleSize = portrait ? 96 : 108;
  const tagSize = portrait ? 40 : 44;

  return (
    <AbsoluteFill style={{ opacity, background: kebabTheme.black }}>
      <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${panX}px)` }}>
        <Img src={staticFile(product.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Degrades de lisibilite */}
      <AbsoluteFill
        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 38%, transparent 60%)' }}
      />
      <AbsoluteFill
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 45%)' }}
      />

      {/* Bloc texte bas-gauche */}
      <AbsoluteFill
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: portrait ? '0 64px 110px' : '0 90px 84px',
        }}
      >
        <div style={{ maxWidth: portrait ? '100%' : '62%' }}>
          {product.accentAr ? (
            <div
              style={{
                fontFamily: kebabFonts.arabic,
                fontWeight: 800,
                fontSize: portrait ? 44 : 46,
                color: kebabTheme.goldBright,
                opacity: tagO,
                direction: 'rtl',
                marginBottom: 6,
                textShadow: '0 2px 14px rgba(0,0,0,0.6)',
              }}
            >
              {product.accentAr}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: kebabFonts.display,
              fontSize: titleSize,
              lineHeight: 0.96,
              color: kebabTheme.white,
              transform: `translateY(${nameY}px)`,
              opacity: nameO,
              textShadow: '0 6px 28px rgba(0,0,0,0.7)',
              letterSpacing: 1,
            }}
          >
            {product.name}
          </div>
          <div style={{ height: 6, width: lineW, background: kebabTheme.goldGradient, borderRadius: 3, margin: '18px 0' }} />
          {product.tag ? (
            <div
              style={{
                fontFamily: kebabFonts.sans,
                fontWeight: 600,
                fontSize: tagSize,
                color: kebabTheme.cream,
                opacity: tagO,
                textShadow: '0 2px 14px rgba(0,0,0,0.6)',
              }}
            >
              {product.tag}
            </div>
          ) : null}
        </div>

        {!portrait ? (
          <div style={{ flexShrink: 0, marginBottom: 6, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            <PriceTag price={product.price} delay={16} />
            {product.priceNote ? (
              <div
                style={{
                  fontFamily: kebabFonts.sans,
                  fontWeight: 700,
                  fontSize: 30,
                  color: kebabTheme.cream,
                  background: 'rgba(0,0,0,0.5)',
                  border: `2px solid ${kebabTheme.goldDeep}`,
                  borderRadius: 999,
                  padding: '8px 22px',
                  opacity: tagO,
                }}
              >
                {product.priceNote} {/* Dh */}
              </div>
            ) : null}
          </div>
        ) : null}
      </AbsoluteFill>

      {portrait ? (
        <AbsoluteFill style={{ alignItems: 'flex-end', justifyContent: 'flex-start', padding: '60px 56px 0 0', flexDirection: 'column', gap: 12 }}>
          <PriceTag price={product.price} delay={16} size={1} />
          {product.priceNote ? (
            <div
              style={{
                fontFamily: kebabFonts.sans,
                fontWeight: 700,
                fontSize: 28,
                color: kebabTheme.cream,
                background: 'rgba(0,0,0,0.5)',
                border: `2px solid ${kebabTheme.goldDeep}`,
                borderRadius: 999,
                padding: '8px 20px',
              }}
            >
              {product.priceNote}
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
