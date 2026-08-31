import BrandLogo from './BrandLogo.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

export function Footer() {
  const { c, layout, logoSrc } = useOrbit();

  const link = { textDecoration: 'none', fontSize: 13, color: c.ink(0.75) };

  return (
    <footer
      style={{
        borderTop: `1px solid ${c.ink(0.1)}`,
        padding: layout.footerPad,
        marginTop: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          display: 'flex',
          flexDirection: layout.footerDir,
          gap: 28,
          justifyContent: 'space-between',
        }}
      >
        <div style={{ maxWidth: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <BrandLogo src={logoSrc} height={26} glow={c.logoGlow} color={c.text} markColor={c.accentText} />
          </div>
          <p style={{ fontSize: 13, color: c.ink(0.55), lineHeight: 1.6, margin: 0 }}>
            A premium intelligent operating layer for discovering the AI ecosystem — deterministic
            recommendations, always explained.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: c.ink(0.45),
              }}
            >
              Product
            </span>
            <a href="#/discover" style={link}>Discover</a>
            <a href="#/advisor" style={link}>AI Advisor</a>
            <a href="#/categories" style={link}>Categories</a>
            <a href="#/compare" style={link}>Compare</a>
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: c.ink(0.35), margin: '28px 0 0' }}>
        © 2026 Orbit.ai — Find the right AI. Not just another AI.
      </p>
    </footer>
  );
}

export default Footer;
