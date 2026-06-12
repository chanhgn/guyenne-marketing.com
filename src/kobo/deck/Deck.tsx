import React from 'react';
import { AbsoluteFill, Img, Sequence, staticFile } from 'remotion';
import { font } from '../theme';

// =====================================================================
// KOBO — "Deck éditorial" MONOCHROME : anthracite (RAL 7016) + blanc.
// Aucune couleur d'accent. Slides plein cadre, rendues en images HD
// puis intégrées en Google Slides.
// =====================================================================

const W = 1920;
const H = 1080;

// Palette monochrome
const A = {
  ink: '#23282E',
  inkDeep: '#15181C',
  white: '#FFFFFF',
  soft: '#EDEEF0',
  grey: '#B9BEC6',
  greyMid: '#8B919A',
  faint: '#6A6F77',
  line: 'rgba(255,255,255,0.14)',
  lineSoft: 'rgba(255,255,255,0.08)',
  ghost: 'rgba(255,255,255,0.07)',
  rule: '#FFFFFF',
};
const BG = `radial-gradient(120% 110% at 50% -10%, #2C323A 0%, #23282E 48%, ${A.inkDeep} 100%)`;
// scrim anthracite (neutre)
const SC = '20,23,27';

const Cover: React.FC<{ file: string; pos?: string }> = ({ file, pos = 'center' }) => (
  <Img src={staticFile(file)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos }} />
);

const CornerTicks: React.FC = () => {
  const c = 'rgba(255,255,255,0.7)';
  const m = 64;
  const L = 54;
  const t = 2;
  const bar = (s: React.CSSProperties) => <div style={{ position: 'absolute', background: c, ...s }} />;
  return (
    <>
      {bar({ top: m, right: m, width: L, height: t })}
      {bar({ top: m, right: m, width: t, height: L })}
      {bar({ bottom: m, left: m, width: L, height: t })}
      {bar({ bottom: m, left: m, width: t, height: L })}
    </>
  );
};

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 26 }}>
    <div style={{ width: 54, height: 2, background: A.white }} />
    <span style={{ fontFamily: font.sans, fontSize: 23, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', color: A.soft }}>
      {children}
    </span>
  </div>
);

const GhostNum: React.FC<{ n: string; style?: React.CSSProperties }> = ({ n, style }) => (
  <div style={{ fontFamily: font.display, fontWeight: 800, color: A.ghost, lineHeight: 0.8, letterSpacing: -4, ...style }}>{n}</div>
);

const Logo: React.FC<{ w: number }> = ({ w }) => (
  <Img src={staticFile('kobo_logo_light_full.png')} style={{ width: w, height: 'auto' }} />
);

const Slide: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ width: W, height: H, background: BG, overflow: 'hidden' }}>{children}</AbsoluteFill>
);

const scrim = (dir: string, ...stops: string[]) => `linear-gradient(${dir}, ${stops.join(', ')})`;

// ---------- 1. Couverture ----------
const S1: React.FC = () => (
  <Slide>
    <Cover file="kobo_villa_balma.jpg" pos="center 60%" />
    <AbsoluteFill style={{ background: scrim('100deg', `rgba(${SC},0.97) 0%`, `rgba(${SC},0.86) 38%`, `rgba(${SC},0.30) 100%`) }} />
    <AbsoluteFill style={{ background: scrim('0deg', `rgba(${SC},0.88) 0%`, 'transparent 45%') }} />
    <CornerTicks />
    <div style={{ position: 'absolute', left: 120, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 1100 }}>
      <div style={{ fontFamily: font.sans, fontSize: 23, fontWeight: 700, letterSpacing: 7, textTransform: 'uppercase', color: A.grey, marginBottom: 40 }}>
        Menuiseries &amp; aménagements extérieurs
      </div>
      <Logo w={640} />
      <div style={{ marginTop: 44, height: 2, width: 320, background: A.white }} />
      <div style={{ marginTop: 40, fontFamily: font.display, fontSize: 44, fontWeight: 800, color: A.white, letterSpacing: -1 }}>Sandrine Cruchon</div>
      <div style={{ marginTop: 10, fontFamily: font.sans, fontSize: 22, fontWeight: 500, letterSpacing: 3, textTransform: 'uppercase', color: A.grey }}>Gérante associée · KOBO Menuiserie</div>
    </div>
    <div style={{ position: 'absolute', right: 120, bottom: 70, fontFamily: font.sans, fontSize: 20, letterSpacing: 4, textTransform: 'uppercase', color: A.faint }}>Tournefeuille · Toulouse</div>
  </Slide>
);

// ---------- 2. Ce que je fais ----------
const cats = [
  ['Fenêtres & baies', 'PVC · Alu · Bois'],
  ['Portes & portails', 'entrée, garage, motorisés'],
  ['Volets & stores', 'roulants, battants, BSO'],
  ['Pergolas & carports', 'bioclimatiques'],
  ['Garde-corps & clôtures', 'aluminium'],
];
const S2: React.FC = () => (
  <Slide>
    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 720 }}>
      <Cover file="kobo_showroom.png" />
      <AbsoluteFill style={{ background: scrim('90deg', `rgba(${SC},1) 0%`, `rgba(${SC},0.25) 40%`, 'transparent 100%') }} />
    </div>
    <CornerTicks />
    <div style={{ position: 'absolute', left: 120, top: 130, width: 1040 }}>
      <Kicker>KOBO en 10 secondes</Kicker>
      <div style={{ fontFamily: font.display, fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, color: A.white }}>
        Tout ce qui ouvre<br />et ferme votre maison.
      </div>
      <div style={{ marginTop: 30, fontFamily: font.sans, fontSize: 26, color: A.grey, lineHeight: 1.5, maxWidth: 880 }}>
        Je fournis <b style={{ color: A.white }}>et</b> je pose, en neuf comme en rénovation — du conseil à l’installation.
      </div>
      <div style={{ marginTop: 46 }}>
        {cats.map(([t, s], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 22, padding: '18px 0', borderTop: `1px solid ${A.line}` }}>
            <div style={{ width: 9, height: 9, background: A.white, flexShrink: 0, transform: 'translateY(-3px)' }} />
            <div style={{ fontFamily: font.sans, fontSize: 30, fontWeight: 700, color: A.white, width: 470 }}>{t}</div>
            <div style={{ fontFamily: font.sans, fontSize: 22, color: A.faint, letterSpacing: 1 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  </Slide>
);

// ---------- 3. Confiance ----------
const trust: [string, string][] = [
  ['Ingénieure des façades', 'BTS Enveloppe du Bâtiment + DNTS spécialiste façades & aluminium.'],
  ['+ de 50 ans cumulés', 'd’expérience avec mon associé Jean-François Mores.'],
  ['Certifiée RGE & Qualibat', 'vos clients ont droit aux aides de l’État pour l’énergie.'],
  ['4.9/5 · 100+ chantiers/an', 'sous notre supervision exclusive en Occitanie.'],
];
const S3: React.FC = () => (
  <Slide>
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 760 }}>
      <Cover file="kobo_portrait_sandrine.png" pos="center" />
      <AbsoluteFill style={{ background: scrim('270deg', `rgba(${SC},1) 0%`, `rgba(${SC},0.18) 45%`, 'transparent 100%') }} />
      <AbsoluteFill style={{ background: scrim('0deg', `rgba(${SC},0.6) 0%`, 'transparent 40%') }} />
    </div>
    <CornerTicks />
    <div style={{ position: 'absolute', left: 840, top: 150, width: 940 }}>
      <Kicker>À qui vous avez affaire</Kicker>
      <div style={{ fontFamily: font.display, fontSize: 62, fontWeight: 800, lineHeight: 1.04, letterSpacing: -1.5, color: A.white }}>Une experte de l’enveloppe du bâtiment.</div>
      <div style={{ marginTop: 44 }}>
        {trust.map(([a, b], i) => (
          <div key={i} style={{ display: 'flex', gap: 22, padding: '20px 0', borderTop: `1px solid ${A.line}` }}>
            <div style={{ fontFamily: font.display, fontSize: 26, fontWeight: 800, color: A.white, lineHeight: 1 }}>✓</div>
            <div>
              <div style={{ fontFamily: font.sans, fontSize: 28, fontWeight: 700, color: A.white }}>{a}</div>
              <div style={{ fontFamily: font.sans, fontSize: 22, color: A.grey, marginTop: 4 }}>{b}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Slide>
);

// ---------- 4. Client idéal ----------
const targets: [string, string, string][] = [
  ['01', 'Particuliers', 'Propriétaires qui rénovent ou font construire leur maison (Toulouse Ouest).'],
  ['02', 'Prescripteurs', 'Architectes, maîtres d’œuvre, constructeurs de maisons individuelles.'],
  ['03', 'Immobilier', 'Agences, syndics de copropriété, gestionnaires de biens.'],
  ['04', 'Tertiaire & public', 'Mairies, collectivités, entreprises — façades, secteur ABF.'],
];
const S4: React.FC = () => (
  <Slide>
    <CornerTicks />
    <div style={{ position: 'absolute', left: 120, top: 120 }}>
      <Kicker>Mon client idéal</Kicker>
      <div style={{ fontFamily: font.display, fontSize: 68, fontWeight: 800, letterSpacing: -1.5, color: A.white }}>À qui penser pour me recommander.</div>
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 400, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 90px' }}>
      {targets.map(([n, t, b], i) => (
        <div key={i} style={{ display: 'flex', gap: 30, padding: '38px 0', borderTop: `1px solid ${A.line}` }}>
          <GhostNum n={n} style={{ fontSize: 90 }} />
          <div>
            <div style={{ fontFamily: font.sans, fontSize: 34, fontWeight: 700, color: A.white, marginBottom: 12 }}>{t}</div>
            <div style={{ fontFamily: font.sans, fontSize: 23, color: A.grey, lineHeight: 1.45, maxWidth: 620 }}>{b}</div>
          </div>
        </div>
      ))}
    </div>
  </Slide>
);

// ---------- 5. Phrases déclic ----------
const phrases = [
  'Mes fenêtres sont vieilles, j’ai froid et de la condensation.',
  'J’aimerais une pergola ou un carport pour cet été.',
  'Mon portail ou mon volet roulant est en panne.',
  'Je rénove ma maison, je fais construire.',
  'Je veux profiter des aides RGE pour mieux isoler.',
  'Notre copropriété ou notre mairie a un projet de façade.',
];
const S5: React.FC = () => (
  <Slide>
    <CornerTicks />
    <div style={{ position: 'absolute', left: 120, top: 110 }}>
      <Kicker>Le réflexe recommandation</Kicker>
      <div style={{ fontFamily: font.display, fontSize: 66, fontWeight: 800, letterSpacing: -1.5, color: A.white }}>Si vous entendez ça, pensez à moi.</div>
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 380, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 80px' }}>
      {phrases.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 22, padding: '30px 0', borderTop: `1px solid ${A.line}` }}>
          <div style={{ fontFamily: font.display, fontSize: 70, fontWeight: 800, color: 'rgba(255,255,255,0.5)', lineHeight: 0.7 }}>“</div>
          <div style={{ fontFamily: font.sans, fontStyle: 'italic', fontSize: 27, lineHeight: 1.4, color: A.soft }}>{p}</div>
        </div>
      ))}
    </div>
  </Slide>
);

// ---------- 6. De-risk ----------
const derisk: [string, string, string][] = [
  ['01', 'Fabrication interne', 'Sur-mesure fabriqué en interne : délais maîtrisés, qualité constante.'],
  ['02', 'Suivi 100 % dirigeant', 'Sandrine ou Jean-François contrôlent chaque chantier, sans intermédiaire.'],
  ['03', 'Partenaires d’élite', 'Fenêtréa, Schüco, Méo, Maison Cadiou, Ates — et un showroom à Tournefeuille.'],
];
const PartnerStrip: React.FC = () => {
  const ps = ['kobo_fenetrea.png', 'kobo_schuco.png', 'kobo_meo.png', 'kobo_cadiou.png', 'kobo_ates.png', 'kobo_qualibat.png'];
  return (
    <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
      {ps.map((p) => (
        <div key={p} style={{ width: 200, height: 96, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
          <Img src={staticFile(p)} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
      ))}
    </div>
  );
};
const S6: React.FC = () => (
  <Slide>
    <CornerTicks />
    <div style={{ position: 'absolute', left: 120, top: 110 }}>
      <Kicker>Zéro risque pour vous</Kicker>
      <div style={{ fontFamily: font.display, fontSize: 68, fontWeight: 800, letterSpacing: -1.5, color: A.white }}>Recommandez-moi en confiance.</div>
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 360, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 60 }}>
      {derisk.map(([n, t, b], i) => (
        <div key={i}>
          <GhostNum n={n} style={{ fontSize: 110, marginBottom: 8 }} />
          <div style={{ height: 2, width: 60, background: A.white, margin: '14px 0 22px' }} />
          <div style={{ fontFamily: font.sans, fontSize: 32, fontWeight: 700, color: A.white, marginBottom: 14 }}>{t}</div>
          <div style={{ fontFamily: font.sans, fontSize: 23, color: A.grey, lineHeight: 1.45 }}>{b}</div>
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 120, bottom: 90 }}>
      <PartnerStrip />
    </div>
  </Slide>
);

// ---------- 7. Preuves ----------
const ProofHalf: React.FC<{ file: string; tag: string; title: string; body: string; pos?: string }> = ({ file, tag, title, body, pos }) => (
  <div style={{ position: 'relative', flex: 1, height: '100%', overflow: 'hidden' }}>
    <Cover file={file} pos={pos} />
    <AbsoluteFill style={{ background: scrim('0deg', `rgba(${SC},0.97) 0%`, `rgba(${SC},0.25) 45%`, 'transparent 100%') }} />
    <div style={{ position: 'absolute', left: 70, right: 70, bottom: 80 }}>
      <div style={{ fontFamily: font.sans, fontSize: 20, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: A.grey, marginBottom: 16 }}>{tag}</div>
      <div style={{ fontFamily: font.display, fontSize: 44, fontWeight: 800, color: A.white, letterSpacing: -1, marginBottom: 14 }}>{title}</div>
      <div style={{ fontFamily: font.sans, fontSize: 23, color: A.grey, lineHeight: 1.45 }}>{body}</div>
    </div>
  </div>
);
const S7: React.FC = () => (
  <Slide>
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <ProofHalf file="kobo_villa_balma.jpg" tag="Particulier · Balma" title="Villa rénovée" body="Mix alu Fenêtréa + PVC, persiennes d’origine restaurées. Née d’une recommandation client." pos="center 55%" />
      <div style={{ width: 3, background: A.white, height: '100%', opacity: 0.85 }} />
      <ProofHalf file="kobo_mairie_rabastens.jpg" tag="Tertiaire · ABF" title="Mairie de Rabastens" body="Façade aluminium Schüco cintrée en secteur classé. Remportée sur appel d’offres." />
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '14px 34px', background: `rgba(${SC},0.72)`, borderRadius: 100, border: `1px solid ${A.line}` }}>
        <div style={{ width: 40, height: 2, background: A.white }} />
        <span style={{ fontFamily: font.sans, fontSize: 22, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', color: A.white }}>Ils nous ont fait confiance</span>
        <div style={{ width: 40, height: 2, background: A.white }} />
      </div>
    </div>
  </Slide>
);

// ---------- 8. Demande de la semaine ----------
const S8: React.FC = () => (
  <Slide>
    <Cover file="kobo_icade.png" />
    <AbsoluteFill style={{ background: `rgba(${SC},0.93)` }} />
    <CornerTicks />
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 160px' }}>
      <Kicker>Le plus important</Kicker>
      <div style={{ fontFamily: font.display, fontSize: 84, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.02, color: A.white }}>
        Présentez-moi à une seule personne<br />qui change ses fenêtres, rénove<br />sa maison ou veut une pergola.
      </div>
      <div style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 22, padding: '26px 36px', border: `1px solid ${A.line}`, borderRadius: 16, background: 'rgba(255,255,255,0.05)', maxWidth: 1300 }}>
        <div style={{ width: 12, height: 12, borderRadius: 12, background: A.white, flexShrink: 0 }} />
        <span style={{ fontFamily: font.sans, fontSize: 27, color: A.white }}>
          <b>Cette semaine&nbsp;:</b>&nbsp; un architecte ou un constructeur de maisons individuelles de l’agglo toulousaine.
        </span>
      </div>
    </AbsoluteFill>
  </Slide>
);

// ---------- 9. Comment recommander ----------
const steps: [string, string, string][] = [
  ['01', 'Donnez mon nom', 'Transmettez mon nom et mon numéro à la personne concernée.'],
  ['02', 'Ou ma carte', 'Remettez-lui ma carte, ou invitez-la au showroom de Tournefeuille.'],
  ['03', 'Le mieux : en direct', 'Mettez-nous directement en relation — c’est le plus efficace.'],
];
const S9: React.FC = () => (
  <Slide>
    <CornerTicks />
    <div style={{ position: 'absolute', left: 120, top: 120 }}>
      <Kicker>Passez-moi le relais</Kicker>
      <div style={{ fontFamily: font.display, fontSize: 68, fontWeight: 800, letterSpacing: -1.5, color: A.white }}>Comment me recommander.</div>
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 400, display: 'flex', gap: 50 }}>
      {steps.map(([n, t, b], i) => (
        <div key={i} style={{ flex: 1, paddingTop: 30, borderTop: `2px solid ${A.white}` }}>
          <GhostNum n={n} style={{ fontSize: 120 }} />
          <div style={{ fontFamily: font.sans, fontSize: 34, fontWeight: 700, color: A.white, margin: '18px 0 16px' }}>{t}</div>
          <div style={{ fontFamily: font.sans, fontSize: 24, color: A.grey, lineHeight: 1.5 }}>{b}</div>
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, bottom: 90, display: 'flex', alignItems: 'center', gap: 20, padding: '24px 34px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: `1px solid ${A.line}` }}>
      <span style={{ fontFamily: font.sans, fontSize: 20, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: A.white }}>Donnant-donnant</span>
      <span style={{ fontFamily: font.sans, fontSize: 25, color: A.soft }}>Une bonne recommandation = un projet bien fait et un client qui VOUS remerciera.</span>
    </div>
  </Slide>
);

// ---------- 10. Merci ----------
const S10: React.FC = () => (
  <Slide>
    <Cover file="kobo_mairie_rabastens.jpg" pos="center 40%" />
    <AbsoluteFill style={{ background: `rgba(${SC},0.92)` }} />
    <CornerTicks />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Logo w={460} />
      <div style={{ marginTop: 46, fontFamily: font.display, fontSize: 64, fontWeight: 800, letterSpacing: -1.5, color: A.white }}>Merci — et pensez à KOBO&nbsp;!</div>
      <div style={{ marginTop: 14, fontFamily: font.sans, fontStyle: 'italic', fontSize: 28, color: A.grey }}>Créateur d’ouvertures</div>
      <div style={{ marginTop: 40, height: 2, width: 320, background: A.white }} />
      <div style={{ marginTop: 36, fontFamily: font.sans, fontSize: 24, letterSpacing: 1, color: A.soft }}>contact@kobo-alu.fr&nbsp;&nbsp;·&nbsp;&nbsp;05 61 85 51 40&nbsp;&nbsp;·&nbsp;&nbsp;www.kobo-alu.fr</div>
      <div style={{ marginTop: 12, fontFamily: font.sans, fontSize: 19, color: A.faint }}>164 Chemin de Larramet, 31170 Tournefeuille</div>
    </AbsoluteFill>
  </Slide>
);

export const DECK_SLIDES: React.FC[] = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
export const SLIDE_HOLD = 30;

export const KoboDeck: React.FC = () => (
  <AbsoluteFill style={{ background: A.inkDeep }}>
    {DECK_SLIDES.map((S, i) => (
      <Sequence key={i} from={i * SLIDE_HOLD} durationInFrames={SLIDE_HOLD}>
        <S />
      </Sequence>
    ))}
  </AbsoluteFill>
);
