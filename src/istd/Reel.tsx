import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Authority, BigNumber, Cta, Hook, International, Money, Proofs, Promise } from './scenes';
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

/** L'ordre des plans, identique dans les deux langues. */
export const SCENES = [
  { id: 'Plan1Hook', component: localized(Hook) },
  { id: 'Plan2Promesse', component: localized(Promise) },
  { id: 'Plan3Preuve', component: localized(BigNumber) },
  { id: 'Plan4Preuves', component: localized(Proofs) },
  { id: 'Plan5Salaire', component: localized(Money) },
  { id: 'Plan6International', component: localized(International) },
  { id: 'Plan7Cta', component: localized(Cta) },
  { id: 'Plan8Logo', component: localized(Authority) },
] as const;

/**
 * Durées par langue, en frames à 30 fps.
 *
 * La darija est plus longue à dire que le français à contenu égal : elle
 * accumule les mots-outils, et les nombres y sont plus étirés. À durée
 * identique, la comédienne devait débiter à plus de 3,5 mots/seconde.
 * Les plans arabes sont donc allongés pour retomber autour de 2,5.
 */
export const DURATIONS: Record<Lang, readonly number[]> = {
  fr: [90, 105, 105, 120, 120, 165, 120, 75], //  900 frames — 30,0 s
  ar: [105, 120, 135, 150, 150, 195, 150, 90], // 1095 frames — 36,5 s
} as const;

export type Plan = { id: string; from: number; duration: number; component: React.FC<LangProps> };

/** Découpage minuté d'une langue : les débuts se déduisent des durées. */
export const plansFor = (lang: Lang): Plan[] => {
  let from = 0;
  return SCENES.map((scene, i) => {
    const duration = DURATIONS[lang][i];
    const plan = { id: scene.id, from, duration, component: scene.component };
    from += duration;
    return plan;
  });
};

export const framesFor = (lang: Lang): number => DURATIONS[lang].reduce((a, b) => a + b, 0);

export const Reel: React.FC<LangProps> = ({ lang }) => (
  <AbsoluteFill style={{ background: istd.bgDark }}>
    {plansFor(lang).map(({ id, from, duration, component: Scene }) => (
      <Sequence key={id} from={from} durationInFrames={duration}>
        <Scene lang={lang} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
