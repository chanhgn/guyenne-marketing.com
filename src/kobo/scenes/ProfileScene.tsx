import { useCurrentFrame } from 'remotion';
import { SceneShell } from './SceneShell';
import { Kicker, KineticTitle, KenBurns, fadeUp } from '../components/atoms';
import { kobo, font } from '../theme';
import { profile, brand } from '../data';

export const ProfileScene: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell index={index} variant="dark">
      <div style={{ display: 'flex', gap: 90, alignItems: 'center', width: '100%' }}>
        {/* Portrait */}
        <KenBurns
          file="kobo_portrait_sandrine.png"
          start={6}
          zoom={1.14}
          pan={[-2, -2]}
          style={{ width: 620, height: 740, flexShrink: 0 }}
        />

        {/* Texte */}
        <div style={{ flex: 1 }}>
          <Kicker start={10}>{profile.kicker}</Kicker>
          <div style={{ marginTop: 26 }}>
            <KineticTitle text={profile.title} start={20} size={76} />
          </div>

          <div style={{ marginTop: 40, maxWidth: 760 }}>
            {profile.paras.map((p, i) => (
              <p
                key={i}
                style={{
                  ...fadeUp(frame, 46 + i * 14, 20),
                  margin: '0 0 22px',
                  fontFamily: font.sans,
                  fontSize: 28,
                  lineHeight: 1.55,
                  fontWeight: 400,
                  color: kobo.slateLine,
                }}
              >
                {p}
              </p>
            ))}
          </div>

          <div
            style={{
              ...fadeUp(frame, 84, 22),
              marginTop: 18,
              paddingLeft: 26,
              borderLeft: `3px solid ${kobo.copperBright}`,
              fontFamily: font.sans,
              fontStyle: 'italic',
              fontSize: 26,
              lineHeight: 1.5,
              color: kobo.white,
              maxWidth: 720,
            }}
          >
            {profile.signature}
          </div>

          <div
            style={{
              ...fadeUp(frame, 100, 20),
              marginTop: 34,
              fontFamily: font.sans,
              fontSize: 18,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: kobo.slateFaint,
            }}
          >
            {brand.speaker} · {brand.city}
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
