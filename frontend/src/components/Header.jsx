import Icon from './Icon.jsx';
import BrandLogo from './BrandLogo.jsx';
import Hoverable from './Hoverable.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

export function Header() {
  const { c, layout, route, theme, logoSrc, isLight, toggleTheme, toggleMobileNav, saved } = useOrbit();

  const navColor = (name) => (route.name === name ? '#b5abfc' : c.text);
  const themeLabel = isLight ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: layout.navPadding,
        background: `rgba(${c.bgRgb},0.82)`,
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid rgba(${c.textRgb},0.1)`,
      }}
    >
      <a
        href="#/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
          color: c.text,
          marginRight: 'auto',
        }}
      >
        <BrandLogo src={logoSrc} height={30} glow="0 0 10px rgba(145,132,217,0.35)" />
      </a>

      <Hoverable
        as="button"
        type="button"
        id="themeToggle"
        onClick={toggleTheme}
        aria-label={themeLabel}
        title={themeLabel}
        style={{
          width: 36,
          height: 36,
          flex: 'none',
          border: `1px solid rgba(${c.textRgb},0.22)`,
          borderRadius: 8,
          background: `rgba(${c.textRgb},0.05)`,
          color: `rgba(${c.textRgb},0.9)`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease',
        }}
        hoverStyle={{
          borderColor: 'rgba(145,132,217,0.55)',
          background: 'rgba(145,132,217,0.12)',
          color: '#9184d9',
        }}
      >
        {/* keyed on the theme so the icon remounts and plays the swap animation */}
        <span key={theme} className="theme-toggle-icon" style={{ display: 'flex' }}>
          <Icon name={isLight ? 'moon' : 'sun'} size={17} />
        </span>
      </Hoverable>

      {layout.isDesktopNav ? (
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#/discover" style={{ textDecoration: 'none', fontSize: 14, color: navColor('discover') }}>
            Discover
          </a>
          <a
            href="#/advisor"
            style={{
              textDecoration: 'none',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              color: '#9184d9',
              padding: '7px 14px',
              border: '1px solid #9184d9',
              borderRadius: 8,
              background: 'rgba(145,132,217,0.1)',
            }}
          >
            <Icon name="sparkle" size={13} />
            AI Advisor
          </a>
          <a href="#/categories" style={{ textDecoration: 'none', fontSize: 14, color: navColor('categories') }}>
            Categories
          </a>
          <a href="#/compare" style={{ textDecoration: 'none', fontSize: 14, color: navColor('compare') }}>
            Compare
          </a>
          <a
            href="#/saved"
            style={{
              textDecoration: 'none',
              fontSize: 14,
              color: navColor('saved'),
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Saved
            {saved.length > 0 ? (
              <span
                style={{
                  fontSize: 10,
                  background: '#423a6a',
                  color: '#f5f4ff',
                  borderRadius: 10,
                  padding: '1px 6px',
                  fontWeight: 600,
                }}
              >
                {saved.length}
              </span>
            ) : null}
          </a>
        </nav>
      ) : null}

      <button
        type="button"
        onClick={toggleMobileNav}
        aria-label="Menu"
        style={{
          display: layout.mobileMenuBtnDisplay,
          width: 38,
          height: 38,
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid rgba(${c.textRgb},0.16)`,
          borderRadius: 8,
          background: 'transparent',
          color: c.text,
          cursor: 'pointer',
        }}
      >
        <Icon name="menu" size={18} />
      </button>
    </header>
  );
}

export default Header;
