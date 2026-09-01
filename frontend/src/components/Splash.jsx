import BrandLogo, { BrandMark } from './BrandLogo.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * Loading state shown until the catalog and stored preferences have resolved. It paints
 * its own full-screen ground, so it reads the palette rather than the dark scheme —
 * otherwise a light-mode visitor gets a dark screen before the app appears.
 */
export function Splash() {
  const { c, logoSrc } = useOrbit();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: c.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 110,
          height: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `1.5px solid ${c.accentSoftStrong}`,
            borderTopColor: c.accent,
            animation: 'orbitSpin 1.1s linear infinite',
          }}
        />
        <BrandMark height={48} />
      </div>

      <div style={{ animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}>
        <BrandLogo src={logoSrc} height={26} glow={c.logoGlow} color={c.text} markColor={c.accentText} accentColor={c.accent} />
      </div>

      <div
        style={{
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: c.ink(0.45),
        }}
      >
        Loading your AI ecosystem
      </div>
    </div>
  );
}

export default Splash;
