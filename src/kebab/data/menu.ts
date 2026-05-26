// ============================================================================
// KEBAB DE LYON — donnees menu (prix reels, en dirhams)
// ============================================================================
// Prix issus du menu officiel. Formules : seul / + frites / menu (frites+boisson).
// >>> A COMPLETER : brand.contact (adresse, tel, horaires, livraison, reseaux)
//     Desserts "La casa del capo" : prix non communiques -> a confirmer.
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
  price: number; // prix de base en dirhams (Dh)
  priceNote?: string; // formules complementaires (frites / menu)
  from?: boolean; // affiche "A partir de"
};

// --- ECRAN 1 : KEBABS (3 tailles, 3 formules) -------------------------------
export const sandwichs: Product[] = [
  { id: 'kebab', image: 'kebab/sandwich-1.png', name: 'Kebab', tag: 'Pain maison, viande marinée', accentAr: 'بنّة ما كاينة', price: 30, priceNote: '+ Frites 39 · Menu 49' },
  { id: 'maxi-kebab', image: 'kebab/sandwich-4.png', name: 'Maxi Kebab', tag: 'Encore plus de viande', accentAr: 'للي جيعان بزاف', price: 39, priceNote: '+ Frites 49 · Menu 59' },
  { id: 'mega-kebab', image: 'kebab/sandwich-2.png', name: 'Mega Kebab', tag: 'Le défi des gourmands', accentAr: 'ميڭا كيباب', price: 49, priceNote: '+ Frites 59 · Menu 69' },
];

// --- ECRAN 2 : PLATS & MENUS ------------------------------------------------
export const plats: Product[] = [
  { id: 'tacos', image: 'kebab/tacos.png', name: 'Tacos Kebab', tag: 'Frites + sauces', accentAr: 'تاكوس كامل', price: 55, from: true },
  { id: 'assiette', image: 'kebab/assiette.png', name: 'Assiette Kebab', tag: 'Viande, frites & salade', accentAr: 'طبق شبعان', price: 70, from: true },
  { id: 'poutine', image: 'kebab/barquette.png', name: 'Poutine Kebab', tag: 'Frites, fromage & viande', accentAr: 'بالفروماج ذايب', price: 60 },
  // >>> Box Kebab (60 Dh) : en attente d'une photo dediee pour l'ajouter ici.
];

// --- ECRAN 3 : DESSERTS (La casa del capo) — prix a confirmer ---------------
export const desserts: Product[] = [
  { id: 'tiramisu-classique', image: 'kebab/tiramisu-classique.png', name: 'Tiramisu Classique', tag: 'Café & mascarpone', accentAr: 'دولسي', price: 28 },
  { id: 'tiramisu-kunafa', image: 'kebab/tiramisu-kunafa.png', name: 'Tiramisu Kunafa', tag: 'Croustillant doré', accentAr: 'كنافة كروسطيان', price: 28 },
  { id: 'tiramisu-citron', image: 'kebab/tiramisu-citron.png', name: 'Tiramisu Citron', tag: 'Frais & acidulé', accentAr: 'حامض و بنين', price: 28 },
  { id: 'tiramisu-framboise', image: 'kebab/tiramisu-framboise.png', name: 'Tiramisu Framboise', tag: 'Fruité & gourmand', accentAr: 'فرامبواز', price: 28 },
];

// Selection "best-sellers" pour le stop-trottoir
export const bestSellers: Product[] = [sandwichs[2], plats[0], sandwichs[0]];

export const brand = {
  name: 'KEBAB DE LYON',
  slogan: 'Au goût unique',
  sloganAr: 'بنّة ما كاينة',
  currency: 'Dh',
  // >>> Adresse exacte a confirmer <<<
  contact: {
    address: 'Fès — Maroc',
    phone: '07 80 65 20 05',
    delivery: 'Glovo',
    instagram: '@kebabdelyon',
  },
};

export const screenTitle = {
  sandwichs: { fr: 'NOS KEBABS', ar: 'الكباب ديالنا' },
  plats: { fr: 'NOS PLATS', ar: 'أطباقنا' },
  desserts: { fr: 'NOS DESSERTS', ar: 'تحلياتنا' },
};
