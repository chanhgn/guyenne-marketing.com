/**
 * Tout le texte du Reel, dans les deux langues.
 *
 * Les deux versions partagent le même montage et les mêmes animations :
 * seul ce fichier change. Une correction de rythme profite donc aux deux.
 */

export type Lang = 'fr' | 'ar';

export type ReelCopy = {
  dir: 'ltr' | 'rtl';
  hook: { white: string[]; orange: string[] };
  promise: { kicker: string; lines: string[] };
  number: { lines: string[] };
  money: {
    kicker: string;
    from: string;
    to: string;
    unit: string;
    scale: string;
    market: string;
    marketLabel: string;
  };
  proofs: { kicker: string; rows: Array<[string, string]> };
  intl: {
    kicker: string;
    lead: string;
    countries: string[];
    salaryLabel: string;
    salary: string;
    convert: string;
  };
  authority: { name: string; sub: string };
  cta: {
    kicker: string;
    title: string;
    sub: string;
    small: string;
    big: string[];
    more: string;
    site: string;
  };
};

export const COPY: Record<Lang, ReelCopy> = {
  fr: {
    dir: 'ltr',
    hook: { white: ['Un métier', 'dans la santé.'], orange: ['Sans faire', 'médecine.'] },
    promise: {
      kicker: 'Formation diplômante',
      lines: ['Devenez', 'Technicien Spécialisé', 'en Prothèse Dentaire'],
    },
    number: { lines: ['de nos diplômés trouvent', 'un emploi dans l’année'] },
    money: {
      kicker: 'Ce que ça rapporte',
      from: '4 500',
      to: '15 000',
      unit: 'DH / mois',
      scale: 'de débutant à 5 ans d’expérience',
      market: '1 200',
      marketLabel: 'entreprises recrutent au Maroc',
    },
    proofs: {
      kicker: 'Ce que vous obtenez',
      rows: [
        ['Diplôme Bac+3', 'reconnu par l’État'],
        ['3 ans', '2 808 heures de formation'],
        ['68 %', 'de pratique en laboratoire'],
      ],
    },
    intl: {
      kicker: 'Et à l’étranger',
      lead: 'Un diplôme marocain reconnu en',
      countries: ['Belgique', 'France', 'Allemagne', 'Canada'],
      salaryLabel: 'En France',
      salary: '1 800 – 3 500 € / mois',
      convert: 'soit 19 000 à 37 000 DH',
    },
    authority: { name: 'ISTD Fès', sub: 'Depuis 2006 · plus de 500 diplômés' },
    cta: {
      kicker: 'Inscriptions 2026 / 2027',
      title: 'Rentrée le 7 septembre',
      sub: 'Places limitées',
      small: 'Écrivez-nous sur WhatsApp',
      big: ['Cliquez sur le bouton', 'en bas de la page'],
      more: 'En savoir plus sur',
      site: 'istd.ma',
    },
  },

  ar: {
    dir: 'rtl',
    hook: { white: ['خدمة', 'فمجال الصحة.'], orange: ['بلا ما تقرا', 'الطب.'] },
    promise: {
      kicker: 'تكوين ديبلومي',
      lines: ['ولّي', 'تقني متخصص', 'فتركيب الأسنان'],
    },
    number: { lines: ['من الخريجين ديالنا', 'كيلقاو الخدمة ف عام'] },
    money: {
      kicker: 'شحال كتربح',
      from: '4 500',
      to: '15 000',
      unit: 'درهم / الشهر',
      scale: 'من البداية حتى 5 سنين ديال الخبرة',
      market: '1 200',
      marketLabel: 'شركة كتوظف فالمغرب',
    },
    proofs: {
      kicker: 'شنو غادي تاخد',
      rows: [
        ['ديبلوم باك+3', 'معترف بيه من الدولة'],
        ['3 سنين', '2808 ساعة ديال التكوين'],
        ['68٪', 'تطبيق فاللابو'],
      ],
    },
    intl: {
      kicker: 'وفالخارج',
      lead: 'ديبلوم مغربي معترف بيه ف',
      countries: ['بلجيكا', 'فرنسا', 'ألمانيا', 'كندا'],
      salaryLabel: 'ففرنسا',
      salary: '1 800 – 3 500 € / الشهر',
      convert: 'يعني من 19 000 حتى 37 000 درهم',
    },
    authority: { name: 'ISTD فاس', sub: 'من 2006 · أكثر من 500 خريج' },
    cta: {
      kicker: 'التسجيل 2026 / 2027',
      title: 'الدخول ف 7 شتنبر',
      sub: 'الأماكن محدودة',
      small: 'صيفط لينا رسالة فواتساب',
      big: ['دير كليك على الزر', 'لي تحت الفيديو'],
      more: 'زيد عرف أكثر ف',
      site: 'istd.ma',
    },
  },
};
