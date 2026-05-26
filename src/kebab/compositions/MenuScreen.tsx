import { AbsoluteFill, Series } from 'remotion';
import type { Product } from '../data/menu';
import { IntroScene } from '../components/IntroScene';
import { OutroScene } from '../components/OutroScene';
import { ProductHero } from '../components/ProductHero';
import { kebabTheme } from '../theme';

export const INTRO_FRAMES = 75;
export const HERO_FRAMES = 120;
export const OUTRO_FRAMES = 110;

export const menuScreenFrames = (count: number) => INTRO_FRAMES + count * HERO_FRAMES + OUTRO_FRAMES;

export const MenuScreen: React.FC<{
  titleFr: string;
  titleAr: string;
  products: Product[];
}> = ({ titleFr, titleAr, products }) => {
  return (
    <AbsoluteFill style={{ background: kebabTheme.black }}>
      <Series>
        <Series.Sequence durationInFrames={INTRO_FRAMES}>
          <IntroScene titleFr={titleFr} titleAr={titleAr} />
        </Series.Sequence>
        {products.map((p, i) => (
          <Series.Sequence key={p.id} durationInFrames={HERO_FRAMES}>
            <ProductHero product={p} index={i} />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={OUTRO_FRAMES}>
          <OutroScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
