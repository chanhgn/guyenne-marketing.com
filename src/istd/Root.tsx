import React from 'react';
import { Composition } from 'remotion';
import { LogoPreview } from './LogoPreview';
import { PLANS, REEL_FRAMES, Reel } from './Reel';
import { Lang } from './copy';
import { REEL as F } from './theme';

/** Les deux versions partagent le montage : seul le module `copy` change. */
const VERSIONS: Array<{ suffix: string; lang: Lang }> = [
  { suffix: '', lang: 'fr' },
  { suffix: 'Ar', lang: 'ar' },
];

export const IstdRoot: React.FC = () => (
  <>
    {VERSIONS.map(({ suffix, lang }) => (
      <React.Fragment key={lang}>
        <Composition
          id={`IstdReel${suffix}`}
          component={Reel}
          defaultProps={{ lang }}
          durationInFrames={REEL_FRAMES}
          fps={F.FPS}
          width={F.WIDTH}
          height={F.HEIGHT}
        />
        {/* Chaque plan isolé, pour itérer sans re-rendre les 22 s. */}
        {PLANS.map(({ id, duration, component }) => (
          <Composition
            key={`${id}${suffix}`}
            id={`${id}${suffix}`}
            component={component}
            defaultProps={{ lang }}
            durationInFrames={duration}
            fps={F.FPS}
            width={F.WIDTH}
            height={F.HEIGHT}
          />
        ))}
      </React.Fragment>
    ))}

    <Composition id="IstdLogoPreview" component={LogoPreview} durationInFrames={1} fps={30} width={2400} height={1000} />
  </>
);
