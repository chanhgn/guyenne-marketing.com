import { Composition } from 'remotion';
import { W16, H16, W9, H9, FPS, sandwichs, plats, desserts, screenTitle } from './data/menu';
import { MenuScreen, menuScreenFrames } from './compositions/MenuScreen';
import { StopTrottoir, stopTrottoirFrames } from './compositions/StopTrottoir';

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
    </>
  );
};
