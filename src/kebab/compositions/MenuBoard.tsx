import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { kebabTheme, kebabFonts } from '../theme';
import { KebabBg } from '../components/KebabBg';
import { KebabLogo } from '../components/KebabLogo';

export type BoardRow = {
  name: string;
  ingredients: string;
  price?: number; // prix unique
  from?: boolean; // "des"
  tiers?: { seul: number; frites: number; menu: number }; // 3 formules
};

const Price: React.FC<{ value: number }> = ({ value }) => (
  <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
    <span style={{ fontFamily: kebabFonts.display, fontSize: 64, lineHeight: 0.9, color: kebabTheme.goldBright }}>{value}</span>
    <span style={{ fontFamily: kebabFonts.sans, fontWeight: 800, fontSize: 26, color: kebabTheme.goldBright }}>Dh</span>
  </span>
);

const Row: React.FC<{ row: BoardRow; index: number; showTiers: boolean }> = ({ row, index, showTiers }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 20 - index * 10, fps, config: { damping: 200, mass: 0.6 }, from: 0, to: 1 });
  const x = (1 - enter) * -60;

  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        opacity: enter,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 40,
        padding: '24px 36px',
        background: 'rgba(0,0,0,0.4)',
        border: `2px solid ${kebabTheme.goldDeep}`,
        borderRadius: 22,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: kebabFonts.display, fontSize: 66, lineHeight: 1, color: kebabTheme.white, letterSpacing: 0.5 }}>
          {row.name}
        </div>
        <div style={{ fontFamily: kebabFonts.sans, fontWeight: 500, fontSize: 30, color: kebabTheme.muted, marginTop: 8 }}>
          {row.ingredients}
        </div>
      </div>

      {showTiers && row.tiers ? (
        <div style={{ display: 'flex', gap: 30, flexShrink: 0 }}>
          {[row.tiers.seul, row.tiers.frites, row.tiers.menu].map((v, i) => (
            <div key={i} style={{ width: 110, textAlign: 'center' }}>
              <Price value={v} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          {row.from ? (
            <div style={{ fontFamily: kebabFonts.sans, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: kebabTheme.goldBright }}>À PARTIR DE</div>
          ) : null}
          <Price value={row.price ?? 0} />
        </div>
      )}
    </div>
  );
};

// Scene "carte menu" motion design : entree animee puis stable (>=15s de lecture).
export const MenuBoard: React.FC<{
  titleFr: string;
  titleAr: string;
  rows: BoardRow[];
  showTiers?: boolean;
}> = ({ titleFr, titleAr, rows, showTiers = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 200, mass: 0.6 }, from: 0.9, to: 1 });
  const logoO = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
  const titleO = interpolate(frame, [8, 26], [0, 1], { extrapolateRight: 'clamp' });
  const headO = interpolate(frame, [16, 32], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <KebabBg>
        <AbsoluteFill style={{ padding: '60px 90px', flexDirection: 'column' }}>
          {/* En-tete : logo + titre */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ transform: `scale(${logoIn})`, opacity: logoO, transformOrigin: 'left center' }}>
              <KebabLogo width={380} />
            </div>
            <div style={{ textAlign: 'right', opacity: titleO }}>
              <div style={{ fontFamily: kebabFonts.display, fontSize: 76, color: kebabTheme.white, letterSpacing: 1 }}>{titleFr}</div>
              <div style={{ fontFamily: kebabFonts.arabic, fontWeight: 700, fontSize: 44, color: kebabTheme.goldBright, direction: 'rtl' }}>{titleAr}</div>
            </div>
          </div>

          {/* En-tete des formules (kebabs) */}
          {showTiers ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 30, paddingRight: 36, marginBottom: 14, opacity: headO }}>
              {['SEUL', '+ FRITES', 'MENU'].map((h) => (
                <div key={h} style={{ width: 110, textAlign: 'center', fontFamily: kebabFonts.sans, fontWeight: 800, fontSize: 24, letterSpacing: 1, color: kebabTheme.goldBright }}>
                  {h}
                </div>
              ))}
            </div>
          ) : null}

          {/* Lignes produits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, flex: 1, justifyContent: 'center' }}>
            {rows.map((r, i) => (
              <Row key={r.name} row={r} index={i} showTiers={showTiers} />
            ))}
          </div>
        </AbsoluteFill>
      </KebabBg>
    </AbsoluteFill>
  );
};
