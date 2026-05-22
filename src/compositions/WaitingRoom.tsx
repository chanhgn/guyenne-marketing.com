import { AbsoluteFill, Sequence } from 'remotion';
import { FPS, treatments } from '../data/treatments';
import { beforeAfterPairs } from '../data/beforeAfter';
import { IntroScene, INTRO_DURATION_SEC } from '../components/IntroScene';
import { OutroScene, OUTRO_DURATION_SEC } from '../components/OutroScene';
import { TreatmentScene, sceneDurationSec } from '../components/TreatmentScene';
import { BeforeAfterScene, BEFORE_AFTER_DURATION_SEC } from '../components/BeforeAfterScene';

const pairForTreatment = (id: string) =>
  beforeAfterPairs.find((p) => p.afterTreatmentId === id);

export const computeTotalFrames = (): number => {
  const intro = Math.round(INTRO_DURATION_SEC * FPS);
  const outro = Math.round(OUTRO_DURATION_SEC * FPS);
  const ba = Math.round(BEFORE_AFTER_DURATION_SEC * FPS);
  const total = treatments.reduce((acc, t) => {
    const dur = Math.round(sceneDurationSec(t) * FPS);
    const baDur = pairForTreatment(t.id) ? ba : 0;
    return acc + dur + baDur;
  }, 0);
  return intro + total + outro;
};

export const WaitingRoom: React.FC = () => {
  const intro = Math.round(INTRO_DURATION_SEC * FPS);
  const outro = Math.round(OUTRO_DURATION_SEC * FPS);
  const baDur = Math.round(BEFORE_AFTER_DURATION_SEC * FPS);

  let cursor = intro;
  const scenes: Array<{ from: number; dur: number; el: React.ReactElement }> = [
    { from: 0, dur: intro, el: <IntroScene /> },
  ];

  treatments.forEach((t) => {
    const sceneDur = Math.round(sceneDurationSec(t) * FPS);
    scenes.push({
      from: cursor,
      dur: sceneDur,
      el: <TreatmentScene treatment={t} />,
    });
    cursor += sceneDur;

    const pair = pairForTreatment(t.id);
    if (pair) {
      scenes.push({
        from: cursor,
        dur: baDur,
        el: <BeforeAfterScene pair={pair} />,
      });
      cursor += baDur;
    }
  });

  scenes.push({ from: cursor, dur: outro, el: <OutroScene /> });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {scenes.map((s, idx) => (
        <Sequence key={idx} from={s.from} durationInFrames={s.dur}>
          {s.el}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
