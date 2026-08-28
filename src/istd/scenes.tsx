import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { istd, istdFonts } from './theme';
import { Kicker, SAFE, Stage, Underline, Words, useRise } from './anim';

/* ------------------------------------------------------------------ *
 * Plan 1 — HOOK · 0:00 → 0:03
 * Darija : « Wach bghiti tkhdem f majal s-se77a, bla ma teqra t-tebb ? »
 * ------------------------------------------------------------------ */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [26, 44], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Stage background={istd.bgDark}>
      <div style={{ position: 'relative' }}>
        {/* Bande bleue pleine largeur, portée sous les lignes blanches */}
        <div
          style={{
            position: 'absolute',
            left: -SAFE.side,
            top: -22,
            height: 296,
            width: `${sweep * 120}%`,
            background: istd.blue,
          }}
        />
        <div style={{ position: 'relative' }}>
          <Words text="Un métier" color={istd.white} delay={0} size={112} />
          <Words text="de la santé." color={istd.white} delay={6} size={112} />
        </div>
        <div style={{ height: 56 }} />
        <Words text="Sans faire" color={istd.orange} delay={30} size={112} />
        <Words text="médecine." color={istd.orange} delay={36} size={112} />
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ *
 * Plan 2 — PROMESSE · 0:03 → 0:07
 * Darija : « Welli tekni motakhassis f tarkib l-esnan. »
 * ------------------------------------------------------------------ */
export const Promise: React.FC = () => {
  const frame = useCurrentFrame();
  const veil = interpolate(frame, [0, 16], [0, -100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Stage background={istd.blue}>
      <div style={{ position: 'absolute', inset: 0, background: istd.bgDark, transform: `translateY(${veil}%)` }} />
      <div style={{ position: 'relative' }}>
        <Kicker delay={14} color={istd.warm1}>
          Formation diplômante
        </Kicker>
        <Words text="Devenez" color={istd.white} delay={18} size={104} />
        <Words text="Technicien Spécialisé" color={istd.white} delay={24} size={104} />
        <Words text="en Prothèse Dentaire" color={istd.white} delay={32} size={104} />
        <Underline delay={48} width={420} color={istd.orange} />
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ *
 * Plan 3 — PREUVE CHOC · 0:07 → 0:11
 * Le chiffre est compté à l'écran : c'est lui qui doit rester en tête.
 * ------------------------------------------------------------------ */
export const BigNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = Math.round(
    interpolate(frame, [6, 34], [0, 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  const pop = spring({ frame, fps, delay: 4, config: { damping: 200, mass: 0.7 } });
  const ring = interpolate(frame, [6, 40], [0, 0.9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Boîte de taille fixe : l'anneau ne peut pas déborder sur le texte du dessous.
  const BOX = 660;
  const R = 292;
  const C = 2 * Math.PI * R;

  return (
    <Stage background={istd.bgLight} align="center">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: BOX, height: BOX, flexShrink: 0 }}>
          <svg width={BOX} height={BOX} style={{ position: 'absolute', inset: 0 }}>
            <circle cx={BOX / 2} cy={BOX / 2} r={R} fill="none" stroke={istd.warm2} strokeWidth={16} opacity={0.55} />
            <circle
              cx={BOX / 2}
              cy={BOX / 2}
              r={R}
              fill="none"
              stroke={istd.orange}
              strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - ring)}
              transform={`rotate(-90 ${BOX / 2} ${BOX / 2})`}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                transform: `scale(${interpolate(pop, [0, 1], [0.82, 1])})`,
                opacity: pop,
              }}
            >
              <span
                style={{
                  fontSize: 276,
                  fontWeight: 700,
                  color: istd.orange,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              >
                {count}
              </span>
              <span style={{ fontSize: 138, fontWeight: 700, color: istd.blue, lineHeight: 1 }}>%</span>
            </div>
          </div>
        </div>

        <div style={{ height: 76 }} />

        <div style={{ textAlign: 'center' }}>
          <Words text="de nos diplômés" color={istd.heading} delay={38} size={70} />
          <Words text="en poste dans l’année" color={istd.heading} delay={44} size={70} />
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ *
 * Plan 4 — PREUVES EMPILÉES · 0:11 → 0:15
 * ------------------------------------------------------------------ */
const PROOFS: Array<[string, string]> = [
  ['Diplôme Bac+3', 'reconnu par l’État'],
  ['3 ans', '2 808 heures de formation'],
  ['68 %', 'de pratique en laboratoire'],
];

const ProofRow: React.FC<{ strong: string; rest: string; delay: number }> = ({ strong, rest, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, delay, config: { damping: 200, mass: 0.6 } });
  const draw = interpolate(frame, [delay + 4, delay + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 34,
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [-60, 0])}px)`,
        marginBottom: 58,
      }}
    >
      <svg width={70} height={70} viewBox="0 0 70 70" style={{ flexShrink: 0 }}>
        <circle cx={35} cy={35} r={33} fill="none" stroke={istd.orange} strokeWidth={4} opacity={0.5} />
        <path
          d="M20 36 L31 47 L51 24"
          fill="none"
          stroke={istd.orange}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={60}
          strokeDashoffset={60 * (1 - draw)}
        />
      </svg>
      <span style={{ fontSize: 62, fontWeight: 600, color: istd.white, lineHeight: 1.15 }}>
        <strong style={{ color: istd.orange, fontWeight: 700 }}>{strong}</strong>
        <br />
        <span style={{ fontSize: 48, fontWeight: 400, color: istd.warm2, fontFamily: istdFonts.body }}>{rest}</span>
      </span>
    </div>
  );
};

export const Proofs: React.FC = () => (
  <Stage background={istd.bgDark}>
    <Kicker delay={0}>Ce que vous obtenez</Kicker>
    <div style={{ height: 30 }} />
    {PROOFS.map(([strong, rest], i) => (
      <ProofRow key={strong} strong={strong} rest={rest} delay={8 + i * 24} />
    ))}
  </Stage>
);

/* ------------------------------------------------------------------ *
 * Plan 5 — AUTORITÉ · 0:15 → 0:18
 * Fond clair imposé : le bleu du logo ne contraste pas sur fond sombre.
 * ------------------------------------------------------------------ */
export const Authority: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });
  const reveal = interpolate(frame, [0, 26], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Stage background={istd.bgLight} align="center">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ clipPath: `inset(0 0 ${reveal}% 0)`, transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})` }}>
          <Img src={staticFile('istd/logo-istd.png')} style={{ width: 680 }} />
        </div>
        <div style={{ height: 64 }} />
        <div style={{ ...useRise(30) }}>
          <span style={{ fontSize: 60, fontWeight: 700, color: istd.heading, letterSpacing: '-0.01em' }}>
            ISTD Fès
          </span>
          <div style={{ height: 18 }} />
          <span
            style={{
              fontFamily: istdFonts.body,
              fontSize: 42,
              fontWeight: 400,
              color: istd.body,
            }}
          >
            Depuis 2006 · plus de 500 diplômés
          </span>
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ *
 * Plan 6 — URGENCE + CTA · 0:18 → 0:22
 * ------------------------------------------------------------------ */
const WHATSAPP_GLYPH =
  'M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 ' +
  '17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l' +
  '-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 ' +
  '54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8' +
  '-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8' +
  '-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9' +
  '-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 ' +
  '32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z';

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btn = spring({ frame, fps, delay: 26, config: { damping: 200, mass: 0.7 } });
  // Pulsation lente du bouton, figée sur la fin pour une dernière frame nette.
  const pulse = frame > 26 && frame < 100 ? 1 + Math.sin((frame - 26) / 7) * 0.014 : 1;
  return (
    <Stage background={istd.orange} align="center">
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Kicker delay={0} color={istd.warm1}>
          Inscriptions 2026 / 2027
        </Kicker>
        <Words text="Rentrée le 7 septembre" color={istd.white} delay={4} size={78} />
        <div style={{ height: 22 }} />
        <div style={{ ...useRise(16) }}>
          <span style={{ fontFamily: istdFonts.body, fontSize: 44, fontWeight: 600, color: istd.warm1 }}>
            Places limitées
          </span>
        </div>

        <div style={{ height: 86 }} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 30,
            background: istd.white,
            borderRadius: 24,
            padding: '38px 62px',
            opacity: btn,
            transform: `scale(${interpolate(btn, [0, 1], [0.86, 1]) * pulse})`,
            boxShadow: '0 26px 60px rgba(0,0,0,0.22)',
          }}
        >
          <svg width={66} height={66} viewBox="0 0 448 512" style={{ flexShrink: 0 }}>
            <path d={WHATSAPP_GLYPH} fill="#25D366" />
          </svg>
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontFamily: istdFonts.body,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: istd.body,
              }}
            >
              Écrivez-nous
            </div>
            <div style={{ fontSize: 54, fontWeight: 700, color: istd.heading, letterSpacing: '-0.01em' }}>
              06 61 25 69 65
            </div>
          </div>
        </div>

        <div style={{ height: 54 }} />
        {/* Le site en appel secondaire : il ne doit pas concurrencer le bouton WhatsApp. */}
        <div style={{ ...useRise(44), textAlign: 'center' }}>
          <div
            style={{
              fontFamily: istdFonts.body,
              fontSize: 30,
              fontWeight: 600,
              color: istd.warm1,
              letterSpacing: '0.06em',
              marginBottom: 10,
            }}
          >
            En savoir plus sur
          </div>
          <span
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: istd.white,
              letterSpacing: '0.04em',
            }}
          >
            istd.ma
          </span>
        </div>
      </div>
    </Stage>
  );
};
