import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Authority, BigNumber, Cta, Hook, Proofs, Promise } from './scenes';
import { istd } from './theme';

/** Découpage minuté du Reel, en frames à 30 fps. */
export const PLANS = [
  { id: 'Plan1Hook', label: 'Hook', from: 0, duration: 90, component: Hook },
  { id: 'Plan2Promesse', label: 'Promesse', from: 90, duration: 120, component: Promise },
  { id: 'Plan3Preuve', label: 'Preuve 90 %', from: 210, duration: 120, component: BigNumber },
  { id: 'Plan4Preuves', label: 'Preuves', from: 330, duration: 120, component: Proofs },
  { id: 'Plan5Autorite', label: 'Autorité', from: 450, duration: 90, component: Authority },
  { id: 'Plan6Cta', label: 'CTA WhatsApp', from: 540, duration: 120, component: Cta },
] as const;

export const REEL_FRAMES = 660; // 22 s à 30 fps

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: istd.bgDark }}>
    {PLANS.map(({ id, from, duration, component: Scene }) => (
      <Sequence key={id} from={from} durationInFrames={duration}>
        <Scene />
      </Sequence>
    ))}
  </AbsoluteFill>
);
