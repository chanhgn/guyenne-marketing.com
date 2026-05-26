import { AbsoluteFill, Series } from 'remotion';
import { kebabTheme } from '../theme';
import { OutroScene } from '../components/OutroScene';
import { MontageOverlay, PriceItem } from './MontageOverlay';

export const MONTAGE_FRAMES = 300; // 10s de clip
export const MONTAGE_OUTRO = 110; // ~3.7s
export const montageScreenFrames = () => MONTAGE_FRAMES + MONTAGE_OUTRO;

export const MontageScreen: React.FC<{
  clip: string;
  titleFr: string;
  titleAr: string;
  accentAr?: string;
  items: PriceItem[];
}> = ({ clip, titleFr, titleAr, accentAr, items }) => {
  return (
    <AbsoluteFill style={{ background: kebabTheme.black }}>
      <Series>
        <Series.Sequence durationInFrames={MONTAGE_FRAMES}>
          <MontageOverlay clip={clip} titleFr={titleFr} titleAr={titleAr} accentAr={accentAr} items={items} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={MONTAGE_OUTRO}>
          <OutroScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
