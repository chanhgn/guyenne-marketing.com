import { AbsoluteFill, OffthreadVideo, Series, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { kebabTheme, kebabFonts } from '../theme';
import { KebabBg } from '../components/KebabBg';
import { KebabLogo } from '../components/KebabLogo';
import { DirectionScene } from '../components/DirectionScene';
import { PriceItem } from './MontageOverlay';

const PortraitPill: React.FC<{ item: PriceItem; index: number }> = ({ item, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 26 - index * 8, fps, config: { damping: 14, mass: 0.7 }, from: 0, to: 1 });
  return (
    <div
      style={{
        transform: `translateY(${(1 - pop) * 36}px)`,
        opacity: pop,
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        background: 'rgba(0,0,0,0.5)',
        border: `2px solid ${kebabTheme.goldDeep}`,
        borderRadius: 18,
        padding: '12px 22px',
      }}
    >
      <span style={{ fontFamily: kebabFonts.sans, fontWeight: 800, fontSize: 38, color: kebabTheme.cream }}>{item.label}</span>
      {item.from ? <span style={{ fontFamily: kebabFonts.sans, fontWeight: 700, fontSize: 20, color: kebabTheme.goldBright }}>DÈS</span> : null}
      <span style={{ fontFamily: kebabFonts.display, fontSize: 52, lineHeight: 0.9, color: kebabTheme.goldBright }}>{item.price}</span>
      <span style={{ fontFamily: kebabFonts.sans, fontWeight: 800, fontSize: 24, color: kebabTheme.goldBright }}>Dh</span>
    </div>
  );
};

// Panneau vertical : logo + clip 16:9 en grand + titre + prix + punchline.
const Panel: React.FC<{
  clip: string;
  titleFr: string;
  titleAr: string;
  accentAr?: string;
  items: PriceItem[];
}> = ({ clip, titleFr, titleAr, accentAr, items }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 200, mass: 0.6 }, from: 0.9, to: 1 });
  const logoO = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
  const titleO = interpolate(frame, [12, 30], [0, 1], { extrapolateRight: 'clamp' });
  const accentO = interpolate(frame, [20, 38], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <KebabBg>
        {/* Logo */}
        <div style={{ position: 'absolute', top: 64, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${logoIn})`, opacity: logoO }}>
          <KebabLogo width={640} />
        </div>

        {/* Clip 16:9 en grand */}
        <div style={{ position: 'absolute', top: 360, left: 0, width: 1080, height: 1010, overflow: 'hidden' }}>
          <OffthreadVideo src={staticFile(clip)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(11,10,8,0.95) 0%, transparent 22%)' }} />
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(11,10,8,0.9) 0%, transparent 14%)' }} />
        </div>

        {/* Bas : titre + punchline + prix */}
        <div style={{ position: 'absolute', left: 56, right: 56, bottom: 90, textAlign: 'center' }}>
          <div style={{ opacity: titleO, fontFamily: kebabFonts.display, fontSize: 104, color: kebabTheme.white, letterSpacing: 1, textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}>
            {titleFr}
          </div>
          <div style={{ opacity: titleO, fontFamily: kebabFonts.arabic, fontWeight: 700, fontSize: 56, color: kebabTheme.goldBright, direction: 'rtl', marginBottom: 18 }}>
            {titleAr}
          </div>
          {accentAr ? (
            <div style={{ opacity: accentO, fontFamily: kebabFonts.arabic, fontWeight: 800, fontSize: 46, color: kebabTheme.cream, direction: 'rtl', marginBottom: 24 }}>
              {accentAr}
            </div>
          ) : null}
          <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
            {items.map((it, i) => (
              <PortraitPill key={it.label} item={it} index={i} />
            ))}
          </div>
        </div>
      </KebabBg>
    </AbsoluteFill>
  );
};

const PANEL = 180; // 6s par categorie
const DIR = 450; // 15s scene "C'EST ICI" (bien visible)
export const stopTrottoirMontageFrames = () => PANEL * 3 + DIR;

export const StopTrottoirMontage: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: kebabTheme.black }}>
      <Series>
        <Series.Sequence durationInFrames={PANEL}>
          <Panel
            clip="kebab/clips/montage-kebabs.mp4"
            titleFr="NOS KEBABS"
            titleAr="الكباب ديالنا"
            accentAr="بنّة ما كاينة"
            items={[
              { label: 'Kebab', price: 30 },
              { label: 'Maxi', price: 39 },
              { label: 'Mega', price: 49 },
            ]}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={PANEL}>
          <Panel
            clip="kebab/clips/montage-plats.mp4"
            titleFr="NOS PLATS"
            titleAr="أطباقنا"
            accentAr="طبق شبعان"
            items={[
              { label: 'Tacos', price: 55, from: true },
              { label: 'Assiette', price: 70, from: true },
              { label: 'Poutine', price: 60 },
            ]}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={PANEL}>
          <Panel
            clip="kebab/clips/montage-desserts.mp4"
            titleFr="NOS DESSERTS"
            titleAr="تحلياتنا"
            accentAr="تيراميسو بنين بزاف"
            items={[{ label: 'Tiramisu', price: 28 }]}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DIR}>
          <DirectionScene portrait />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
