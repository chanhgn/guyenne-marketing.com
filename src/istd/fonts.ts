import { continueRender, delayRender, staticFile } from 'remotion';

/**
 * Polices de la charte ISTD chargées depuis public/istd-fonts.
 *
 * Volontairement hors-ligne : le rendu ne doit pas dépendre de la joignabilité
 * de fonts.gstatic.com. Ce sont des fichiers variables (400 → 700), donc une
 * graisse quelconque de cette plage est disponible sans fichier supplémentaire.
 */

const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,' +
  'U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

const ARABIC =
  'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,' +
  'U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FEFF';

const FACES: Array<{
  family: string;
  file: string;
  style: 'normal' | 'italic';
  range: string;
}> = [
  { family: 'Jost', file: 'jost-normal-latin.woff2', style: 'normal', range: LATIN },
  { family: 'Jost', file: 'jost-italic-latin.woff2', style: 'italic', range: LATIN },
  { family: 'Inter', file: 'inter-normal-latin.woff2', style: 'normal', range: LATIN },
  { family: 'Cairo', file: 'cairo-normal-arabic.woff2', style: 'normal', range: ARABIC },
];

const handle = delayRender('Chargement des polices ISTD');

Promise.all(
  FACES.map((f) => {
    const face = new FontFace(f.family, `url(${staticFile(`istd-fonts/${f.file}`)}) format('woff2')`, {
      style: f.style,
      weight: '400 700',
      unicodeRange: f.range,
    });
    return face.load().then((loaded) => {
      document.fonts.add(loaded);
    });
  }),
)
  .then(() => continueRender(handle))
  .catch((err) => {
    // Ne pas bloquer le rendu sur une police : mieux vaut un fallback visible
    // qu'un rendu qui échoue.
    console.error('Polices ISTD non chargées', err);
    continueRender(handle);
  });
