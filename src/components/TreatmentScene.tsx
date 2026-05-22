import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { theme, fontStack } from '../theme';
import { Background } from './Background';
import { FPS, totalClipDurationSec, type Treatment } from '../data/treatments';

const TITLE_HOLD_SEC = 2.4;
const FADE_SEC = 0.5;

export const sceneDurationSec = (t: Treatment): number =>
  TITLE_HOLD_SEC + FADE_SEC + totalClipDurationSec(t);

export const TreatmentScene: React.FC<{ treatment: Treatment }> = ({ treatment }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const titleHold = Math.round(TITLE_HOLD_SEC * FPS);
  const fade = Math.round(FADE_SEC * FPS);
  const titleEnd = titleHold + fade;

  const titleOpacity = interpolate(frame, [0, 14, titleHold, titleEnd], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleScale = interpolate(frame, [0, 18], [1.04, 1], { extrapolateRight: 'clamp' });
  const titleArOpacity = interpolate(frame, [12, 28], [0, 1], { extrapolateRight: 'clamp' });

  const videoOpacity = interpolate(frame, [titleHold, titleEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitWindow = Math.round(0.5 * FPS);
  const exitFade = interpolate(
    frame,
    [durationInFrames - exitWindow, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const lowerOpacity = interpolate(
    frame,
    [titleEnd, titleEnd + 18, durationInFrames - exitWindow - 12, durationInFrames - exitWindow],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  let cursor = titleEnd;
  const pieceSeqs: React.ReactElement[] = [];
  treatment.pieces.forEach((piece, idx) => {
    const pieceFrames = Math.round(piece.durationSec * FPS);
    pieceSeqs.push(
      <Sequence key={`p${idx}`} from={cursor} durationInFrames={pieceFrames}>
        <PiecePlayer file={piece.file} opacity={videoOpacity} />
      </Sequence>,
    );
    cursor += pieceFrames;
  });

  return (
    <AbsoluteFill style={{ opacity: exitFade }}>
      <Background variant="dark" />

      {/* Title card */}
      <AbsoluteFill
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.paper,
          padding: 80,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 28,
            alignItems: 'center',
            fontFamily: fontStack.sans,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: theme.coralLight,
            marginBottom: 40,
          }}
        >
          <span>{treatment.category}</span>
          <span style={{ opacity: 0.5, letterSpacing: 0 }}>·</span>
          <span
            style={{
              fontFamily: fontStack.arabic,
              letterSpacing: 0,
              textTransform: 'none',
              fontSize: 26,
              direction: 'rtl',
            }}
          >
            {treatment.categoryAr}
          </span>
        </div>

        <div
          style={{
            fontFamily: fontStack.serif,
            fontSize: 110,
            fontWeight: 400,
            color: theme.paper,
            textAlign: 'center',
            lineHeight: 1.05,
            letterSpacing: 1,
            maxWidth: 1500,
          }}
        >
          {treatment.title}
        </div>

        <div
          style={{
            opacity: titleArOpacity,
            marginTop: 14,
            fontFamily: fontStack.arabic,
            fontSize: 64,
            fontWeight: 600,
            color: theme.coralLight,
            textAlign: 'center',
            lineHeight: 1.15,
            direction: 'rtl',
            maxWidth: 1500,
          }}
        >
          {treatment.titleAr}
        </div>

        <div
          style={{
            marginTop: 36,
            height: 1,
            width: 220,
            background: theme.coral,
            opacity: 0.8,
          }}
        />

        <div
          style={{
            marginTop: 32,
            fontFamily: fontStack.serif,
            fontStyle: 'italic',
            fontSize: 32,
            color: 'rgba(250, 247, 242, 0.8)',
            textAlign: 'center',
            maxWidth: 1100,
          }}
        >
          {treatment.subtitle}
        </div>

        <div
          style={{
            marginTop: 8,
            fontFamily: fontStack.arabic,
            fontSize: 28,
            fontWeight: 400,
            color: 'rgba(250, 247, 242, 0.7)',
            textAlign: 'center',
            direction: 'rtl',
            maxWidth: 1100,
          }}
        >
          {treatment.subtitleAr}
        </div>
      </AbsoluteFill>

      {pieceSeqs}

      {/* Lower-third caption */}
      <AbsoluteFill
        style={{
          opacity: lowerOpacity,
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '0 80px 60px 80px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: 22,
            background: 'rgba(8, 17, 58, 0.78)',
            backdropFilter: 'blur(14px)',
            border: `1px solid ${theme.coral}66`,
            padding: '20px 32px',
            maxWidth: 1280,
          }}
        >
          <div style={{ width: 3, background: theme.coral }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                fontFamily: fontStack.sans,
                fontSize: 15,
                letterSpacing: 5,
                textTransform: 'uppercase',
                color: theme.coralLight,
                fontWeight: 500,
              }}
            >
              <span>{treatment.title}</span>
              <span style={{ opacity: 0.5, letterSpacing: 0 }}>·</span>
              <span
                style={{
                  fontFamily: fontStack.arabic,
                  letterSpacing: 0,
                  textTransform: 'none',
                  fontSize: 19,
                  direction: 'rtl',
                }}
              >
                {treatment.titleAr}
              </span>
            </div>
            <div
              style={{
                fontFamily: fontStack.serif,
                fontSize: 22,
                color: theme.paper,
                lineHeight: 1.35,
                maxWidth: 1100,
              }}
            >
              {treatment.description}
            </div>
            <div
              style={{
                fontFamily: fontStack.arabic,
                fontSize: 21,
                fontWeight: 400,
                color: 'rgba(250, 247, 242, 0.8)',
                lineHeight: 1.65,
                maxWidth: 1100,
                direction: 'rtl',
                textAlign: 'right',
              }}
            >
              {treatment.descriptionAr}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PiecePlayer: React.FC<{
  file: string;
  opacity: number;
}> = ({ file, opacity }) => {
  return (
    <AbsoluteFill style={{ opacity }}>
      <OffthreadVideo
        src={staticFile(file)}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </AbsoluteFill>
  );
};
