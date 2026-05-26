// ============================================================================
// KEBAB DE LYON — donnees editables
// ============================================================================
// >>> A COMPLETER PAR LE CLIENT <<<
//   - prices : prix reels en dirhams (placeholders pour l'instant)
//   - brand.contact : adresse / tel / horaires / livraison / reseaux
//   - accentAr : punchline en darija (script arabe) — ajustez la formulation
// Tout le reste (animations, formats) se met a jour automatiquement.
// ============================================================================

export const FPS = 30;
export const W16 = 1920;
export const H16 = 1080;
export const W9 = 1080;
export const H9 = 1920;

export type Product = {
  id: string;
  image: string; // fichier dans public/kebab/
  name: string; // titre FR (gros)
  tag?: string; // sous-titre court FR
  accentAr?: string; // punchline darija (script arabe)
  price: number; // en dirhams (Dh) — A CONFIRMER
};

// --- ECRAN 1 : SANDWICHS / KEBABS -------------------------------------------
export const sandwichs: Product[] = [
  { id: 'sandwich-1', image: 'kebab/sandwich-1.png', name: 'Sandwich Kebab', tag: 'Pain maison garni', accentAr: 'بنّة ما كاينة', price: 35 },
  { id: 'sandwich-2', image: 'kebab/sandwich-2.png', name: 'Kebab Fromage', tag: 'Fondant & généreux', accentAr: 'فروماج ذايب', price: 40 },
  { id: 'sandwich-3', image: 'kebab/sandwich-3.png', name: 'Kebab Sauce Blanche', tag: 'Le grand classique', accentAr: 'كلاسيك ديالنا', price: 38 },
  { id: 'sandwich-4', image: 'kebab/sandwich-4.png', name: 'Kebab Barbecue', tag: 'Saveur fumée', accentAr: 'دوق البراري', price: 38 },
];

// --- ECRAN 2 : PLATS & MENUS ------------------------------------------------
export const plats: Product[] = [
  { id: 'tacos', image: 'kebab/tacos.png', name: 'French Tacos', tag: 'Frites + 4 sauces', accentAr: 'تاكوس كامل', price: 42 },
  { id: 'assiette', image: 'kebab/assiette.png', name: 'Assiette Kebab', tag: 'Viande, frites & salade', accentAr: 'طبق شبعان', price: 55 },
  { id: 'barquette', image: 'kebab/barquette.png', name: 'Barquette Cheese', tag: 'À emporter, pain offert', accentAr: 'ديال الدار', price: 45 },
];

// --- ECRAN 3 : DESSERTS (La casa del capo) ----------------------------------
export const desserts: Product[] = [
  { id: 'tiramisu-classique', image: 'kebab/tiramisu-classique.png', name: 'Tiramisu Classique', tag: 'Café & mascarpone', accentAr: 'دولسي', price: 28 },
  { id: 'tiramisu-kunafa', image: 'kebab/tiramisu-kunafa.png', name: 'Tiramisu Kunafa', tag: 'Croustillant doré', accentAr: 'كنافة كروسطيان', price: 32 },
  { id: 'tiramisu-citron', image: 'kebab/tiramisu-citron.png', name: 'Tiramisu Citron', tag: 'Frais & acidulé', accentAr: 'حامض و بنين', price: 30 },
  { id: 'tiramisu-framboise', image: 'kebab/tiramisu-framboise.png', name: 'Tiramisu Framboise', tag: 'Fruité & gourmand', accentAr: 'فرامبواز', price: 30 },
];

// Selection "best-sellers" pour le stop-trottoir
export const bestSellers: Product[] = [sandwichs[1], plats[0], desserts[1]];

export const brand = {
  name: 'KEBAB DE LYON',
  slogan: 'Au goût unique',
  sloganAr: 'بنّة ما كاينة', // darija : un goût introuvable ailleurs
  currency: 'Dh',
  // >>> A COMPLETER <<<
  contact: {
    address: 'Fès — Maroc',
    phone: '06 00 00 00 00',
    hours: '11h — 00h · 7j/7',
    delivery: 'Glovo',
    instagram: '@kebabdelyon',
  },
};

export const screenTitle = {
  sandwichs: { fr: 'NOS SANDWICHS', ar: 'سندويتشاتنا' },
  plats: { fr: 'NOS PLATS', ar: 'أطباقنا' },
  desserts: { fr: 'NOS DESSERTS', ar: 'تحلياتنا' },
};
