import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { istd } from './theme';
import { DownArrow, Kicker, SAFE, Stage, Underline, Words, useLang, useRise } from './anim';

/* ------------------------------------------------------------------ *
 * Plan 1 — HOOK · 0:00 → 0:03
 * ------------------------------------------------------------------ */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, rtl } = useLang();
  const sweep = interpolate(frame, [26, 44], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Stage background={istd.bgDark}>
      <div style={{ position: 'relative' }}>
        {/* Bande bleue pleine largeur, portée sous les lignes blanches (contraste 11:1) */}
        <div
          style={{
            position: 'absolute',
            [rtl ? 'right' : 'left']: -SAFE.side,
            top: -22,
            // La bande suit le nombre de lignes : une hauteur fixe laissait
            // la dernière ligne en dehors du bleu.
            height: c.hook.white.length * (rtl ? 112 * 0.9 * 1.35 : 112 * 1.06) + 42,
            width: `${sweep * 120}%`,
            background: istd.blue,
          }}
        />
        <div style={{ position: 'relative' }}>
          {c.hook.white.map((line, i) => (
            <Words key={line} text={line} color={istd.white} delay={i * 6} size={112} />
          ))}
        </div>
        <div style={{ height: 56 }} />
        {c.hook.orange.map((line, i) => (
          <Words key={line} text={line} color={istd.orange} delay={30 + i * 6} size={112} />
        ))}
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ *
 * Plan 2 — PROMESSE · 0:03 → 0:07
 * ------------------------------------------------------------------ */
export const Promise: React.FC = () => {
  const frame = useCurrentFrame();
  const { c } = useLang();
  const veil = interpolate(frame, [0, 16], [0, -100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Stage background={istd.blue}>
      <div style={{ position: 'absolute', inset: 0, background: istd.bgDark, transform: `translateY(${veil}%)` }} />
      <div style={{ position: 'relative' }}>
        <Kicker delay={14} color={istd.warm1}>
          {c.promise.kicker}
        </Kicker>
        {c.promise.lines.map((line, i) => (
          <Words key={line} text={line} color={istd.white} delay={18 + i * 7} size={104} />
        ))}
        <Underline delay={48} width={420} color={istd.orange} />
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ *
 * Plan 3 — PREUVE CHOC · 0:07 → 0:11
 * L'anneau vit dans une boîte de taille fixe : il ne peut pas déborder
 * sur le texte placé en dessous.
 * ------------------------------------------------------------------ */
export const BigNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { c } = useLang();
  const count = Math.round(
    interpolate(frame, [6, 34], [0, 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  const pop = spring({ frame, fps, delay: 4, config: { damping: 200, mass: 0.7 } });
  const ring = interpolate(frame, [6, 40], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const BOX = 660;
  const R = 292;
  const C = 2 * Math.PI * R;

  return (
    <Stage background={istd.bgLight} center>
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
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              dir="ltr"
              style={{
                display: 'flex',
                alignItems: 'baseline',
                transform: `scale(${interpolate(pop, [0, 1], [0.82, 1])})`,
                opacity: pop,
              }}
            >
              <span style={{ fontSize: 276, fontWeight: 700, color: istd.orange, lineHeight: 1, letterSpacing: '-0.04em' }}>
                {count}
              </span>
              <span style={{ fontSize: 138, fontWeight: 700, color: istd.blue, lineHeight: 1 }}>%</span>
            </div>
          </div>
        </div>

        <div style={{ height: 76 }} />

        <div style={{ textAlign: 'center' }}>
          {c.number.lines.map((line, i) => (
            <Words key={line} text={line} color={istd.heading} delay={38 + i * 6} size={70} />
          ))}
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ *
 * Plan 4 — PREUVES EMPILÉES · 0:11 → 0:15
 * ------------------------------------------------------------------ */
const ProofRow: React.FC<{ strong: string; rest: string; delay: number }> = ({ strong, rest, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { rtl, body } = useLang();
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
        transform: `translateX(${interpolate(s, [0, 1], [rtl ? 60 : -60, 0])}px)`,
        marginBottom: 50,
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
      <span style={{ fontSize: rtl ? 56 : 62, fontWeight: 600, color: istd.white, lineHeight: rtl ? 1.35 : 1.15 }}>
        <strong style={{ color: istd.orange, fontWeight: 700 }}>{strong}</strong>
        <br />
        <span style={{ fontSize: rtl ? 40 : 41, fontWeight: 400, color: istd.warm2, fontFamily: body }}>{rest}</span>
      </span>
    </div>
  );
};

export const Proofs: React.FC = () => {
  const { c } = useLang();
  return (
    <Stage background={istd.bgDark}>
      <Kicker delay={0}>{c.proofs.kicker}</Kicker>
      <div style={{ height: 30 }} />
      {c.proofs.rows.map(([strong, rest], i) => (
        <ProofRow key={strong} strong={strong} rest={rest} delay={8 + i * 24} />
      ))}
    </Stage>
  );
};

/* ------------------------------------------------------------------ *
 * Plan 5 — SALAIRE ET MARCHÉ · 0:15 → 0:19
 *
 * Fond bleu : sur cette couleur, l'orange tombe à 2,4:1. Tout est donc
 * en blanc (11:1) et en accent chaud (6,5:1).
 * Les montants viennent de la grille publiée sur istd.ma/debouches.
 * Le nombre de cabinets vient de la carte sanitaire du ministère de la
 * Santé : c'est la taille du marché, pas un nombre de postes ouverts,
 * qu'aucune source marocaine ne publie.
 * ------------------------------------------------------------------ */
export const Money: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { c, body, rtl } = useLang();
  const m = c.money;

  const a = spring({ frame, fps, delay: 6, config: { damping: 200, mass: 0.6 } });
  const arrow = interpolate(frame, [18, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const b = spring({ frame, fps, delay: 28, config: { damping: 200, mass: 0.6 } });
  const riseScale = useRise(38);
  const rule = interpolate(frame, [48, 62], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const riseMarket = useRise(58);

  const amount = (value: string, s: number, dim: boolean) => (
    <span
      dir="ltr"
      style={{
        fontSize: 118,
        fontWeight: 700,
        color: dim ? istd.warm1 : istd.white,
        lineHeight: 1,
        letterSpacing: '-0.03em',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [28, 0])}px)`,
        display: 'inline-block',
      }}
    >
      {value}
    </span>
  );

  return (
    <Stage background={istd.blue} center>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Kicker delay={0} color={istd.warm1}>
          {m.kicker}
        </Kicker>

        <div dir="ltr" style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          {amount(m.from, a, true)}
          <svg width={92} height={44} viewBox="0 0 92 44" style={{ opacity: arrow }}>
            <path
              d="M6 22 H78 M60 6 L80 22 L60 38"
              fill="none"
              stroke={istd.white}
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={140}
              strokeDashoffset={140 * (1 - arrow)}
            />
          </svg>
          {amount(m.to, b, false)}
        </div>

        <div style={{ height: 16 }} />
        <span style={{ fontFamily: body, fontSize: 52, fontWeight: 700, color: istd.white }}>{m.unit}</span>
        <div style={{ height: 14 }} />
        <div style={riseScale}>
          <span style={{ fontFamily: body, fontSize: rtl ? 38 : 36, fontWeight: 400, color: istd.warm1 }}>
            {m.scale}
          </span>
        </div>

        <div style={{ height: 62 }} />
        <div style={{ width: 460 * rule, height: 3, background: istd.warm1, opacity: 0.55 }} />
        <div style={{ height: 62 }} />

        <div style={{ ...riseMarket, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span dir="ltr" style={{ fontSize: 146, fontWeight: 700, color: istd.white, lineHeight: 1, letterSpacing: '-0.03em' }}>
            {m.market}
          </span>
          <div style={{ height: 14 }} />
          <span style={{ fontFamily: body, fontSize: rtl ? 46 : 44, fontWeight: 600, color: istd.warm1 }}>
            {m.marketLabel}
          </span>
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ *
 * Plan 6 — INTERNATIONAL · 0:19 → 0:23
 *
 * Le montant français vient de la grille istd.ma/debouches. Il est
 * converti en dirhams : c'est la conversion qui rend le chiffre parlant
 * pour un candidat à Fès.
 * ------------------------------------------------------------------ */
export const International: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { c, body, rtl } = useLang();
  const i = c.intl;
  const riseLead = useRise(4);
  const riseFoot = useRise(78);

  return (
    <Stage background={istd.bgDark} center>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
        <Kicker delay={0}>{i.kicker}</Kicker>
        <div style={riseLead}>
          <span style={{ fontSize: rtl ? 50 : 54, fontWeight: 600, color: istd.white, lineHeight: 1.25 }}>{i.lead}</span>
        </div>

        <div style={{ height: 54 }} />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 30 }}>
          {i.rows.map((row, k) => {
            const s = spring({ frame, fps, delay: 16 + k * 11, config: { damping: 200, mass: 0.5 } });
            return (
              <div
                key={row.country}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 26,
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`,
                  borderBottom: `2px solid rgba(233,191,179,0.22)`,
                  paddingBottom: 24,
                }}
              >
                <span style={{ fontSize: 62, lineHeight: 1, flexShrink: 0 }}>{row.flag}</span>
                <span
                  style={{
                    fontSize: rtl ? 50 : 52,
                    fontWeight: 700,
                    color: istd.white,
                    letterSpacing: '-0.01em',
                    flexShrink: 0,
                  }}
                >
                  {row.country}
                </span>
                {/* Le montant local reste discret : c'est la conversion qui parle. */}
                <span style={{ fontFamily: body, fontSize: 32, fontWeight: 400, color: istd.warm2, flexShrink: 0 }}>
                  {row.local}
                </span>
                <span style={{ flex: 1 }} />
                <span
                  dir="ltr"
                  style={{
                    fontSize: rtl ? 50 : 54,
                    fontWeight: 700,
                    color: istd.orange,
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.mad}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ height: 30 }} />
        <div style={riseFoot}>
          <span style={{ fontFamily: body, fontSize: rtl ? 30 : 28, fontWeight: 400, color: istd.warm2, opacity: 0.85 }}>
            {i.footnote}
          </span>
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ *
 * Plan 5 — AUTORITÉ · 0:15 → 0:18
 * Fond clair imposé : le bleu du logo tombe à 1,5:1 sur fond sombre.
 * ------------------------------------------------------------------ */
export const Authority: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { c, body } = useLang();
  const rise = useRise(30);
  const s = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });
  const reveal = interpolate(frame, [0, 26], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Stage background={istd.bgLight} center>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ clipPath: `inset(0 0 ${reveal}% 0)`, transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})` }}>
          <Img src={staticFile('istd/logo-istd.png')} style={{ width: 680 }} />
        </div>
        <div style={{ height: 64 }} />
        <div style={rise}>
          <span style={{ fontSize: 60, fontWeight: 700, color: istd.heading, letterSpacing: '-0.01em' }}>
            {c.authority.name}
          </span>
          <div style={{ height: 18 }} />
          <span style={{ fontFamily: body, fontSize: 42, fontWeight: 400, color: istd.body }}>{c.authority.sub}</span>
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ *
 * Plan 6 — URGENCE + CTA · 0:18 → 0:22
 * Pas de numéro à recopier : sur une pub Instagram le bouton d'action
 * est fourni par la plateforme, c'est lui qu'il faut désigner.
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
  const { c, rtl, body } = useLang();
  const riseSub = useRise(16);
  const riseSite = useRise(46);
  const card = spring({ frame, fps, delay: 26, config: { damping: 200, mass: 0.7 } });
  // Pulsation lente, figée sur la fin pour une dernière frame parfaitement nette.
  const pulse = frame > 26 && frame < 100 ? 1 + Math.sin((frame - 26) / 7) * 0.014 : 1;

  return (
    <Stage background={istd.orange} center>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Kicker delay={0} color={istd.warm1}>
          {c.cta.kicker}
        </Kicker>
        <Words text={c.cta.title} color={istd.white} delay={4} size={78} />
        <div style={{ height: 22 }} />
        <div style={riseSub}>
          <span style={{ fontFamily: body, fontSize: 44, fontWeight: 600, color: istd.warm1 }}>{c.cta.sub}</span>
        </div>

        <div style={{ height: 78 }} />

        <div
          style={{
            background: istd.white,
            borderRadius: 26,
            padding: '40px 60px',
            opacity: card,
            transform: `scale(${interpolate(card, [0, 1], [0.86, 1]) * pulse})`,
            boxShadow: '0 26px 60px rgba(0,0,0,0.22)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width={46} height={46} viewBox="0 0 448 512" style={{ flexShrink: 0 }}>
              <path d={WHATSAPP_GLYPH} fill="#25D366" />
            </svg>
            <span
              style={{
                fontFamily: body,
                fontSize: rtl ? 34 : 28,
                fontWeight: 700,
                letterSpacing: rtl ? 'normal' : '0.12em',
                textTransform: rtl ? 'none' : 'uppercase',
                color: istd.body,
              }}
            >
              {c.cta.small}
            </span>
          </div>
          {c.cta.big.map((line) => (
            <span
              key={line}
              style={{
                fontSize: rtl ? 50 : 54,
                fontWeight: 700,
                color: istd.heading,
                lineHeight: 1.15,
                letterSpacing: rtl ? 'normal' : '-0.01em',
              }}
            >
              {line}
            </span>
          ))}
        </div>

        <div style={{ height: 26 }} />
        <DownArrow delay={40} />

        <div style={{ height: 30 }} />
        <div style={{ ...riseSite, textAlign: 'center' }}>
          <div style={{ fontFamily: body, fontSize: 30, fontWeight: 600, color: istd.warm1, marginBottom: 8 }}>
            {c.cta.more}
          </div>
          <span dir="ltr" style={{ fontSize: 52, fontWeight: 700, color: istd.white, letterSpacing: '0.04em' }}>
            {c.cta.site}
          </span>
        </div>
      </div>
    </Stage>
  );
};
