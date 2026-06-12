import { useCurrentFrame } from 'remotion';
import { SceneShell } from './SceneShell';
import { Kicker, KineticTitle, KenBurns, fadeUp } from '../components/atoms';
import { kobo, font } from '../theme';
import type { Bullet } from '../data';

export const CaseScene: React.FC<{
  index: number;
  kicker: string;
  title: string;
  photo: string;
  bullets: Bullet[];
  benefit: string;
  flip?: boolean;
}> = ({ index, kicker, title, photo, bullets, benefit, flip }) => {
  const frame = useCurrentFrame();

  const Photo = (
    <KenBurns file={photo} start={8} zoom={1.13} style={{ width: 720, height: 620, flexShrink: 0 }} />
  );

  const Text = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Kicker start={6}>{kicker}</Kicker>
      <div style={{ marginTop: 18, marginBottom: 30 }}>
        <KineticTitle text={title} start={16} size={56} maxWidth={760} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ ...fadeUp(frame, 44 + i * 14, 20), display: 'flex', gap: 18 }}>
            <div
              style={{
                marginTop: 8,
                width: 12,
                height: 12,
                borderRadius: 12,
                background: kobo.copperBright,
                flexShrink: 0,
                boxShadow: '0 0 0 4px rgba(202,138,4,0.18)',
              }}
            />
            <div>
              <span style={{ fontFamily: font.sans, fontSize: 23, fontWeight: 700, color: kobo.copperGlow }}>
                {b.lead} —{' '}
              </span>
              <span style={{ fontFamily: font.sans, fontSize: 23, lineHeight: 1.5, color: kobo.slateLine }}>
                {b.body}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <SceneShell index={index} variant="dark">
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 70, alignItems: 'center' }}>
          {flip ? (
            <>
              {Text}
              {Photo}
            </>
          ) : (
            <>
              {Photo}
              {Text}
            </>
          )}
        </div>

        <div
          style={{
            ...fadeUp(frame, 92, 24),
            marginTop: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '22px 32px',
            borderRadius: 14,
            background: 'rgba(202,138,4,0.12)',
            border: `1px solid ${kobo.copperLine}`,
          }}
        >
          <span
            style={{
              fontFamily: font.sans,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: kobo.copperGlow,
            }}
          >
            Bénéfice
          </span>
          <span style={{ fontFamily: font.sans, fontSize: 24, fontWeight: 500, color: kobo.white }}>
            {benefit}
          </span>
        </div>
      </div>
    </SceneShell>
  );
};
