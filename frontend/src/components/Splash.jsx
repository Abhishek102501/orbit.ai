import BrandLogo, { BrandMark } from './BrandLogo.jsx';
import { DARK } from '../lib/palette.js';

/** Loading state shown until the catalog and stored preferences have resolved. */
export function Splash() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: DARK.bg,
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
            border: '1.5px solid rgba(145,132,217,0.2)',
            borderTopColor: '#9184d9',
            animation: 'orbitSpin 1.1s linear infinite',
          }}
        />
        <BrandMark height={48} />
      </div>

      <div style={{ animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}>
        <BrandLogo
          src="/assets/orbit-logo-full.png"
          height={26}
          glow="0 0 10px rgba(145,132,217,0.4)"
        />
      </div>

      <div
        style={{
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(233,233,237,0.4)',
        }}
      >
        Loading your AI ecosystem
      </div>
    </div>
  );
}

export default Splash;
