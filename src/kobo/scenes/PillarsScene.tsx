import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { SceneShell } from './SceneShell';
import { Kicker, KineticTitle, PartnerChip, fadeUp } from '../components/atoms';
import { kobo, font } from '../theme';
import type { Bullet } from '../data';

const Pillar: React.FC<{ item: Bullet; idx: number; start: number; compact?: boolean }> = ({
  item,
  idx,
  start,
  compact,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - start, fps, config: { damping: 200, mass: 0.7 } });
  return (
    <div
      style={{
        flex: 1,
        opacity: sp,
        transform: `translateY(${(1 - sp) * 28}px)`,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${kobo.hairlineDark}`,
        borderRadius: 16,
        padding: compact ? '30px 28px' : '36px 34px',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: 'rgba(202,138,4,0.14)',
          border: `1px solid ${kobo.copperLine}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: font.display,
          fontSize: 22,
          fontWeight: 800,
          color: kobo.copperGlow,
          marginBottom: 22,
        }}
      >
        {String(idx + 1).padStart(2, '0')}
      </div>
      <div
        style={{
          fontFamily: font.sans,
          fontSize: compact ? 25 : 28,
          fontWeight: 700,
          color: kobo.white,
          marginBottom: 14,
          lineHeight: 1.2,
        }}
      >
        {item.lead}
      </div>
      <p
        style={{
          fontFamily: font.sans,
          fontSize: compact ? 19 : 21,
          lineHeight: 1.5,
          color: kobo.slateLine,
          margin: 0,
        }}
      >
        {item.body}
      </p>
    </div>
  );
};

export const PillarsScene: React.FC<{
  index: number;
  kicker: string;
  title: string;
  pillars: Bullet[];
  partners?: string[];
  badges?: string[];
  note?: string;
}> = ({ index, kicker, title, pillars, partners, badges, note }) => {
  const frame = useCurrentFrame();
  const compact = pillars.length >= 4;
  const bottomStart = 50 + pillars.length * 10;
  return (
    <SceneShell index={index} variant="dark">
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
        <Kicker start={6}>{kicker}</Kicker>
        <div style={{ marginTop: 22, marginBottom: 40 }}>
          <KineticTitle text={title} start={16} size={60} maxWidth={1500} />
        </div>

        <div style={{ display: 'flex', gap: compact ? 24 : 32, alignItems: 'stretch' }}>
          {pillars.map((p, i) => (
            <Pillar key={i} item={p} idx={i} start={46 + i * 10} compact={compact} />
          ))}
        </div>

        {partners && (
          <div style={{ marginTop: 40, display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              style={{
                ...fadeUp(frame, bottomStart, 16),
                fontFamily: font.sans,
                fontSize: 16,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: kobo.slateFaint,
              }}
            >
              Nos partenaires
            </span>
            {partners.map((p, i) => (
              <PartnerChip key={p} file={p} start={bottomStart + 6 + i * 6} w={172} />
            ))}
          </div>
        )}

        {badges && (
          <div style={{ marginTop: 38, display: 'flex', gap: 22, alignItems: 'center' }}>
            {badges.map((b, i) => (
              <PartnerChip key={b} file={b} start={bottomStart + i * 8} w={186} />
            ))}
          </div>
        )}

        {note && (
          <div
            style={{
              ...fadeUp(frame, bottomStart, 22),
              marginTop: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '20px 28px',
              borderRadius: 14,
              background: 'rgba(202,138,4,0.10)',
              border: `1px solid ${kobo.copperLine}`,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 10, background: kobo.copperGlow, flexShrink: 0 }} />
            <span style={{ fontFamily: font.sans, fontSize: 23, fontWeight: 500, color: kobo.white }}>
              {note}
            </span>
          </div>
        )}
      </div>
    </SceneShell>
  );
};
