import { Composition } from 'remotion';
import { WaitingRoom, computeTotalFrames } from './compositions/WaitingRoom';
import { FPS, HEIGHT, WIDTH } from './data/treatments';

export const RemotionRoot: React.FC = () => {
  const totalFrames = computeTotalFrames();
  return (
    <Composition
      id="WaitingRoom"
      component={WaitingRoom}
      durationInFrames={totalFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
