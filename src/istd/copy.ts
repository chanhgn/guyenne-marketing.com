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
    rows: Array<{ flag: string; country: string; local: string; mad: string }>;
    footnote: string;
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
    hook: { white: ['Devenez', 'Prothésiste', 'Dentaire'], orange: ['reconnu à', 'l’international'] },
    promise: {
      kicker: 'Un métier dans la santé',
      lines: ['Sans faire', 'médecine.'],
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
      lead: 'Salaire moyen avec ce diplôme',
      rows: [
        { flag: '🇧🇪', country: 'Belgique', local: '≈ 3 000 €', mad: '32 000 DH' },
        { flag: '🇫🇷', country: 'France', local: '≈ 2 500 €', mad: '27 000 DH' },
        { flag: '🇩🇪', country: 'Allemagne', local: '≈ 2 400 €', mad: '26 000 DH' },
        { flag: '🇨🇦', country: 'Canada', local: '≈ 3 500 $CA', mad: '25 000 DH' },
      ],
      footnote: 'salaires bruts moyens, convertis en dirhams',
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
    hook: { white: ['ولّي', 'تقني ديال الأسنان'], orange: ['معترف بيك', 'فالخارج'] },
    promise: {
      kicker: 'خدمة فمجال الصحة',
      lines: ['بلا ما تقرا', 'الطب.'],
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
      lead: 'متوسط الأجرة بهاد الديبلوم',
      rows: [
        { flag: '🇧🇪', country: 'بلجيكا', local: '≈ 3 000 €', mad: '32 000 درهم' },
        { flag: '🇫🇷', country: 'فرنسا', local: '≈ 2 500 €', mad: '27 000 درهم' },
        { flag: '🇩🇪', country: 'ألمانيا', local: '≈ 2 400 €', mad: '26 000 درهم' },
        { flag: '🇨🇦', country: 'كندا', local: '≈ 3 500 $CA', mad: '25 000 درهم' },
      ],
      footnote: 'أجور خام متوسطة، محولة للدرهم',
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
