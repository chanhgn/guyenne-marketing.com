import { AbsoluteFill, Series } from 'remotion';
import { bestSellers, screenTitle } from '../data/menu';
import { IntroScene } from '../components/IntroScene';
import { OutroScene } from '../components/OutroScene';
import { ProductHero } from '../components/ProductHero';
import { kebabTheme } from '../theme';

export const ST_INTRO = 66;
export const ST_HERO = 102;
export const ST_OUTRO = 120;

export const stopTrottoirFrames = () => ST_INTRO + bestSellers.length * ST_HERO + ST_OUTRO;

// Format vertical 9:16 — pensé pour arrêter un passant : gros, rapide, lisible.
export const StopTrottoir: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: kebabTheme.black }}>
      <Series>
        <Series.Sequence durationInFrames={ST_INTRO}>
          <IntroScene titleFr="LE MEILLEUR KEBAB" titleAr={screenTitle.sandwichs.ar} portrait />
        </Series.Sequence>
        {bestSellers.map((p, i) => (
          <Series.Sequence key={p.id} durationInFrames={ST_HERO}>
            <ProductHero product={p} index={i} portrait />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={ST_OUTRO}>
          <OutroScene portrait />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
