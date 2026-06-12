import { AbsoluteFill, Sequence } from 'remotion';
import { KOBO_FPS } from './theme';
import {
  D,
  balma,
  chantiers,
  essor,
  formation,
  pme,
  pose,
  pourquoi,
  rabastens,
  rigueur,
} from './data';
import { TitleScene } from './scenes/TitleScene';
import { ProfileScene } from './scenes/ProfileScene';
import { MilestonesScene } from './scenes/MilestonesScene';
import { PillarsScene } from './scenes/PillarsScene';
import { CaseScene } from './scenes/CaseScene';
import { StatsScene } from './scenes/StatsScene';
import { OutroScene } from './scenes/OutroScene';

const sec = (s: number) => Math.round(s * KOBO_FPS);

type Block = { dur: number; el: React.ReactElement };

const blocks: Block[] = [
  { dur: D.title, el: <TitleScene /> },
  { dur: D.profile, el: <ProfileScene index={2} /> },
  {
    dur: D.formation,
    el: <MilestonesScene index={3} kicker={formation.kicker} title={formation.title} items={formation.items} />,
  },
  {
    dur: D.chantiers,
    el: (
      <MilestonesScene
        index={4}
        kicker={chantiers.kicker}
        title={chantiers.title}
        items={chantiers.items}
        highlight={chantiers.highlight}
        photos={chantiers.photos}
      />
    ),
  },
  {
    dur: D.essor,
    el: (
      <MilestonesScene
        index={5}
        kicker={essor.kicker}
        title={essor.title}
        items={essor.items}
        photos={essor.photos}
      />
    ),
  },
  {
    dur: D.pme,
    el: <PillarsScene index={6} kicker={pme.kicker} title={pme.title} pillars={pme.pillars} badges={pme.badges} />,
  },
  {
    dur: D.rigueur,
    el: <MilestonesScene index={7} kicker={rigueur.kicker} title={rigueur.title} items={rigueur.items} />,
  },
  {
    dur: D.pose,
    el: <PillarsScene index={8} kicker={pose.kicker} title={pose.title} pillars={pose.pillars} partners={pose.partners} />,
  },
  {
    dur: D.balma,
    el: (
      <CaseScene
        index={9}
        kicker={balma.kicker}
        title={balma.title}
        photo={balma.photo}
        bullets={balma.bullets}
        benefit={balma.benefit}
      />
    ),
  },
  {
    dur: D.rabastens,
    el: (
      <CaseScene
        index={10}
        kicker={rabastens.kicker}
        title={rabastens.title}
        photo={rabastens.photo}
        bullets={rabastens.bullets}
        benefit={rabastens.benefit}
        flip
      />
    ),
  },
  {
    dur: D.pourquoi,
    el: (
      <PillarsScene
        index={11}
        kicker={pourquoi.kicker}
        title={pourquoi.title}
        pillars={pourquoi.pillars}
        note={pourquoi.finance}
      />
    ),
  },
  { dur: D.confiance, el: <StatsScene index={12} /> },
  { dur: D.outro, el: <OutroScene /> },
];

export const computeKoboFrames = (): number =>
  blocks.reduce((acc, b) => acc + sec(b.dur), 0);

export const KoboPresentation: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#080F1E' }}>
      {blocks.map((b, i) => {
        const from = cursor;
        const dur = sec(b.dur);
        cursor += dur;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {b.el}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
