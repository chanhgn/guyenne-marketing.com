import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Authority, BigNumber, Cta, Hook, Proofs, Promise } from './scenes';
import { LangProvider } from './anim';
import { Lang } from './copy';
import { istd } from './theme';

export type LangProps = { lang: Lang };

/** Enveloppe une scène dans le contexte de langue, pour l'exposer en composition. */
const localized = (Scene: React.FC): React.FC<LangProps> => {
  const Wrapped: React.FC<LangProps> = ({ lang }) => (
    <LangProvider lang={lang}>
      <Scene />
    </LangProvider>
  );
  return Wrapped;
};

/** Découpage minuté du Reel, en frames à 30 fps. */
export const PLANS = [
  { id: 'Plan1Hook', from: 0, duration: 90, component: localized(Hook) },
  { id: 'Plan2Promesse', from: 90, duration: 120, component: localized(Promise) },
  { id: 'Plan3Preuve', from: 210, duration: 120, component: localized(BigNumber) },
  { id: 'Plan4Preuves', from: 330, duration: 120, component: localized(Proofs) },
  { id: 'Plan5Autorite', from: 450, duration: 90, component: localized(Authority) },
  { id: 'Plan6Cta', from: 540, duration: 120, component: localized(Cta) },
] as const;

export const REEL_FRAMES = 660; // 22 s à 30 fps

export const Reel: React.FC<LangProps> = ({ lang }) => (
  <AbsoluteFill style={{ background: istd.bgDark }}>
    {PLANS.map(({ id, from, duration, component: Scene }) => (
      <Sequence key={id} from={from} durationInFrames={duration}>
        <Scene lang={lang} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
