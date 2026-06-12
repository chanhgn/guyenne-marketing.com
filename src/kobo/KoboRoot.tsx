import { Composition } from 'remotion';
import { KoboPresentation, computeKoboFrames } from './KoboPresentation';
import { KOBO_FPS, KOBO_HEIGHT, KOBO_WIDTH } from './theme';
import { KoboDeck, DECK_SLIDES, SLIDE_HOLD } from './deck/Deck';

// Root dédié à la présentation KOBO (police chargée en local, aucun réseau).
export const KoboRoot: React.FC = () => (
  <>
    <Composition
      id="KoboPresentation"
      component={KoboPresentation}
      durationInFrames={computeKoboFrames()}
      fps={KOBO_FPS}
      width={KOBO_WIDTH}
      height={KOBO_HEIGHT}
    />
    <Composition
      id="KoboDeck"
      component={KoboDeck}
      durationInFrames={DECK_SLIDES.length * SLIDE_HOLD}
      fps={KOBO_FPS}
      width={KOBO_WIDTH}
      height={KOBO_HEIGHT}
    />
  </>
);
