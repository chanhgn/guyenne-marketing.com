import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { istd, istdFonts } from './theme';

/**
 * Quatre posts Instagram au format 4:5 (1080 x 1350) pour le lancement du
 * compte @istd.fes.
 *
 * Ce sont des images fixes, pas des plans de la vidéo : elles reprennent la
 * meme charte (memes hex, memes polices, vrai logo) pour que le fil du compte
 * et les publicites se repondent. Les fonds alternent noir / bleu / beige /
 * noir, ce qui donne une grille lisible en vue 3 colonnes.
 */

export const POST = { WIDTH: 1080, HEIGHT: 1350 } as const;

const PAD = 92;

/** Cadre commun : fond plein, marges egales, logo en pied. */
const Frame: React.FC<{
  background: string;
  children: React.ReactNode;
  /** Couleur du bloc de pied (logo + site). */
  foot?: string;
  /** Le logo officiel est sur fond clair : sur fond sombre on l'inverse. */
  invertLogo?: boolean;
}> = ({ background, children, foot = istd.body, invertLogo = false }) => (
  <AbsoluteFill
    style={{
      background,
      fontFamily: istdFonts.display,
      padding: PAD,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
      {children}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Img
        src={staticFile('istd/logo-istd.png')}
        style={{ height: 74, filter: invertLogo ? 'brightness(0) invert(1)' : 'none' }}
      />
      <span
        style={{
          fontFamily: istdFonts.body,
          fontSize: 27,
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: foot,
        }}
      >
        istd.ma
      </span>
    </div>
  </AbsoluteFill>
);

const Kick: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = istd.orange,
}) => (
  <span
    style={{
      fontFamily: istdFonts.body,
      fontSize: 26,
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color,
      marginBottom: 30,
    }}
  >
    {children}
  </span>
);

/* ── 1 · Carte d'identite ──────────────────────────────────────────────── */

export const Post1: React.FC = () => (
  <AbsoluteFill
    style={{
      background: istd.bgDark,
      fontFamily: istdFonts.display,
      padding: PAD,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}
  >
    <Img
      src={staticFile('istd/logo-istd.png')}
      style={{ width: 470, filter: 'brightness(0) invert(1)', marginBottom: 58 }}
    />
    <div style={{ width: 132, height: 5, background: istd.orange, marginBottom: 48 }} />
    <span
      style={{
        fontSize: 44,
        fontWeight: 600,
        lineHeight: 1.32,
        color: istd.white,
        maxWidth: 780,
        letterSpacing: '-0.01em',
      }}
    >
      Institut Spécialisé en
      <br />
      Technologies d’Art Dentaire
    </span>
    <span
      style={{
        fontFamily: istdFonts.body,
        fontSize: 31,
        fontWeight: 400,
        color: istd.warm1,
        marginTop: 34,
        lineHeight: 1.5,
      }}
    >
      Fès · depuis 2006
      <br />
      plus de 500 diplômés
    </span>
  </AbsoluteFill>
);

/* ── 2 · Le metier ─────────────────────────────────────────────────────── */

export const Post2: React.FC = () => (
  <Frame background={istd.blue} foot={istd.warm1} invertLogo>
    <Kick color={istd.warm1}>Le métier</Kick>
    <span
      style={{
        fontSize: 106,
        fontWeight: 700,
        lineHeight: 1.02,
        letterSpacing: '-0.035em',
        color: istd.white,
      }}
    >
      Prothésiste
      <br />
      dentaire
    </span>
    <div style={{ width: 168, height: 6, background: istd.orange, margin: '42px 0 38px' }} />
    <span
      style={{
        fontFamily: istdFonts.body,
        fontSize: 37,
        fontWeight: 400,
        lineHeight: 1.52,
        color: istd.white,
        maxWidth: 800,
      }}
    >
      Il fabrique les couronnes, les bridges et les prothèses que le dentiste
      pose. Un métier d’atelier et de précision,{' '}
      <b style={{ fontWeight: 600, color: istd.warm1 }}>
        dans la santé, sans faire médecine.
      </b>
    </span>
  </Frame>
);

/* ── 3 · Le debouche ───────────────────────────────────────────────────── */

export const Post3: React.FC = () => (
  <Frame background={istd.bgLight} foot={istd.body}>
    <Kick>Ce que ça donne après</Kick>
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <span
        style={{
          fontSize: 236,
          fontWeight: 700,
          lineHeight: 0.86,
          letterSpacing: '-0.05em',
          color: istd.orange,
        }}
      >
        90
      </span>
      <span
        style={{
          fontSize: 104,
          fontWeight: 700,
          color: istd.orange,
          letterSpacing: '-0.03em',
          marginLeft: 6,
        }}
      >
        %
      </span>
    </div>
    <span
      style={{
        fontFamily: istdFonts.body,
        fontSize: 40,
        fontWeight: 600,
        lineHeight: 1.42,
        color: istd.heading,
        maxWidth: 760,
        marginTop: 26,
      }}
    >
      de nos diplômés trouvent un emploi dans l’année qui suit le diplôme
    </span>
    <div style={{ height: 1, background: istd.line, margin: '52px 0 40px', width: '100%' }} />
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
      <span
        style={{
          fontSize: 78,
          fontWeight: 700,
          color: istd.heading,
          letterSpacing: '-0.03em',
        }}
      >
        1 200
      </span>
      <span
        style={{
          fontFamily: istdFonts.body,
          fontSize: 33,
          fontWeight: 400,
          color: istd.body,
          lineHeight: 1.35,
        }}
      >
        entreprises recrutent
        <br />
        des prothésistes au Maroc
      </span>
    </div>
  </Frame>
);

/* ── 4 · L'international ───────────────────────────────────────────────── */

const ROWS = [
  { flag: '🇧🇪', country: 'Belgique', mad: '32 000' },
  { flag: '🇫🇷', country: 'France', mad: '27 000' },
  { flag: '🇩🇪', country: 'Allemagne', mad: '26 000' },
  { flag: '🇨🇦', country: 'Canada', mad: '25 000' },
];

export const Post4: React.FC = () => (
  <Frame background={istd.bgDark} foot={istd.warm2} invertLogo>
    <Kick>Métier en tension</Kick>
    <span
      style={{
        fontSize: 82,
        fontWeight: 700,
        lineHeight: 1.06,
        letterSpacing: '-0.03em',
        color: istd.white,
      }}
    >
      Un diplôme
      <br />
      qui s’exporte
    </span>
    <span
      style={{
        fontFamily: istdFonts.body,
        fontSize: 28,
        fontWeight: 400,
        color: istd.warm2,
        margin: '34px 0 12px',
      }}
    >
      Salaire moyen du métier, converti en dirhams
    </span>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {ROWS.map((r) => (
        <div
          key={r.country}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 26,
            padding: '22px 0',
            borderBottom: `1px solid #3A3A3A`,
          }}
        >
          <span style={{ fontSize: 46, lineHeight: 1 }}>{r.flag}</span>
          <span style={{ fontSize: 44, fontWeight: 600, color: istd.white, flex: 1 }}>
            {r.country}
          </span>
          <span
            style={{
              fontSize: 46,
              fontWeight: 700,
              color: istd.orange,
              letterSpacing: '-0.02em',
            }}
          >
            {r.mad} DH
          </span>
        </div>
      ))}
    </div>
    <span
      style={{
        fontFamily: istdFonts.body,
        fontSize: 24,
        fontWeight: 400,
        color: istd.warm3,
        opacity: 0.8,
        marginTop: 26,
        lineHeight: 1.45,
      }}
    >
      Moyennes brutes, toutes expériences confondues.
      <br />
      Ces pays manquent de prothésistes et recrutent.
    </span>
  </Frame>
);

export const POSTS = [
  { id: 'Post1Identite', component: Post1 },
  { id: 'Post2Metier', component: Post2 },
  { id: 'Post3Debouche', component: Post3 },
  { id: 'Post4International', component: Post4 },
] as const;
