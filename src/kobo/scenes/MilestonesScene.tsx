import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { SceneShell } from './SceneShell';
import { Kicker, KineticTitle, KenBurns, fadeUp } from '../components/atoms';
import { kobo, font } from '../theme';
import type { Milestone } from '../data';

const Card: React.FC<{ item: Milestone; idx: number; start: number }> = ({ item, idx, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - start, fps, config: { damping: 200, mass: 0.7 } });
  return (
    <div
      style={{
        flex: 1,
        opacity: sp,
        transform: `translateY(${(1 - sp) * 30}px)`,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${kobo.hairlineDark}`,
        borderRadius: 18,
        padding: '40px 42px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          background: `linear-gradient(${kobo.copperBright}, ${kobo.copperDeep})`,
        }}
      />
      <div
        style={{
          fontFamily: font.display,
          fontSize: 56,
          fontWeight: 800,
          color: 'rgba(202,138,4,0.28)',
          lineHeight: 1,
          marginBottom: 14,
        }}
      >
        {String(idx + 1).padStart(2, '0')}
      </div>
      <div style={{ fontFamily: font.sans, fontSize: 32, fontWeight: 700, color: kobo.white }}>
        {item.title}
      </div>
      {item.org && (
        <div
          style={{
            marginTop: 8,
            fontFamily: font.sans,
            fontSize: 19,
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: kobo.copperGlow,
          }}
        >
          {item.org}
        </div>
      )}
      <p
        style={{
          marginTop: 18,
          fontFamily: font.sans,
          fontSize: 23,
          lineHeight: 1.5,
          color: kobo.slateLine,
        }}
      >
        {item.body}
      </p>
    </div>
  );
};

export const MilestonesScene: React.FC<{
  index: number;
  kicker: string;
  title: string;
  items: Milestone[];
  highlight?: string;
  photos?: string[];
}> = ({ index, kicker, title, items, highlight, photos }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell index={index} variant="dark">
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
        <Kicker start={6}>{kicker}</Kicker>
        <div style={{ marginTop: 22, marginBottom: 44 }}>
          <KineticTitle text={title} start={16} size={62} maxWidth={1400} />
        </div>

        <div style={{ display: 'flex', gap: 36, alignItems: 'stretch' }}>
          {items.map((it, i) => (
            <Card key={i} item={it} idx={i} start={44 + i * 12} />
          ))}
          {photos && photos.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 360, flexShrink: 0 }}>
              {photos.map((p, i) => (
                <KenBurns
                  key={p}
                  file={p}
                  start={56 + i * 10}
                  zoom={1.12}
                  style={{ width: '100%', flex: 1, minHeight: 0 }}
                />
              ))}
            </div>
          )}
        </div>

        {highlight && (
          <div
            style={{
              ...fadeUp(frame, 86, 22),
              marginTop: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '22px 30px',
              borderRadius: 14,
              background: 'rgba(202,138,4,0.10)',
              border: `1px solid ${kobo.copperLine}`,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 10, background: kobo.copperGlow, flexShrink: 0 }} />
            <span style={{ fontFamily: font.sans, fontSize: 24, fontWeight: 500, color: kobo.white }}>
              {highlight}
            </span>
          </div>
        )}
      </div>
    </SceneShell>
  );
};
