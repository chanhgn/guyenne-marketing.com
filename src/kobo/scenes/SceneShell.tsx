import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Background } from '../components/Background';
import { ChapterTag, CornerBracket, useSceneExit } from '../components/atoms';

export const TOTAL_CHAPTERS = 13;

// Cadre commun à toutes les scènes : fond blueprint, équerre cuivre animée,
// padding cohérent, numéro de chapitre, fondu d'entrée/sortie.
export const SceneShell: React.FC<{
  index: number;
  variant?: 'light' | 'dark';
  children: React.ReactNode;
  pad?: number;
}> = ({ index, variant = 'dark', children, pad = 120 }) => {
  const frame = useCurrentFrame();
  const exit = useSceneExit();
  const enter = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const bracket = interpolate(frame, [8, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>
      <Background variant={variant} />
      <CornerBracket corner="tr" size={130} progress={bracket} />
      <AbsoluteFill style={{ padding: pad, display: 'flex' }}>{children}</AbsoluteFill>
      <ChapterTag index={index} total={TOTAL_CHAPTERS} variant={variant} />
    </AbsoluteFill>
  );
};
