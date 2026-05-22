import { Img, staticFile } from 'remotion';

type Props = {
  width: number;
  /** Render the logo in a single-tone variant by applying a CSS filter. */
  monotone?: 'navy' | 'paper' | 'coral' | 'none';
};

const filterFor = (m: NonNullable<Props['monotone']>): string | undefined => {
  switch (m) {
    case 'none':
      return undefined;
    case 'navy':
      // Force everything to navy via filter mix (used on light backgrounds)
      return 'brightness(0.6) saturate(2)';
    case 'paper':
      // Lighten the logo to paper white for use on dark backgrounds
      return 'brightness(0) invert(1) opacity(0.95)';
    case 'coral':
      return 'hue-rotate(-20deg) saturate(1.4)';
  }
};

export const LogoMark: React.FC<Props> = ({ width, monotone = 'none' }) => {
  const src = staticFile('logo-lakhssassi.png');
  const aspect = 420 / 130;
  const height = width / aspect;
  const filter = filterFor(monotone);

  return (
    <Img
      src={src}
      style={{
        width,
        height,
        objectFit: 'contain',
        filter,
      }}
    />
  );
};
