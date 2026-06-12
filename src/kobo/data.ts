// Contenu de la présentation animée KOBO — "Portrait Dirigeante" de Sandrine Cruchon.
// Toutes les durées sont en secondes. La vidéo est silencieuse (lecture continue).

export type Milestone = {
  year?: string;
  title: string;
  org?: string;
  body: string;
};

export type Bullet = { lead: string; body: string };

export const brand = {
  name: 'KOBO',
  tagline: "Créateur d'ouvertures",
  speaker: 'Sandrine Cruchon',
  speakerRole: 'Gérante associée — KOBO Menuiserie',
  city: 'Tournefeuille · Toulouse',
  email: 'contact@kobo-alu.fr',
  phone: '05 61 85 51 40',
  web: 'www.kobo-alu.fr',
  address: '164 Chemin de Larramet, 31170 Tournefeuille',
};

// Durées par scène (s)
export const D = {
  title: 12,
  profile: 34,
  formation: 38,
  chantiers: 44,
  essor: 44,
  pme: 38,
  rigueur: 38,
  pose: 46,
  balma: 46,
  rabastens: 40,
  pourquoi: 48,
  confiance: 34,
  outro: 18,
} as const;

export const profile = {
  kicker: 'Portrait dirigeante',
  title: 'Une gérante passionnée',
  paras: [
    "Née à Bordeaux en juin 1978, j'ai construit ma trajectoire autour de deux piliers : une rigueur technique absolue, issue du terrain, et un profond dévouement familial.",
    'Mère de deux enfants — un aîné de 19 ans en études supérieures, un cadet de 15 ans au lycée.',
  ],
  signature: 'Une vie dédiée à l’art des façades et de l’enveloppe du bâtiment.',
};

export const formation = {
  kicker: 'Fondations académiques',
  title: 'Une expertise née de l’ingénierie',
  items: [
    {
      title: 'BTS Enveloppe du Bâtiment',
      org: 'Études supérieures à Anglet',
      body: 'Une formation hautement technique : physique du bâtiment, structures porteuses, thermique des menuiseries, étude globale de la peau des édifices.',
    },
    {
      title: 'DNTS Spécialiste des Façades',
      org: 'Formation à Évry, en alternance',
      body: 'Spécialisation de pointe : menuiserie aluminium, façades-rideaux complexes et vitrages structurels — théorie d’ingénierie et pratique terrain.',
    },
  ] as Milestone[],
};

export const chantiers = {
  kicker: 'Premiers grands chantiers',
  title: 'L’exigence du terrain',
  items: [
    {
      title: 'Apprentissage chez REALCO',
      body: 'Un premier poste fondateur pour s’imprégner de l’exigence opérationnelle et de la réalité des chantiers de menuiserie.',
    },
    {
      title: 'Conduite de travaux chez CANCE',
      body: 'Pilotage financier et technique de chantiers tertiaires d’envergure, de 25 000 € à plus de 3 000 000 €.',
    },
  ] as Milestone[],
  highlight: 'Référence marquante — supervision de l’enveloppe architecturale du complexe tertiaire ICADE à Toulouse.',
  photos: ['kobo_icade.png', 'kobo_immeuble_toulouse.png'],
};

export const essor = {
  kicker: 'L’essor d’une entrepreneuse',
  title: 'De la conduite de travaux à la reprise',
  items: [
    {
      title: 'Alkar Aluminium',
      body: 'Conduite de chantiers complexes à forte valeur technique. Chantiers majeurs : l’Hôpital de Mauléon et la façade iconique du Mama Shelter à Toulouse.',
    },
    {
      title: 'Reprise de MDG Fermetures',
      body: 'Une opportunité d’entreprendre née de l’amour du métier : reprise d’une PME locale (particuliers & tertiaire) au départ en retraite du dirigeant historique. MDG devient KOBO.',
    },
  ] as Milestone[],
  photos: ['kobo_mauleon.png'],
};

export const pme = {
  kicker: 'Une PME proche de vous',
  title: 'Gages de confiance',
  pillars: [
    {
      lead: 'Proximité & écoute',
      body: 'PME à taille humaine basée à Tournefeuille, en synergie directe avec les propriétaires et acteurs tertiaires de l’agglomération toulousaine.',
    },
    {
      lead: 'Spécialisation technique',
      body: 'Focus absolu sur la menuiserie haut de gamme, l’aluminium technique sur-mesure et l’optimisation thermique des bâtiments.',
    },
    {
      lead: 'Certifiée RGE & Qualibat',
      body: 'La certitude d’un travail d’expert, ouvrant droit aux aides de l’État pour l’efficacité énergétique.',
    },
  ] as Bullet[],
  badges: ['kobo_qualibat.png', 'kobo_synerciel.png'],
};

export const rigueur = {
  kicker: 'Rigueur & précision KOBO',
  title: 'Un process sans surprise',
  items: [
    {
      title: '1. Conseil & étude clairs',
      body: 'Chaque projet démarre par un diagnostic sur place. Des outils d’ingénierie de pointe (Pro Devis) pour des chiffrages rigoureux, transparents, détaillés poste par poste.',
    },
    {
      title: '2. Relevé de côtes sur site',
      body: 'Une commande d’usine sans erreur exige une précision infaillible : le relevé de côtes final pour la fabrication est systématiquement réalisé en personne.',
    },
  ] as Milestone[],
};

export const pose = {
  kicker: 'La qualité de pose directe',
  title: 'Des partenaires d’élite, un suivi dirigeant',
  pillars: [
    {
      lead: "Partenaires d'élite",
      body: 'Fabrication confiée à des fournisseurs français et européens : Fenêtréa, Méo, Ates, Bel’m et la Maison Cadiou pour les portails haut de gamme.',
    },
    {
      lead: '4 équipes de spécialistes',
      body: 'Des installateurs qualifiés, segmentés par corps de métier : rénovation pure, grands projets tertiaires, clôtures & portails motorisés, portes de garage.',
    },
    {
      lead: 'Suivi 100 % dirigeant',
      body: 'Aucun intermédiaire technique. La conformité esthétique et l’étanchéité de chaque chantier sont pilotées en direct par Sandrine ou Jean-François.',
    },
  ] as Bullet[],
  partners: [
    'kobo_fenetrea.png',
    'kobo_schuco.png',
    'kobo_meo.png',
    'kobo_cadiou.png',
    'kobo_ates.png',
  ],
};

export const balma = {
  kicker: 'Étude de cas — Villa de Balma',
  title: 'Rénovation complète',
  photo: 'kobo_villa_balma.jpg',
  bullets: [
    { lead: 'Le déclencheur', body: 'Projet confié à la suite de la recommandation enthousiaste d’un client conquis.' },
    { lead: 'Le défi', body: 'Mixer le PVC plaxé à l’étage et l’aluminium Fenêtréa haute isolation au RDC pour ajuster l’enveloppe budgétaire.' },
    { lead: "L'astuce KOBO", body: 'Préservation éco-responsable des persiennes métalliques d’origine — sablage lourd et thermolaquage RAL 7016 Anthracite.' },
  ] as Bullet[],
  benefit: 'Harmonie visuelle absolue, confort thermique idéal et budget global optimisé.',
};

export const rabastens = {
  kicker: 'Étude de cas tertiaire — Mairie de Rabastens',
  title: 'Rénovation complète',
  photo: 'kobo_mairie_rabastens.jpg',
  bullets: [
    { lead: 'Le déclencheur', body: 'Projet remporté à la suite d’un appel d’offres.' },
    { lead: 'Le défi', body: 'Secteur ABF (Architecte des Bâtiments de France) et aluminium Schüco haute isolation, cintré.' },
  ] as Bullet[],
  benefit: 'Harmonie visuelle absolue, confort thermique idéal et budget global optimisé.',
};

export const pourquoi = {
  kicker: 'Pourquoi choisir KOBO ?',
  title: 'Quatre raisons décisives',
  pillars: [
    { lead: 'Technicité', body: 'Fabrication sur-mesure en interne : souplesse technique, maîtrise des délais et qualité constante sur toutes nos réalisations.' },
    { lead: 'Showroom de proximité', body: 'Un espace dédié à Tournefeuille pour apprécier en réel le fonctionnement, les finitions et la robustesse de nos menuiseries.' },
    { lead: 'Circuit court de décision', body: 'Aucun commercial tiers : vous dialoguez directement avec les deux gérants-associés. Réactivité optimale, engagements fiables.' },
    { lead: 'Savoir-faire hybride B2C & B2B', body: 'Des méthodologies rigoureuses adaptées aussi bien aux villas des particuliers qu’aux structures tertiaires complexes.' },
  ] as Bullet[],
  finance: 'Solutions de financement souples — paiement échelonné via notre partenariat avec la Société Générale (France Finances).',
};

export const confiance = {
  kicker: 'La confiance par les faits',
  title: 'Notre gage de confiance',
  stats: [
    { value: '4.9', unit: '/5', label: 'Satisfaction client' },
    { value: '50', unit: 'ans', label: "d'expérience cumulée" },
    { value: '100', unit: '+/an', label: 'chantiers uniques' },
  ],
  body: 'En alliant les parcours de Sandrine Cruchon et Jean-François Mores, KOBO réunit plus de 50 ans d’expérience dans les métiers de la fermeture et des façades. Chaque année, plus de 100 chantiers uniques prennent vie sous notre supervision exclusive à travers l’Occitanie, portés par des certifications d’État reconnues (Qualibat, RGE).',
};

export const outro = {
  title: 'Merci pour votre attention',
  sub: 'Des questions ?',
};
