import React from 'react';
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { kobo, font } from '../theme';

// =====================================================================
// KOBO — "Deck éditorial" : slides plein cadre, pensées pour être
// rendues en images haute résolution puis intégrées au PowerPoint.
// Direction : photo immersive + scrim cinéma + typographie XXL + cuivre.
// =====================================================================

const W = 1920;
const H = 1080;
const INK = '#080F1E';

// ---- primitives ----
const Cover: React.FC<{ file: string; pos?: string }> = ({ file, pos = 'center' }) => (
  <Img src={staticFile(file)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos }} />
);

const CornerTicks: React.FC<{ light?: boolean }> = ({ light }) => {
  const c = kobo.copperGlow;
  const m = 64;
  const L = 56;
  const t = 3;
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

const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = kobo.copperGlow }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 26 }}>
    <div style={{ width: 54, height: 3, background: color }} />
    <span style={{ fontFamily: font.sans, fontSize: 24, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', color }}>
      {children}
    </span>
  </div>
);

const GhostNum: React.FC<{ n: string; style?: React.CSSProperties }> = ({ n, style }) => (
  <div
    style={{
      fontFamily: font.display,
      fontWeight: 800,
      color: 'rgba(202,138,4,0.16)',
      lineHeight: 0.8,
      letterSpacing: -4,
      ...style,
    }}
  >
    {n}
  </div>
);

const Logo: React.FC<{ w: number }> = ({ w }) => (
  <Img src={staticFile('kobo_logo_light_full.png')} style={{ width: w, height: 'auto' }} />
);

const Slide: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = INK }) => (
  <AbsoluteFill style={{ width: W, height: H, background: bg, overflow: 'hidden' }}>{children}</AbsoluteFill>
);

// dégradé scrim réutilisable
const scrim = (dir: string, ...stops: string[]) => `linear-gradient(${dir}, ${stops.join(', ')})`;

// ---------------------------------------------------------------------
// SLIDE 1 — Couverture
// ---------------------------------------------------------------------
const S1: React.FC = () => (
  <Slide>
    <Cover file="kobo_villa_balma.jpg" pos="center 60%" />
    <AbsoluteFill style={{ background: scrim('100deg', 'rgba(8,15,30,0.96) 0%', 'rgba(8,15,30,0.82) 38%', 'rgba(8,15,30,0.25) 100%')}} />
    <AbsoluteFill style={{ background: scrim('0deg', 'rgba(8,15,30,0.85) 0%', 'transparent 45%') }} />
    <CornerTicks />
    <div style={{ position: 'absolute', left: 120, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 1100 }}>
      <div style={{ fontFamily: font.sans, fontSize: 24, fontWeight: 700, letterSpacing: 7, textTransform: 'uppercase', color: kobo.copperGlow, marginBottom: 40 }}>
        Menuiseries &amp; aménagements extérieurs
      </div>
      <Logo w={640} />
      <div style={{ marginTop: 44, height: 3, width: 320, background: kobo.copperBright }} />
      <div style={{ marginTop: 40, fontFamily: font.display, fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>
        Sandrine Cruchon
      </div>
      <div style={{ marginTop: 10, fontFamily: font.sans, fontSize: 22, fontWeight: 500, letterSpacing: 3, textTransform: 'uppercase', color: kobo.slateLine }}>
        Gérante associée · KOBO Menuiserie
      </div>
    </div>
    <div style={{ position: 'absolute', right: 120, bottom: 70, fontFamily: font.sans, fontSize: 20, letterSpacing: 4, textTransform: 'uppercase', color: kobo.slateFaint }}>
      Tournefeuille · Toulouse
    </div>
  </Slide>
);

// ---------------------------------------------------------------------
// SLIDE 2 — Ce que je fais, simplement
// ---------------------------------------------------------------------
const cats = [
  ['Fenêtres & baies', 'PVC · Alu · Bois'],
  ['Portes & portails', 'entrée, garage, motorisés'],
  ['Volets & stores', 'roulants, battants, BSO'],
  ['Pergolas & carports', 'bioclimatiques'],
  ['Garde-corps & clôtures', 'aluminium'],
];
const S2: React.FC = () => (
  <Slide>
    {/* panneau image droite */}
    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 720 }}>
      <Cover file="kobo_showroom.png" />
      <AbsoluteFill style={{ background: scrim('90deg', 'rgba(8,15,30,1) 0%', 'rgba(8,15,30,0.2) 40%', 'transparent 100%') }} />
    </div>
    <CornerTicks />
    <div style={{ position: 'absolute', left: 120, top: 130, width: 1040 }}>
      <Kicker>KOBO en 10 secondes</Kicker>
      <div style={{ fontFamily: font.display, fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, color: '#fff' }}>
        Tout ce qui <span style={{ color: kobo.copperGlow }}>ouvre</span><br />et <span style={{ color: kobo.copperGlow }}>ferme</span> votre maison.
      </div>
      <div style={{ marginTop: 30, fontFamily: font.sans, fontSize: 26, color: kobo.slateLine, lineHeight: 1.5, maxWidth: 880 }}>
        Je fournis <b style={{ color: '#fff' }}>et</b> je pose, en neuf comme en rénovation — du conseil à l’installation.
      </div>
      <div style={{ marginTop: 46 }}>
        {cats.map(([t, s], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 22, padding: '18px 0', borderTop: `1px solid ${kobo.hairlineDark}` }}>
            <div style={{ width: 10, height: 10, background: kobo.copperBright, flexShrink: 0, transform: 'translateY(-3px)' }} />
            <div style={{ fontFamily: font.sans, fontSize: 30, fontWeight: 700, color: '#fff', width: 470 }}>{t}</div>
            <div style={{ fontFamily: font.sans, fontSize: 22, color: kobo.slateFaint, letterSpacing: 1 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  </Slide>
);

// ---------------------------------------------------------------------
// SLIDE 3 — À qui vous avez affaire
// ---------------------------------------------------------------------
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
      <AbsoluteFill style={{ background: scrim('270deg', 'rgba(8,15,30,1) 0%', 'rgba(8,15,30,0.15) 45%', 'transparent 100%') }} />
      <AbsoluteFill style={{ background: scrim('0deg', 'rgba(8,15,30,0.6) 0%', 'transparent 40%') }} />
    </div>
    <CornerTicks />
    <div style={{ position: 'absolute', left: 840, top: 150, width: 940 }}>
      <Kicker>À qui vous avez affaire</Kicker>
      <div style={{ fontFamily: font.display, fontSize: 62, fontWeight: 800, lineHeight: 1.04, letterSpacing: -1.5, color: '#fff' }}>
        Une experte de l’enveloppe du bâtiment.
      </div>
      <div style={{ marginTop: 44 }}>
        {trust.map(([a, b], i) => (
          <div key={i} style={{ display: 'flex', gap: 22, padding: '20px 0', borderTop: `1px solid ${kobo.hairlineDark}` }}>
            <div style={{ fontFamily: font.display, fontSize: 26, fontWeight: 800, color: kobo.copperGlow, lineHeight: 1 }}>✓</div>
            <div>
              <div style={{ fontFamily: font.sans, fontSize: 28, fontWeight: 700, color: '#fff' }}>{a}</div>
              <div style={{ fontFamily: font.sans, fontSize: 22, color: kobo.slateLine, marginTop: 4 }}>{b}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Slide>
);

// ---------------------------------------------------------------------
// SLIDE 4 — Mon client idéal
// ---------------------------------------------------------------------
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
      <div style={{ fontFamily: font.display, fontSize: 68, fontWeight: 800, letterSpacing: -1.5, color: '#fff' }}>
        À qui penser pour me recommander.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 400, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 90px' }}>
      {targets.map(([n, t, b], i) => (
        <div key={i} style={{ display: 'flex', gap: 30, padding: '38px 0', borderTop: `1px solid ${kobo.hairlineDark}` }}>
          <GhostNum n={n} style={{ fontSize: 90 }} />
          <div>
            <div style={{ fontFamily: font.sans, fontSize: 34, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{t}</div>
            <div style={{ fontFamily: font.sans, fontSize: 23, color: kobo.slateLine, lineHeight: 1.45, maxWidth: 620 }}>{b}</div>
          </div>
        </div>
      ))}
    </div>
  </Slide>
);

// ---------------------------------------------------------------------
// SLIDE 5 — Si vous entendez ça, pensez à moi
// ---------------------------------------------------------------------
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
      <div style={{ fontFamily: font.display, fontSize: 66, fontWeight: 800, letterSpacing: -1.5, color: '#fff' }}>
        Si vous entendez ça, <span style={{ color: kobo.copperGlow }}>pensez à moi.</span>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 380, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 80px' }}>
      {phrases.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 22, padding: '30px 0', borderTop: `1px solid ${kobo.hairlineDark}` }}>
          <div style={{ fontFamily: font.display, fontSize: 70, fontWeight: 800, color: kobo.copper, lineHeight: 0.7, opacity: 0.9 }}>“</div>
          <div style={{ fontFamily: font.sans, fontStyle: 'italic', fontSize: 27, lineHeight: 1.4, color: '#fff' }}>{p}</div>
        </div>
      ))}
    </div>
  </Slide>
);

// ---------------------------------------------------------------------
// SLIDE 6 — Recommandez-moi en confiance
// ---------------------------------------------------------------------
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
      <div style={{ fontFamily: font.display, fontSize: 68, fontWeight: 800, letterSpacing: -1.5, color: '#fff' }}>
        Recommandez-moi en confiance.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 360, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 60 }}>
      {derisk.map(([n, t, b], i) => (
        <div key={i}>
          <GhostNum n={n} style={{ fontSize: 110, marginBottom: 8 }} />
          <div style={{ height: 3, width: 60, background: kobo.copperBright, margin: '14px 0 22px' }} />
          <div style={{ fontFamily: font.sans, fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 14 }}>{t}</div>
          <div style={{ fontFamily: font.sans, fontSize: 23, color: kobo.slateLine, lineHeight: 1.45 }}>{b}</div>
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 120, bottom: 90 }}>
      <PartnerStrip />
    </div>
  </Slide>
);

// ---------------------------------------------------------------------
// SLIDE 7 — Ils nous ont fait confiance (preuves)
// ---------------------------------------------------------------------
const ProofHalf: React.FC<{ file: string; tag: string; title: string; body: string; pos?: string }> = ({ file, tag, title, body, pos }) => (
  <div style={{ position: 'relative', flex: 1, height: '100%', overflow: 'hidden' }}>
    <Cover file={file} pos={pos} />
    <AbsoluteFill style={{ background: scrim('0deg', 'rgba(8,15,30,0.96) 0%', 'rgba(8,15,30,0.2) 45%', 'transparent 100%') }} />
    <div style={{ position: 'absolute', left: 70, right: 70, bottom: 80 }}>
      <div style={{ fontFamily: font.sans, fontSize: 20, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: kobo.copperGlow, marginBottom: 16 }}>{tag}</div>
      <div style={{ fontFamily: font.display, fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: -1, marginBottom: 14 }}>{title}</div>
      <div style={{ fontFamily: font.sans, fontSize: 23, color: kobo.slateLine, lineHeight: 1.45 }}>{body}</div>
    </div>
  </div>
);
const S7: React.FC = () => (
  <Slide>
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <ProofHalf file="kobo_villa_balma.jpg" tag="Particulier · Balma" title="Villa rénovée" body="Mix alu Fenêtréa + PVC, persiennes d’origine restaurées. Née d’une recommandation client." pos="center 55%" />
      <div style={{ width: 4, background: kobo.copperBright, height: '100%' }} />
      <ProofHalf file="kobo_mairie_rabastens.jpg" tag="Tertiaire · ABF" title="Mairie de Rabastens" body="Façade aluminium Schüco cintrée en secteur classé. Remportée sur appel d’offres." />
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '14px 34px', background: 'rgba(8,15,30,0.7)', borderRadius: 100 }}>
        <div style={{ width: 40, height: 2, background: kobo.copperGlow }} />
        <span style={{ fontFamily: font.sans, fontSize: 22, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', color: '#fff' }}>Ils nous ont fait confiance</span>
        <div style={{ width: 40, height: 2, background: kobo.copperGlow }} />
      </div>
    </div>
  </Slide>
);

// ---------------------------------------------------------------------
// SLIDE 8 — Ma demande cette semaine
// ---------------------------------------------------------------------
const S8: React.FC = () => (
  <Slide>
    <Cover file="kobo_icade.png" />
    <AbsoluteFill style={{ background: 'rgba(8,15,30,0.92)' }} />
    <AbsoluteFill style={{ background: scrim('120deg', 'rgba(202,138,4,0.16) 0%', 'transparent 55%') }} />
    <CornerTicks />
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 160px' }}>
      <Kicker>Le plus important</Kicker>
      <div style={{ fontFamily: font.display, fontSize: 84, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.02, color: '#fff' }}>
        Présentez-moi à <span style={{ color: kobo.copperGlow }}>une seule personne</span><br />
        qui change ses fenêtres, rénove<br />sa maison ou veut une pergola.
      </div>
      <div style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 22, padding: '26px 36px', border: `1px solid ${kobo.copperLine}`, borderRadius: 16, background: 'rgba(202,138,4,0.08)', maxWidth: 1300 }}>
        <div style={{ width: 12, height: 12, borderRadius: 12, background: kobo.copperGlow, flexShrink: 0 }} />
        <span style={{ fontFamily: font.sans, fontSize: 27, color: '#fff' }}>
          <b style={{ color: kobo.copperGlow }}>Cette semaine&nbsp;:</b>&nbsp; un architecte ou un constructeur de maisons individuelles de l’agglo toulousaine.
        </span>
      </div>
    </AbsoluteFill>
  </Slide>
);

// ---------------------------------------------------------------------
// SLIDE 9 — Comment me recommander
// ---------------------------------------------------------------------
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
      <div style={{ fontFamily: font.display, fontSize: 68, fontWeight: 800, letterSpacing: -1.5, color: '#fff' }}>
        Comment me recommander.
      </div>
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 400, display: 'flex', gap: 50 }}>
      {steps.map(([n, t, b], i) => (
        <div key={i} style={{ flex: 1, paddingTop: 30, borderTop: `2px solid ${kobo.copperBright}` }}>
          <GhostNum n={n} style={{ fontSize: 120, color: 'rgba(202,138,4,0.20)' }} />
          <div style={{ fontFamily: font.sans, fontSize: 34, fontWeight: 700, color: '#fff', margin: '18px 0 16px' }}>{t}</div>
          <div style={{ fontFamily: font.sans, fontSize: 24, color: kobo.slateLine, lineHeight: 1.5 }}>{b}</div>
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, bottom: 90, display: 'flex', alignItems: 'center', gap: 20, padding: '24px 34px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: `1px solid ${kobo.hairlineDark}` }}>
      <span style={{ fontFamily: font.sans, fontSize: 20, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: kobo.copperGlow }}>Donnant-donnant</span>
      <span style={{ fontFamily: font.sans, fontSize: 25, color: '#fff' }}>Une bonne recommandation = un projet bien fait et un client qui VOUS remerciera.</span>
    </div>
  </Slide>
);

// ---------------------------------------------------------------------
// SLIDE 10 — Merci
// ---------------------------------------------------------------------
const S10: React.FC = () => (
  <Slide>
    <Cover file="kobo_mairie_rabastens.jpg" pos="center 40%" />
    <AbsoluteFill style={{ background: 'rgba(8,15,30,0.9)' }} />
    <AbsoluteFill style={{ background: scrim('0deg', 'rgba(8,15,30,0.7) 0%', 'transparent 60%') }} />
    <CornerTicks />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Logo w={460} />
      <div style={{ marginTop: 46, fontFamily: font.display, fontSize: 64, fontWeight: 800, letterSpacing: -1.5, color: '#fff' }}>
        Merci — et pensez à KOBO&nbsp;!
      </div>
      <div style={{ marginTop: 14, fontFamily: font.sans, fontStyle: 'italic', fontSize: 28, color: kobo.copperGlow }}>
        Créateur d’ouvertures
      </div>
      <div style={{ marginTop: 40, height: 2, width: 320, background: kobo.copperBright }} />
      <div style={{ marginTop: 36, fontFamily: font.sans, fontSize: 24, letterSpacing: 1, color: kobo.slateLine }}>
        contact@kobo-alu.fr&nbsp;&nbsp;·&nbsp;&nbsp;05 61 85 51 40&nbsp;&nbsp;·&nbsp;&nbsp;www.kobo-alu.fr
      </div>
      <div style={{ marginTop: 12, fontFamily: font.sans, fontSize: 19, color: kobo.slateFaint }}>
        164 Chemin de Larramet, 31170 Tournefeuille
      </div>
    </AbsoluteFill>
  </Slide>
);

export const DECK_SLIDES: React.FC[] = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
export const SLIDE_HOLD = 30; // frames par slide (pour l'export d'images)

export const KoboDeck: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: INK }}>
      {DECK_SLIDES.map((S, i) => (
        <Sequence key={i} from={i * SLIDE_HOLD} durationInFrames={SLIDE_HOLD}>
          <S />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
