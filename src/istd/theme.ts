// Charte ISTD Fès — extraite du kit Elementor d'istd.ma et du logo officiel.
// Le logo impose un duo orange/bleu que le site sous-exploitait :
// le bleu était rangé en "Accent 3" et n'apparaissait presque nulle part.
export const istd = {
  // Duo de marque
  orange: '#F4380F',
  blue: '#0C0CC4',

  // Surfaces
  bgLight: '#FAF6F3',
  bgBeige: '#F3E9E1',
  bgDark: '#1C1C1C',
  bgBlack: '#000000',
  white: '#FFFFFF',

  // Texte
  heading: '#110E0E',
  body: '#493C3C',

  // Accents chauds du kit
  warm1: '#E9BFB3',
  warm2: '#D7CAC6',
  warm3: '#DBC1BD',
  line: '#DCDCDE',
} as const;

export const istdFonts = {
  // Titres et chiffres : Jost 600 — la police des H1/H2 du site
  display: '"Jost", "Helvetica Neue", Helvetica, Arial, sans-serif',
  // Texte courant et sous-titres : Inter
  body: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
  arabic: '"Cairo", "Tajawal", "Noto Naskh Arabic", sans-serif',
} as const;

// Format Reel Instagram
export const REEL = { WIDTH: 1080, HEIGHT: 1920, FPS: 30 } as const;
