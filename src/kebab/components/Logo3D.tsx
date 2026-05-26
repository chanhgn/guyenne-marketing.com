import { useCurrentFrame, useVideoConfig } from 'remotion';
import { KebabLogo } from './KebabLogo';

// Logo qui tourne en 3D sur l'axe Y (double face -> toujours lisible).
export const Logo3D: React.FC<{ width: number; speedDegPerSec?: number }> = ({ width, speedDegPerSec = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const height = width * 0.404; // ratio natif ~1600x646
  const angle = (frame / fps) * speedDegPerSec;

  const face: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{ perspective: 2000, width, height }}>
      <div style={{ position: 'relative', width, height, transformStyle: 'preserve-3d', transform: `rotateY(${angle}deg)` }}>
        <div style={face}>
          <KebabLogo width={width} />
        </div>
        <div style={{ ...face, transform: 'rotateY(180deg)' }}>
          <KebabLogo width={width} />
        </div>
      </div>
    </div>
  );
};
