import Icon from './Icon.jsx';
import BrandLogo from './BrandLogo.jsx';
import Hoverable from './Hoverable.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { NAV_ACTIONS, NAV_ITEMS } from '../lib/content.js';

/**
 * One primary-nav entry. Real destinations render as anchors; the not-yet-built ones
 * render as buttons so a click cannot land on the 404 screen. Both share the same
 * styling, so wiring one up later is a data change in `NAV_ITEMS`, not a visual one.
 */
function NavItem({ item, active }) {
  const { c } = useOrbit();

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: 13.5,
    // index.css styles `nav a` as mono uppercase, which would apply to the real links
    // but not to the placeholder buttons beside them. Pin all six to the same treatment.
    fontFamily: 'Inter, system-ui, sans-serif',
    textTransform: 'none',
    letterSpacing: 'normal',
    lineHeight: 1,
    padding: '9px 13px',
    borderRadius: 999,
    border: '1px solid transparent',
    background: active ? c.ink(0.06) : 'transparent',
    color: active ? c.text : c.ink(0.66),
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease, background-color 0.2s ease',
  };
  const hover = { color: c.text, background: c.ink(0.07) };

  if (item.soon) {
    return (
      <Hoverable as="button" type="button" style={{ ...base }} hoverStyle={hover}>
        {item.label}
      </Hoverable>
    );
  }

  return (
    <Hoverable
      as="a"
      href={item.href}
      aria-current={active ? 'page' : undefined}
      style={base}
      hoverStyle={hover}
    >
      {item.label}
    </Hoverable>
  );
}

export function Header() {
  const {
    c,
    layout,
    route,
    theme,
    logoSrc,
    isLight,
    toggleTheme,
    toggleMobileNav,
    mobileNavOpen,
  } = useOrbit();

  const themeLabel = isLight ? 'Switch to dark mode' : 'Switch to light mode';

  const iconButton = {
    width: 36,
    height: 36,
    flex: 'none',
    border: `1px solid ${c.ink(0.16)}`,
    borderRadius: 999,
    background: c.ink(0.05),
    color: c.ink(0.9),
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease',
  };
  const iconButtonHover = {
    borderColor: c.accentBorder,
    background: c.accentSoftStrong,
    color: c.accentText,
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        padding: layout.navOuterPad,
        // The bar itself is transparent; the capsule inside carries the surface, so the
        // nav reads as floating over the page rather than as a docked strip.
        background: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          width: '100%',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: layout.navPillPad,
          borderRadius: 999,
          background: `rgba(${c.surfaceRgb},0.82)`,
          border: `1px solid ${c.ink(0.12)}`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: c.shadowCard,
        }}
      >
        <a
          href="#/"
          aria-label="Orbit.ai — home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            color: c.text,
            flex: 'none',
          }}
        >
          <BrandLogo
            src={logoSrc}
            height={26}
            glow={c.logoGlow}
            color={c.text}
            markColor={c.accentText}
            accentColor={c.accent}
          />
        </a>

        {layout.isDesktopNav ? (
          <nav
            aria-label="Primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              margin: '0 auto',
            }}
          >
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.label} item={item} active={!!item.match && route.name === item.match} />
            ))}
          </nav>
        ) : (
          <span style={{ marginLeft: 'auto' }} />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
          <Hoverable
            as="button"
            type="button"
            id="themeToggle"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
            style={iconButton}
            hoverStyle={iconButtonHover}
          >
            {/* keyed on the theme so the icon remounts and plays the swap animation */}
            <span key={theme} className="theme-toggle-icon" style={{ display: 'flex' }}>
              <Icon name={isLight ? 'moon' : 'sun'} size={17} />
            </span>
          </Hoverable>

          {layout.isDesktopNav ? (
            <>
              <Hoverable
                as="button"
                type="button"
                style={{
                  padding: '10px 14px',
                  borderRadius: 999,
                  border: '1px solid transparent',
                  background: 'transparent',
                  color: c.ink(0.72),
                  fontSize: 13.5,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease, background-color 0.2s ease',
                }}
                hoverStyle={{ color: c.text, background: c.ink(0.07) }}
              >
                {NAV_ACTIONS.signIn.label}
              </Hoverable>

              <Hoverable
                as="button"
                type="button"
                className="tf-cta"
                style={{
                  padding: '10px 18px',
                  borderRadius: 999,
                  border: `1px solid ${c.accent}`,
                  background: c.accent,
                  color: c.onAccent,
                  fontSize: 13.5,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'filter 0.2s ease',
                }}
                hoverStyle={{ filter: 'brightness(1.07)' }}
              >
                {NAV_ACTIONS.getStarted.label}
              </Hoverable>
            </>
          ) : null}

          <button
            type="button"
            className="nav-menu-btn"
            onClick={toggleMobileNav}
            aria-label="Open menu"
            aria-expanded={mobileNavOpen}
            style={{
              ...iconButton,
              display: layout.mobileMenuBtnDisplay,
              width: 38,
              height: 38,
              background: 'transparent',
              color: c.text,
            }}
          >
            <Icon name="menu" size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
