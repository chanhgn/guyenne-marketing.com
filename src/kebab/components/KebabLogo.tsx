import { kebabTheme, kebabFonts } from '../theme';

// Logo provisoire reconstruit en code (or sur noir), fidele a l'identite.
// >>> Quand le PNG sera fourni dans public/kebab/logo.png, remplacer le rendu
//     par : <Img src={staticFile('kebab/logo.png')} style={{ width }} />
const DonerIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="12" r="6" fill={kebabTheme.black} />
    <rect x="48" y="14" width="4" height="20" rx="2" fill={kebabTheme.black} />
    <path
      d="M30 34 H70 L66 50 H34 Z M32 50 H68 L64 66 H36 Z M34 66 H66 L60 82 H40 Z M40 82 H60 L50 96 Z"
      fill={kebabTheme.black}
    />
  </svg>
);

export const KebabLogo: React.FC<{ width?: number }> = ({ width = 760 }) => {
  const h = width * 0.4;
  const pad = h * 0.14;
  const iconBox = h - pad * 2;
  return (
    <div
      style={{
        width,
        height: h,
        background: kebabTheme.black,
        borderRadius: h * 0.22,
        border: `${Math.max(2, h * 0.012)}px solid ${kebabTheme.goldDeep}`,
        display: 'flex',
        alignItems: 'center',
        padding: pad,
        boxSizing: 'border-box',
        gap: pad,
        boxShadow: kebabTheme.glow,
      }}
    >
      <div
        style={{
          width: iconBox,
          height: iconBox,
          borderRadius: iconBox * 0.18,
          background: kebabTheme.goldGradientV,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <DonerIcon size={iconBox * 0.78} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 0.86 }}>
        <span
          style={{
            fontFamily: kebabFonts.display,
            fontSize: h * 0.4,
            letterSpacing: 1,
            background: kebabTheme.goldGradient,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          KEBAB <span style={{ fontSize: h * 0.24 }}>de</span> LYON
        </span>
        <span
          style={{
            fontFamily: kebabFonts.sans,
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: h * 0.16,
            color: kebabTheme.white,
            marginTop: h * 0.06,
          }}
        >
          Au goût unique
        </span>
      </div>
    </div>
  );
};
