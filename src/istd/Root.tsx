import React from 'react';
import { Composition } from 'remotion';
import { LogoPreview } from './LogoPreview';

export const IstdRoot: React.FC = () => (
  <>
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
