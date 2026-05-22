export type BeforeAfterPair = {
  /** ID of the matching treatment (so we know where to insert the scene) */
  afterTreatmentId: string;
  title: string;
  titleAr: string;
  /** Public filenames */
  avantFile: string;
  apresFile: string;
  /** CSS objectPosition for the crop, format "X% Y%" — same applied to both halves */
  objectPosition: string;
  /** Optional scale to zoom further into the cropped area */
  imageScale: number;
}

export const beforeAfterPairs: BeforeAfterPair[] = [
  {
    afterTreatmentId: '02_angiome_rubis_hasmouh',
    title: 'Angiome rubis du front',
    titleAr: 'الورم الوعائي الياقوتي على الجبهة',
    avantFile: 'ba_hasmouh_avant.jpg',
    apresFile: 'ba_hasmouh_apres.jpg',
    // Forehead only — push eyes off the bottom edge
    objectPosition: '50% 8%',
    imageScale: 1.6,
  },
  {
    afterTreatmentId: '04_lac_veineux',
    title: 'Lac veineux de la lèvre',
    titleAr: 'بحيرة وريدية على الشفة',
    avantFile: 'ba_lac_veineux_avant.jpg',
    apresFile: 'ba_lac_veineux_apres.jpg',
    // Lip-only — clip the nose out at the top
    objectPosition: '50% 68%',
    imageScale: 1.7,
  },
  {
    afterTreatmentId: '06_papulosa_nigra',
    title: 'Papulosa nigra du cou',
    titleAr: 'الورم الحُلَيمي على الرقبة',
    avantFile: 'ba_papulosa_avant.jpg',
    apresFile: 'ba_papulosa_apres.jpg',
    // Mid-neck — already safe (chin only, no face)
    objectPosition: '50% 55%',
    imageScale: 1.15,
  },
  {
    afterTreatmentId: '09_epilation_nordlys',
    title: 'Épilation laser du menton',
    titleAr: 'إزالة شعر الذقن بالليزر',
    avantFile: 'ba_epilation_avant.jpg',
    apresFile: 'ba_epilation_apres.jpg',
    // Jaw/chin only — push lips and nose off the top
    objectPosition: '50% 75%',
    imageScale: 1.55,
  },
];
