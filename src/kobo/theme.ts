// KOBO Menuiserie — brand system
// Palette extraite du deck "Portrait Dirigeante" de Sandrine Cruchon.
// Identité : anthracite/slate technique + accent CUIVRE (signature),
// sur une trame "blueprint" (plan d'architecte / enveloppe du bâtiment).
export const kobo = {
  // Anthracite / encre
  ink: '#0F172A', // slate-900 — fond foncé principal
  inkDeep: '#080F1E', // plus sombre encore (vignettage)
  inkSoft: '#1E293B', // slate-800
  slate: '#334155', // slate-700 — texte sur clair
  slateMute: '#475569', // slate-600
  slateFaint: '#64748B', // slate-500
  slateLine: '#94A3B8', // slate-400

  // Cuivre / ambre — accent signature
  copper: '#B45309', // amber-700
  copperBright: '#CA8A04', // amber-600
  copperGlow: '#FBBF24', // amber-400
  copperDeep: '#7C3A06',

  // Surfaces claires
  paper: '#FAFAF9', // stone-50
  paperCool: '#F8FAFC', // slate-50
  white: '#FFFFFF',

  // Lignes / voiles
  gridDark: 'rgba(148, 163, 184, 0.10)', // trame blueprint sur fond foncé
  gridLight: 'rgba(15, 23, 42, 0.06)', // trame sur fond clair
  hairlineDark: 'rgba(148, 163, 184, 0.22)',
  hairlineLight: 'rgba(15, 23, 42, 0.12)',
  copperLine: 'rgba(180, 83, 9, 0.55)',

  shadowSoft: '0 40px 90px -30px rgba(8, 15, 30, 0.55)',
  shadowCard: '0 24px 60px -24px rgba(8, 15, 30, 0.45)',
} as const;

export const font = {
  // Display technique/architectural — Inter en très gras, tracking serré
  display: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
  sans: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;

// Largeur/hauteur de la composition (réutilise le format projet)
export const KOBO_FPS = 30;
export const KOBO_WIDTH = 1920;
export const KOBO_HEIGHT = 1080;
