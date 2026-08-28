import React from 'react';
import { Composition } from 'remotion';
import { LogoPreview } from './LogoPreview';
import { PLANS, REEL_FRAMES, Reel } from './Reel';
import { REEL as F } from './theme';

export const IstdRoot: React.FC = () => (
  <>
    <Composition
      id="IstdReel"
      component={Reel}
      durationInFrames={REEL_FRAMES}
      fps={F.FPS}
      width={F.WIDTH}
      height={F.HEIGHT}
    />

    {/* Chaque plan isolé, pour valider et itérer sans re-rendre les 22 s. */}
    {PLANS.map(({ id, duration, component }) => (
      <Composition
        key={id}
        id={id}
        component={component}
        durationInFrames={duration}
        fps={F.FPS}
        width={F.WIDTH}
        height={F.HEIGHT}
      />
    ))}

    <Composition
      id="IstdLogoPreview"
      component={LogoPreview}
      durationInFrames={1}
      fps={30}
      width={2400}
      height={1000}
    />
  </>
);
