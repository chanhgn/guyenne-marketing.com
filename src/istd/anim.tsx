import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { istd, istdFonts } from './theme';

/** Marges sûres d'un Reel : l'interface Instagram mange le bas et la droite. */
export const SAFE = { side: 88, bottom: 300, top: 150 } as const;

export const Stage: React.FC<{
  background: string;
  children: React.ReactNode;
  align?: 'center' | 'flex-start';
}> = ({ background, children, align = 'flex-start' }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: align,
      padding: `${SAFE.top}px ${SAFE.side}px ${SAFE.bottom}px`,
      fontFamily: istdFonts.display,
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

/** Entrée par ressort, calée sur une frame de départ locale à la scène. */
export const useRise = (delay: number, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, delay, config: { damping, mass: 0.6 } });
  return {
    opacity: s,
    transform: `translateY(${interpolate(s, [0, 1], [46, 0])}px)`,
  };
};

/** Surtitre : petite ligne capitale au-dessus du titre. */
export const Kicker: React.FC<{ children: React.ReactNode; color?: string; delay?: number }> = ({
  children,
  color = istd.orange,
  delay = 0,
}) => {
  const style = useRise(delay);
  return (
    <span
      style={{
        ...style,
        fontFamily: istdFonts.body,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color,
        marginBottom: 34,
      }}
    >
      {children}
    </span>
  );
};

/** Titre dont les mots arrivent l'un après l'autre. */
export const Words: React.FC<{
  text: string;
  color: string;
  size?: number;
  delay?: number;
  step?: number;
  weight?: number;
}> = ({ text, color, size = 104, delay = 0, step = 3, weight = 700 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <span
      style={{
        display: 'block',
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.06,
        letterSpacing: '-0.02em',
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
              marginRight: '0.28em',
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

/** Trait qui se trace, utilisé pour souligner le mot porteur. */
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
  return (
    <div
      style={{
        width: width * grow,
        height: thickness,
        background: color,
        borderRadius: thickness,
        marginTop: 26,
      }}
    />
  );
};
