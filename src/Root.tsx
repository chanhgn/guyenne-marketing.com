import { Composition } from 'remotion';
import { WaitingRoom, computeTotalFrames } from './compositions/WaitingRoom';
import { FPS, HEIGHT, WIDTH } from './data/treatments';
import './kobo/fonts';
import { KoboPresentation, computeKoboFrames } from './kobo/KoboPresentation';
import { KOBO_FPS, KOBO_HEIGHT, KOBO_WIDTH } from './kobo/theme';

export const RemotionRoot: React.FC = () => {
  const totalFrames = computeTotalFrames();
  return (
    <>
      <Composition
        id="WaitingRoom"
        component={WaitingRoom}
        durationInFrames={totalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="KoboPresentation"
        component={KoboPresentation}
        durationInFrames={computeKoboFrames()}
        fps={KOBO_FPS}
        width={KOBO_WIDTH}
        height={KOBO_HEIGHT}
      />
    </>
  );
};
