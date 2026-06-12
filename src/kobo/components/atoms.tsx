import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { kobo, font } from '../theme';

// ---------- helpers d'animation ----------
export const fadeUp = (frame: number, start: number, dur = 18, dist = 22) => ({
  opacity: interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }),
  transform: `translateY(${interpolate(frame, [start, start + dur], [dist, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })}px)`,
});

// Sortie globale d'une scène (fondu sur les derniers frames)
export const useSceneExit = (fadeFrames = 16) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(
    frame,
    [durationInFrames - fadeFrames, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
};

// ---------- Logo ----------
export const Logo: React.FC<{
  variant?: 'light' | 'dark';
  full?: boolean;
  width?: number;
}> = ({ variant = 'light', full = false, width = 360 }) => {
  const file = full
    ? variant === 'light'
      ? 'kobo_logo_light_full.png'
      : 'kobo_logo_dark_full.png'
    : variant === 'light'
      ? 'kobo_logo_light.png'
      : 'kobo_logo_dark.png';
  return <Img src={staticFile(file)} style={{ width, height: 'auto', display: 'block' }} />;
};

// ---------- Équerres cuivre (signature du deck) ----------
export const CornerBracket: React.FC<{
  corner?: 'tr' | 'bl';
  size?: number;
  progress?: number;
}> = ({ corner = 'tr', size = 120, progress = 1 }) => {
  const len = size * progress;
  const common: React.CSSProperties = { position: 'absolute', background: kobo.copperBright };
  const pos: React.CSSProperties =
    corner === 'tr' ? { top: 64, right: 64 } : { bottom: 64, left: 64 };
  return (
    <div style={{ position: 'absolute', ...pos, width: size, height: size }}>
      <div style={{ ...common, top: 0, [corner === 'tr' ? 'right' : 'left']: 0, height: 2, width: len } as React.CSSProperties} />
      <div style={{ ...common, top: 0, [corner === 'tr' ? 'right' : 'left']: 0, width: 2, height: len } as React.CSSProperties} />
    </div>
  );
};

// ---------- Kicker (sur-titre) ----------
export const Kicker: React.FC<{
  children: React.ReactNode;
  start?: number;
  variant?: 'light' | 'dark';
}> = ({ children, start = 4, variant = 'dark' }) => {
  const frame = useCurrentFrame();
  const a = fadeUp(frame, start, 16, 14);
  const lineW = interpolate(frame, [start + 6, start + 28], [0, 46], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const color = variant === 'dark' ? kobo.copperGlow : kobo.copper;
  return (
    <div style={{ ...a, display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{ width: lineW, height: 2, background: color }} />
      <span
        style={{
          fontFamily: font.sans,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color,
        }}
      >
        {children}
      </span>
    </div>
  );
};

// ---------- Titre cinétique (révélation mot à mot) ----------
export const KineticTitle: React.FC<{
  text: string;
  start?: number;
  size?: number;
  variant?: 'light' | 'dark';
  weight?: number;
  maxWidth?: number;
}> = ({ text, start = 12, size = 64, variant = 'dark', weight = 800, maxWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');
  const color = variant === 'dark' ? kobo.white : kobo.ink;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0 0.28em',
        maxWidth,
        fontFamily: font.display,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: -1.2,
        lineHeight: 1.05,
        color,
      }}
    >
      {words.map((w, i) => {
        const s = start + i * 3;
        const sp = spring({ frame: frame - s, fps, config: { damping: 200, mass: 0.5 } });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: sp,
              transform: `translateY(${(1 - sp) * 26}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Image avec effet Ken Burns + cadre ----------
export const KenBurns: React.FC<{
  file: string;
  start?: number;
  zoom?: number;
  pan?: [number, number];
  style?: React.CSSProperties;
  radius?: number;
}> = ({ file, start = 0, zoom = 1.12, pan = [0, -2], style, radius = 14 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [start, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const reveal = interpolate(frame, [start, start + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(t, [0, 1], [1.02, zoom]);
  const tx = interpolate(t, [0, 1], [0, pan[0]]);
  const ty = interpolate(t, [0, 1], [0, pan[1]]);
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: radius,
        boxShadow: kobo.shadowCard,
        opacity: reveal,
        clipPath: `inset(${(1 - reveal) * 8}% 0% 0% 0%)`,
        border: `1px solid ${kobo.hairlineDark}`,
        ...style,
      }}
    >
      <Img
        src={staticFile(file)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
        }}
      />
      {/* voile cuivré subtil en bas */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, transparent 55%, rgba(8,15,30,0.45) 100%)',
        }}
      />
    </div>
  );
};

// ---------- Carte logo partenaire ----------
export const PartnerChip: React.FC<{ file: string; start: number; w?: number }> = ({
  file,
  start,
  w = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - start, fps, config: { damping: 200, mass: 0.6 } });
  return (
    <div
      style={{
        opacity: sp,
        transform: `translateY(${(1 - sp) * 18}px)`,
        width: w,
        height: w * 0.5,
        borderRadius: 12,
        background: kobo.white,
        border: `1px solid ${kobo.hairlineLight}`,
        boxShadow: kobo.shadowCard,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Img src={staticFile(file)} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
    </div>
  );
};

// ---------- Étiquette chapitre (numéro de scène) ----------
export const ChapterTag: React.FC<{ index: number; total: number; variant?: 'light' | 'dark' }> = ({
  index,
  total,
  variant = 'dark',
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [6, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const color = variant === 'dark' ? kobo.slateLine : kobo.slateMute;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        right: 76,
        opacity: o,
        fontFamily: font.sans,
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: 3,
        color,
      }}
    >
      {String(index).padStart(2, '0')}
      <span style={{ opacity: 0.5 }}> / {String(total).padStart(2, '0')}</span>
    </div>
  );
};
