import { staticFile, delayRender, continueRender } from 'remotion';

// Polices auto-hebergees (public/kebab/fonts/) — aucun acces reseau au rendu.
const FONTS: { family: string; weight: string; file: string }[] = [
  { family: 'Anton', weight: '400', file: 'kebab/fonts/anton-400.ttf' },
  { family: 'Poppins', weight: '500', file: 'kebab/fonts/poppins-500.ttf' },
  { family: 'Poppins', weight: '600', file: 'kebab/fonts/poppins-600.ttf' },
  { family: 'Poppins', weight: '700', file: 'kebab/fonts/poppins-700.ttf' },
  { family: 'Poppins', weight: '800', file: 'kebab/fonts/poppins-800.ttf' },
  { family: 'Cairo', weight: '600', file: 'kebab/fonts/cairo-600.ttf' },
  { family: 'Cairo', weight: '700', file: 'kebab/fonts/cairo-700.ttf' },
  { family: 'Cairo', weight: '800', file: 'kebab/fonts/cairo-800.ttf' },
];

if (typeof document !== 'undefined') {
  const handle = delayRender('kebab-fonts');
  Promise.all(
    FONTS.map((f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format('truetype')`, {
        weight: f.weight,
        style: 'normal',
      });
      return face.load().then((loaded) => {
        document.fonts.add(loaded);
      });
    }),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}
