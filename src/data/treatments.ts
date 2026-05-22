export type ClipPiece = {
  /** Filename inside remotion/public/ (eyes-blurred version) */
  file: string;
  /** Full duration of the source clip in seconds */
  durationSec: number;
};

export type Treatment = {
  id: string;
  category: string;
  categoryAr: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  pieces: ClipPiece[];
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Each piece plays from start to end of its source clip — no trimming, no zoom.
// Full native quality, eye-only blur via MediaPipe.
export const treatments: Treatment[] = [
  {
    id: '01_angiome_plan',
    category: 'Lésions vasculaires',
    categoryAr: 'الآفات الوعائية',
    title: 'Angiome plan',
    titleAr: 'الورم الوعائي المسطح',
    subtitle: 'Traitement laser vasculaire',
    subtitleAr: 'علاج وعائي بالليزر',
    description:
      'Effacement progressif d’une tache vasculaire au laser. Séances espacées, peu douloureuses, sans éviction sociale.',
    descriptionAr:
      'تلاشٍ تدريجي للوحمة الوعائية بالليزر. جلسات متباعدة، خفيفة الألم، دون انقطاع عن الحياة اليومية.',
    pieces: [
      { file: '01_angiome_plan_hardaj_1.mp4', durationSec: 54 },
      { file: '02_angiome_plan_hardaj_2.mp4', durationSec: 10 },
    ],
  },
  {
    id: '02_angiome_rubis_hasmouh',
    category: 'Lésions vasculaires',
    categoryAr: 'الآفات الوعائية',
    title: 'Angiome rubis (visage)',
    titleAr: 'الورم الوعائي الياقوتي (الوجه)',
    subtitle: 'Photocoagulation laser',
    subtitleAr: 'تخثير ضوئي بالليزر',
    description:
      'Petits points rouges en relief sur le visage. Disparition immédiate par photocoagulation, sans cicatrice.',
    descriptionAr:
      'نقاط حمراء بارزة على الوجه. زوال فوري بفضل التخثير الضوئي، دون أي ندبة.',
    pieces: [
      { file: '03_angiome_rubis_hasmouh.mp4', durationSec: 44 },
    ],
  },
  {
    id: '03_gros_angiome_rubis',
    category: 'Lésions vasculaires',
    categoryAr: 'الآفات الوعائية',
    title: 'Angiome rubis volumineux',
    titleAr: 'الورم الوعائي الياقوتي الكبير',
    subtitle: 'Photocoagulation laser ciblée',
    subtitleAr: 'تخثير ضوئي موجَّه بالليزر',
    description:
      'Lésions vasculaires plus volumineuses traitées en une seule séance. Croûte transitoire puis retour à la normale.',
    descriptionAr:
      'آفات وعائية أكبر تُعالج في جلسة واحدة. قشرة عابرة ثم عودة البشرة إلى حالتها الطبيعية.',
    pieces: [
      { file: '04_gros_angiome_rubis_1.mp4', durationSec: 25 },
      { file: '05_gros_angiome_rubis_2.mp4', durationSec: 14 },
    ],
  },
  {
    id: '04_lac_veineux',
    category: 'Lésions vasculaires',
    categoryAr: 'الآفات الوعائية',
    title: 'Lac veineux des lèvres',
    titleAr: 'بحيرة وريدية على الشفة',
    subtitle: 'Laser ND:YAG long pulse',
    subtitleAr: 'ليزر ND:YAG طويل النبضة',
    description:
      'Petite veine bleutée sur la lèvre. Effacement net en une à deux séances grâce au laser ND:YAG.',
    descriptionAr:
      'وريد صغير مزرَقّ على الشفة. زوال واضح في جلسة أو جلستين بفضل ليزر ND:YAG.',
    pieces: [
      { file: '07_lac_veineux_alami.mp4', durationSec: 34 },
    ],
  },
  {
    id: '05_keratose_seborrheique',
    category: 'Lésions pigmentées',
    categoryAr: 'الآفات الصِّبغية',
    title: 'Kératose séborrhéique',
    titleAr: 'التَّقَرُّن الدُّهني',
    subtitle: 'Retrait par radiofréquence',
    subtitleAr: 'إزالة بالموجات الراديوية',
    description:
      'Petites croûtes brunes du visage et du tronc. Retrait délicat, lisse la peau et l’éclaircit.',
    descriptionAr:
      'قشور بنية صغيرة على الوجه والجذع. إزالة لطيفة تُنعّم البشرة وتُفتّحها.',
    pieces: [
      { file: '06_keratose_seborrheique.mp4', durationSec: 60 },
    ],
  },
  {
    id: '06_papulosa_nigra',
    category: 'Lésions pigmentées',
    categoryAr: 'الآفات الصِّبغية',
    title: 'Dermatosis papulosa nigra',
    titleAr: 'الورم الحُلَيمي الأسود',
    subtitle: 'Traitement esthétique précis',
    subtitleAr: 'علاج تجميلي دقيق',
    description:
      'Multiples petits grains de beauté en relief sur les peaux foncées. Disparition lésion par lésion, sans tache.',
    descriptionAr:
      'حبيبات داكنة بارزة شائعة على البشرة السمراء. تُعالَج واحدة تلو الأخرى دون أثر.',
    pieces: [
      { file: '09_papulosa_nigra.mp4', durationSec: 47 },
    ],
  },
  {
    id: '07_ephelide',
    category: 'Lésions pigmentées',
    categoryAr: 'الآفات الصِّبغية',
    title: 'Éphélides (taches de rousseur)',
    titleAr: 'النَّمَش',
    subtitle: 'Laser pigmentaire',
    subtitleAr: 'ليزر للتصبّغات',
    description:
      'Éclaircissement homogène des taches du visage et des bras. Photoprotection essentielle après séance.',
    descriptionAr:
      'تفتيح متجانس لبقع الوجه والذراعين. الحماية من الشمس ضرورية بعد الجلسة.',
    pieces: [
      { file: '11_ephelide.mp4', durationSec: 27 },
    ],
  },
  {
    id: '08_onychomycose',
    category: 'Soins médicaux',
    categoryAr: 'علاجات طبّية',
    title: 'Onychomycose',
    titleAr: 'فُطار الأظافر',
    subtitle: 'Laser ND:YAG anti-mycose',
    subtitleAr: 'ليزر ND:YAG ضد الفطريات',
    description:
      'Champignon de l’ongle traité par laser sans médicament au long cours. Repousse saine sur plusieurs mois.',
    descriptionAr:
      'فطار في الظفر يُعالَج بالليزر دون أدوية طويلة الأمد. نمو سليم على مدى أشهر.',
    pieces: [
      { file: '08_onychomycose_ndyag.mp4', durationSec: 169 },
    ],
  },
  {
    id: '09_epilation_nordlys',
    category: 'Épilation',
    categoryAr: 'إزالة الشعر',
    title: 'Épilation laser Nordlys',
    titleAr: 'إزالة الشعر بليزر نوردليس',
    subtitle: 'Lumière intense pulsée nouvelle génération',
    subtitleAr: 'ضوء نبضي مكثّف من الجيل الجديد',
    description:
      'Réduction durable de la pilosité, tout phototype. Confortable, encadré médicalement.',
    descriptionAr:
      'تخفيض دائم لكثافة الشعر، يناسب كلّ الأنماط الجلدية. مريح وتحت إشراف طبّي.',
    pieces: [
      { file: '10_epilation_nordlys.mp4', durationSec: 75 },
    ],
  },
];

export const totalClipDurationSec = (t: Treatment): number =>
  t.pieces.reduce((acc, p) => acc + p.durationSec, 0);
