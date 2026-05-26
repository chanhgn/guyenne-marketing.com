import { Img, staticFile } from 'remotion';

// Vrai logo Kebab de Lyon (PNG transparent) — public/kebab/logo.png
// Ratio natif ~ 1600x646.
export const KebabLogo: React.FC<{ width?: number }> = ({ width = 760 }) => {
  return (
    <Img
      src={staticFile('kebab/logo.png')}
      style={{ width, height: 'auto', display: 'block' }}
    />
  );
};
