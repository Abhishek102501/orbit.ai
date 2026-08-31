import Icon from './Icon.jsx';
import BrandLogo from './BrandLogo.jsx';
import Hoverable from './Hoverable.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

export function Header() {
  const { c, layout, route, theme, logoSrc, isLight, toggleTheme, toggleMobileNav, saved } = useOrbit();

  const navColor = (name) => (route.name === name ? c.accentText : c.text);
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
        borderBottom: `1px solid ${c.ink(0.1)}`,
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
        <BrandLogo src={logoSrc} height={30} glow={c.logoGlow} color={c.text} markColor={c.accentText} />
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
          border: `1px solid ${c.ink(0.22)}`,
          borderRadius: 8,
          background: c.ink(0.05),
          color: c.ink(0.9),
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease',
        }}
        hoverStyle={{
          borderColor: c.accentBorder,
          background: c.accentSoftStrong,
          color: c.accentText,
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
              color: c.accentText,
              padding: '7px 14px',
              border: `1px solid ${c.accent}`,
              borderRadius: 8,
              background: c.accentSoft,
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
                  background: c.badgeBg,
                  color: c.badgeText,
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
          border: `1px solid ${c.ink(0.16)}`,
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
