import { AbsoluteFill, Series } from 'remotion';
import { kebabTheme } from '../theme';
import { OutroScene } from '../components/OutroScene';
import { MontageOverlay, PriceItem } from './MontageOverlay';
import { MenuBoard, BoardRow } from './MenuBoard';

export const MONTAGE_FRAMES = 300; // 10s de clip
export const BOARD_FRAMES = 510; // 17s (entree animee + ~15s stable)
export const MONTAGE_OUTRO = 300; // 10s (outro avec logo 3D)
export const montageScreenFrames = () => MONTAGE_FRAMES + BOARD_FRAMES + MONTAGE_OUTRO;

export const MontageScreen: React.FC<{
  clip: string;
  titleFr: string;
  titleAr: string;
  accentAr?: string;
  items: PriceItem[];
  rows: BoardRow[];
  showTiers?: boolean;
}> = ({ clip, titleFr, titleAr, accentAr, items, rows, showTiers = false }) => {
  return (
    <AbsoluteFill style={{ background: kebabTheme.black }}>
      <Series>
        <Series.Sequence durationInFrames={MONTAGE_FRAMES}>
          <MontageOverlay clip={clip} titleFr={titleFr} titleAr={titleAr} accentAr={accentAr} items={items} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={BOARD_FRAMES}>
          <MenuBoard titleFr={titleFr} titleAr={titleAr} rows={rows} showTiers={showTiers} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={MONTAGE_OUTRO}>
          <OutroScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
