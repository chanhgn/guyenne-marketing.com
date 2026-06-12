import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background';
import { CornerBracket, Logo, fadeUp } from '../components/atoms';
import { kobo, font } from '../theme';
import { brand, outro } from '../data';

const Contact: React.FC<{ icon: string; children: React.ReactNode; start: number }> = ({
  icon,
  children,
  start,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...fadeUp(frame, start, 18, 14),
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: font.sans,
        fontSize: 24,
        color: kobo.slateLine,
      }}
    >
      <span style={{ color: kobo.copperGlow, fontSize: 22 }}>{icon}</span>
      {children}
    </div>
  );
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoSp = spring({ frame, fps, config: { damping: 200, mass: 0.8 }, from: 0.92, to: 1 });
  const logoOp = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: 'clamp' });
  const bracket = interpolate(frame, [16, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ruleW = interpolate(frame, [34, 70], [0, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <Background variant="dark" />
      <CornerBracket corner="tr" size={150} progress={bracket} />
      <CornerBracket corner="bl" size={150} progress={bracket} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ transform: `scale(${logoSp})`, opacity: logoOp, marginBottom: 16 }}>
          <Logo variant="light" full width={520} />
        </div>

        <div
          style={{
            ...fadeUp(frame, 30, 20),
            fontFamily: font.display,
            fontSize: 70,
            fontWeight: 800,
            letterSpacing: -1.5,
            color: kobo.white,
            marginTop: 26,
          }}
        >
          {outro.title}
        </div>
        <div
          style={{
            ...fadeUp(frame, 46, 20),
            fontFamily: font.sans,
            fontSize: 30,
            fontWeight: 500,
            color: kobo.copperGlow,
            marginTop: 12,
          }}
        >
          {outro.sub}
        </div>

        <div style={{ height: 2, width: ruleW, background: kobo.copperBright, margin: '38px 0' }} />

        <div style={{ display: 'flex', gap: 44, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Contact icon="✉" start={62}>{brand.email}</Contact>
          <Contact icon="✆" start={70}>{brand.phone}</Contact>
          <Contact icon="◉" start={78}>{brand.web}</Contact>
        </div>
        <div style={{ ...fadeUp(frame, 86, 18), marginTop: 22, fontFamily: font.sans, fontSize: 20, color: kobo.slateFaint }}>
          {brand.address}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
