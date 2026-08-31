import Icon from './Icon.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

export function MobileNav() {
  const { c, mobileNavOpen, toggleMobileNav, saved } = useOrbit();
  if (!mobileNavOpen) return null;

  const link = {
    textDecoration: 'none',
    color: c.text,
    fontSize: 16,
    padding: '12px 6px',
    borderBottom: `1px solid ${c.ink(0.08)}`,
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: c.scrimOverlay,
        backdropFilter: 'blur(6px)',
      }}
      onClick={toggleMobileNav}
    >
      <nav
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '78%',
          maxWidth: 320,
          background: c.surface,
          padding: '24px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          borderLeft: `1px solid ${c.ink(0.12)}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <button
            type="button"
            onClick={toggleMobileNav}
            aria-label="Close"
            style={{
              width: 34,
              height: 34,
              border: `1px solid ${c.ink(0.16)}`,
              borderRadius: 8,
              background: 'transparent',
              color: c.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <a href="#/discover" onClick={toggleMobileNav} style={link}>
          Discover
        </a>
        <a
          href="#/advisor"
          onClick={toggleMobileNav}
          style={{ ...link, color: c.accentText, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Icon name="sparkle" size={13} />
          AI Advisor
        </a>
        <a href="#/categories" onClick={toggleMobileNav} style={link}>
          Categories
        </a>
        <a href="#/compare" onClick={toggleMobileNav} style={link}>
          Compare
        </a>
        <a
          href="#/saved"
          onClick={toggleMobileNav}
          style={{ ...link, borderBottom: 'none' }}
        >
          Saved{saved.length ? ' (' + saved.length + ')' : ''}
        </a>
      </nav>
    </div>
  );
}

export default MobileNav;
