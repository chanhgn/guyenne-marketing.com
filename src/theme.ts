// Brand colors extracted from the official Dr Lakhssassi logo
// Navy:  #142663   |   Coral: #DE2068
export const theme = {
  // Brand
  navy: '#142663',
  navyLight: '#2B3E85',
  navyDeep: '#08113A',
  coral: '#DE2068',
  coralLight: '#F25D8E',
  coralPale: '#FCEAF1',

  // Surfaces
  bgDeep: '#08113A', // dark scene background
  bgWarm: '#F4EEE7',
  paper: '#FAF7F2',

  // Text
  ink: '#142663',
  inkSoft: '#384E83',
  inkMute: '#7686A8',

  // Lines
  hairline: 'rgba(20, 38, 99, 0.15)',
  shadowSoft: '0 30px 80px -20px rgba(8, 17, 58, 0.35)',
} as const;

export const fontStack = {
  serif: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
  sans: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
  arabic: '"Cairo", "Tajawal", "Noto Naskh Arabic", "Geeza Pro", serif',
} as const;
