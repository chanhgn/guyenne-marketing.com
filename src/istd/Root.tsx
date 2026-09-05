import React from 'react';
import { Composition } from 'remotion';
import { LogoPreview } from './LogoPreview';
import { POST, POSTS } from './Posts';
import { framesFor, plansFor, Reel } from './Reel';
import { Lang } from './copy';
import { REEL as F } from './theme';

/** Les deux versions partagent le montage ; seuls le texte et le minutage changent. */
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
          durationInFrames={framesFor(lang)}
          fps={F.FPS}
          width={F.WIDTH}
          height={F.HEIGHT}
        />
        {/* Chaque plan isolé, à la durée de sa langue. */}
        {plansFor(lang).map(({ id, duration, component }) => (
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

    {/* Posts Instagram 4:5, images fixes. */}
    {POSTS.map(({ id, component }) => (
      <Composition
        key={id}
        id={id}
        component={component}
        durationInFrames={1}
        fps={30}
        width={POST.WIDTH}
        height={POST.HEIGHT}
      />
    ))}

    <Composition id="IstdLogoPreview" component={LogoPreview} durationInFrames={1} fps={30} width={2400} height={1000} />
  </>
);
