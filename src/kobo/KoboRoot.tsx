import { Composition } from 'remotion';
import { KoboPresentation, computeKoboFrames } from './KoboPresentation';
import { KOBO_FPS, KOBO_HEIGHT, KOBO_WIDTH } from './theme';

// Root dédié à la présentation KOBO (police chargée en local, aucun réseau).
export const KoboRoot: React.FC = () => (
  <Composition
    id="KoboPresentation"
    component={KoboPresentation}
    durationInFrames={computeKoboFrames()}
    fps={KOBO_FPS}
    width={KOBO_WIDTH}
    height={KOBO_HEIGHT}
  />
);
