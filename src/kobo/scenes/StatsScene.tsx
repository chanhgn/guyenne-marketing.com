import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneShell } from './SceneShell';
import { Kicker, KineticTitle, fadeUp } from '../components/atoms';
import { kobo, font } from '../theme';
import { confiance } from '../data';

const StatCard: React.FC<{
  value: string;
  unit: string;
  label: string;
  start: number;
}> = ({ value, unit, label, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - start, fps, config: { damping: 200, mass: 0.7 } });

  // compteur animé (gère les décimaux)
  const target = parseFloat(value);
  const decimals = value.includes('.') ? 1 : 0;
  const shown = interpolate(frame, [start, start + 30], [0, target], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }).toFixed(decimals);

  return (
    <div
      style={{
        flex: 1,
        opacity: sp,
        transform: `translateY(${(1 - sp) * 28}px) scale(${0.96 + sp * 0.04})`,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${kobo.hairlineDark}`,
        borderRadius: 20,
        padding: '48px 40px',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
        <span
          style={{
            fontFamily: font.display,
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1,
            color: kobo.white,
          }}
        >
          {shown}
        </span>
        <span style={{ fontFamily: font.display, fontSize: 44, fontWeight: 800, color: kobo.copperGlow }}>
          {unit}
        </span>
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: font.sans,
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: 1,
          color: kobo.slateLine,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const StatsScene: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell index={index} variant="dark">
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
        <Kicker start={6}>{confiance.kicker}</Kicker>
        <div style={{ marginTop: 22, marginBottom: 44 }}>
          <KineticTitle text={confiance.title} start={16} size={62} />
        </div>

        <div style={{ display: 'flex', gap: 32 }}>
          {confiance.stats.map((s, i) => (
            <StatCard key={i} {...s} start={46 + i * 12} />
          ))}
        </div>

        <p
          style={{
            ...fadeUp(frame, 96, 24),
            marginTop: 44,
            maxWidth: 1400,
            fontFamily: font.sans,
            fontSize: 24,
            lineHeight: 1.55,
            color: kobo.slateLine,
          }}
        >
          {confiance.body}
        </p>
      </div>
    </SceneShell>
  );
};
