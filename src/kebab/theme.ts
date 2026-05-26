// Kebab de Lyon — identite visuelle extraite du logo (noir + or + blanc)
// Style "street food punchy" : fond sombre chaud, accents or, gros contrastes.
export const kebabTheme = {
  // Marque
  black: '#0B0A08',
  blackSoft: '#161310',
  charcoal: '#211C16',

  // Or (degrade du logo)
  gold: '#D9A441',
  goldBright: '#F4CE72',
  goldDeep: '#A9772A',
  goldPale: '#F7E6BE',

  // Accent appetence (braise / sauce)
  ember: '#E2541E',
  emberDeep: '#9E2B0B',

  // Texte
  cream: '#FBF6EC',
  white: '#FFFFFF',
  muted: 'rgba(251, 246, 236, 0.62)',

  // Degrades utilitaires
  goldGradient: 'linear-gradient(100deg, #A9772A 0%, #F4CE72 38%, #D9A441 62%, #8C5E1F 100%)',
  goldGradientV: 'linear-gradient(180deg, #F4CE72 0%, #D9A441 55%, #A9772A 100%)',

  // Ombres
  glow: '0 24px 80px -20px rgba(0, 0, 0, 0.75)',
  goldGlow: '0 0 40px rgba(217, 164, 65, 0.45)',
} as const;

export const kebabFonts = {
  // Display ultra-impactant pour les gros titres
  display: '"Anton", "Bebas Neue", Impact, sans-serif',
  // Texte secondaire / prix
  sans: '"Poppins", "Helvetica Neue", Arial, sans-serif',
  // Arabe / Darija
  arabic: '"Cairo", "Tajawal", "Noto Naskh Arabic", sans-serif',
} as const;
