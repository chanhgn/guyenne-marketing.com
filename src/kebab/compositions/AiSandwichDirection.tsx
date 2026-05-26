import { AbsoluteFill, Series } from 'remotion';
import { kebabTheme } from '../theme';
import { AiBrandedClip } from './AiBrandedClip';
import { DirectionScene } from '../components/DirectionScene';

export const CLIP_FRAMES = 195; // ~6.5s du clip IA
export const DIR_FRAMES = 120; // 4s scene "C'EST ICI"
export const aiSandwichDirectionFrames = () => CLIP_FRAMES + DIR_FRAMES;

export const AiSandwichDirection: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: kebabTheme.black }}>
      <Series>
        <Series.Sequence durationInFrames={CLIP_FRAMES}>
          <AiBrandedClip
            clip="kebab/clips/sandwich-zoom.mp4"
            name="SANDWICH KEBAB"
            accentAr="بنّة ما كاينة"
            price={35}
            portrait
            showCta={false}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DIR_FRAMES}>
          <DirectionScene portrait />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
