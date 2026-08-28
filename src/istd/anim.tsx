import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { istd, istdFonts } from './theme';
import { COPY, Lang, ReelCopy } from './copy';

/** Marges sûres d'un Reel : l'interface Instagram mange le bas et la droite. */
export const SAFE = { side: 88, bottom: 300, top: 150 } as const;

type LangCtx = { lang: Lang; c: ReelCopy; rtl: boolean; display: string; body: string };

const Ctx = React.createContext<LangCtx>({
  lang: 'fr',
  c: COPY.fr,
  rtl: false,
  display: istdFonts.display,
  body: istdFonts.body,
});

export const useLang = () => React.useContext(Ctx);

export const LangProvider: React.FC<{ lang: Lang; children: React.ReactNode }> = ({ lang, children }) => {
  const rtl = COPY[lang].dir === 'rtl';
  return (
    <Ctx.Provider
      value={{
        lang,
        c: COPY[lang],
        rtl,
        // L'arabe passe en Cairo : Jost ne couvre pas l'écriture arabe.
        display: rtl ? istdFonts.arabic : istdFonts.display,
        body: rtl ? istdFonts.arabic : istdFonts.body,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const Stage: React.FC<{
  background: string;
  children: React.ReactNode;
  center?: boolean;
}> = ({ background, children, center = false }) => {
  const { rtl, display, c } = useLang();
  return (
    <div
      dir={c.dir}
      style={{
        position: 'absolute',
        inset: 0,
        background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // flex-start et text-align:start suivent le sens d'écriture : en RTL
        // ils désignent la droite. Utiliser flex-end alignerait à gauche.
        alignItems: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'start',
        padding: `${SAFE.top}px ${SAFE.side}px ${SAFE.bottom}px`,
        fontFamily: display,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

/** Entrée par ressort, calée sur une frame de départ locale à la scène. */
export const useRise = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, delay, config: { damping: 200, mass: 0.6 } });
  return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [46, 0])}px)` };
};

/** Surtitre : petite ligne capitale au-dessus du titre. */
export const Kicker: React.FC<{ children: React.ReactNode; color?: string; delay?: number }> = ({
  children,
  color = istd.orange,
  delay = 0,
}) => {
  const style = useRise(delay);
  const { rtl, body } = useLang();
  return (
    <span
      style={{
        ...style,
        fontFamily: body,
        fontWeight: 700,
        fontSize: rtl ? 34 : 30,
        letterSpacing: rtl ? 'normal' : '0.22em',
        textTransform: rtl ? 'none' : 'uppercase',
        color,
        marginBottom: 34,
      }}
    >
      {children}
    </span>
  );
};

/**
 * Titre dont les mots arrivent l'un après l'autre.
 * En arabe l'ordre visuel des mots est géré par `direction: rtl` sur le conteneur,
 * et l'espacement par `marginInlineEnd`, qui suit le sens d'écriture.
 */
export const Words: React.FC<{
  text: string;
  color: string;
  size?: number;
  delay?: number;
  step?: number;
}> = ({ text, color, size = 104, delay = 0, step = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { rtl, display, c } = useLang();
  return (
    <span
      dir={c.dir}
      style={{
        display: 'block',
        fontFamily: display,
        fontSize: rtl ? size * 0.9 : size,
        fontWeight: 700,
        lineHeight: rtl ? 1.35 : 1.06,
        letterSpacing: rtl ? 'normal' : '-0.02em',
        color,
      }}
    >
      {text.split(' ').map((word, i) => {
        const s = spring({ frame, fps, delay: delay + i * step, config: { damping: 200, mass: 0.5 } });
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: 'inline-block',
              marginInlineEnd: '0.28em',
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

/** Trait qui se trace, utilisé pour souligner le bloc de titre. */
export const Underline: React.FC<{ delay: number; width: number; color?: string; thickness?: number }> = ({
  delay,
  width,
  color = istd.blue,
  thickness = 12,
}) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [delay, delay + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <div style={{ width: width * grow, height: thickness, background: color, borderRadius: thickness, marginTop: 26 }} />;
};

/** Chevron qui rebondit vers le bas : renvoie vers le bouton d'action d'Instagram. */
export const DownArrow: React.FC<{ delay: number; color?: string }> = ({ delay, color = istd.white }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, delay, config: { damping: 200, mass: 0.6 } });
  const bounce = frame > delay ? Math.abs(Math.sin((frame - delay) / 9)) * 18 : 0;
  return (
    <svg width={64} height={40} viewBox="0 0 64 40" style={{ opacity: s, transform: `translateY(${bounce}px)` }}>
      <path d="M8 10 L32 30 L56 10" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
