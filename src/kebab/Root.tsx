import { Composition } from 'remotion';
import { W16, H16, W9, H9, FPS, sandwichs, plats, desserts, screenTitle } from './data/menu';
import { MenuScreen, menuScreenFrames } from './compositions/MenuScreen';
import { StopTrottoir, stopTrottoirFrames } from './compositions/StopTrottoir';
import { AiBrandedClip } from './compositions/AiBrandedClip';
import { AiSandwichDirection, aiSandwichDirectionFrames } from './compositions/AiSandwichDirection';

export const KebabRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Kebab-Ecran1-Sandwichs"
        component={MenuScreen}
        durationInFrames={menuScreenFrames(sandwichs.length)}
        fps={FPS}
        width={W16}
        height={H16}
        defaultProps={{ titleFr: screenTitle.sandwichs.fr, titleAr: screenTitle.sandwichs.ar, products: sandwichs }}
      />
      <Composition
        id="Kebab-Ecran2-Plats"
        component={MenuScreen}
        durationInFrames={menuScreenFrames(plats.length)}
        fps={FPS}
        width={W16}
        height={H16}
        defaultProps={{ titleFr: screenTitle.plats.fr, titleAr: screenTitle.plats.ar, products: plats }}
      />
      <Composition
        id="Kebab-Ecran3-Desserts"
        component={MenuScreen}
        durationInFrames={menuScreenFrames(desserts.length)}
        fps={FPS}
        width={W16}
        height={H16}
        defaultProps={{ titleFr: screenTitle.desserts.fr, titleAr: screenTitle.desserts.ar, products: desserts }}
      />
      <Composition
        id="Kebab-StopTrottoir"
        component={StopTrottoir}
        durationInFrames={stopTrottoirFrames()}
        fps={FPS}
        width={W9}
        height={H9}
      />
      <Composition
        id="Kebab-AI-Sandwich-9x16"
        component={AiBrandedClip}
        durationInFrames={300}
        fps={FPS}
        width={W9}
        height={H9}
        defaultProps={{
          clip: 'kebab/clips/sandwich-zoom.mp4',
          name: 'SANDWICH KEBAB',
          accentAr: 'بنّة ما كاينة',
          price: 35,
          portrait: true,
        }}
      />
      <Composition
        id="Kebab-AI-Sandwich-Direction-9x16"
        component={AiSandwichDirection}
        durationInFrames={aiSandwichDirectionFrames()}
        fps={FPS}
        width={W9}
        height={H9}
      />
    </>
  );
};
