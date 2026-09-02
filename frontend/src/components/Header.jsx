import Icon from './Icon.jsx';
import BrandLogo from './BrandLogo.jsx';
import Hoverable from './Hoverable.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { NAV_CTA, NAV_ITEMS, NAV_UTILITY } from '../lib/content.js';

/**
 * One primary-nav entry.
 *
 * Every entry is a real link now. The previous version carried a `soon` branch that
 * rendered destination-less items as inert buttons; nothing is marked `soon` any
 * more, so the branch is gone rather than left behind as unused logic.
 */
function NavItem({ item, active }) {
  const { c } = useOrbit();

  return (
    <Hoverable
      as="a"
      href={item.href}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: 13.5,
        // index.css styles `nav a` as mono uppercase; the header wants sentence case.
        fontFamily: 'Inter, system-ui, sans-serif',
        textTransform: 'none',
        letterSpacing: 'normal',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: 8,
        background: 'transparent',
        fontWeight: active ? 600 : 500,
        color: active ? c.text : c.ink(0.7),
        whiteSpace: 'nowrap',
        transition: 'color 0.2s ease, background-color 0.2s ease',
      }}
      hoverStyle={{ color: c.text, background: c.ink(0.06) }}
    >
      {item.label}
    </Hoverable>
  );
}

/**
 * Saved and Compare: the visitor's own working set.
 *
 * Icon-first and quieter than the CTA on purpose — these are somewhere you keep
 * things, not the action the header is asking for. The count appears only once there
 * is something to count, so an untouched session shows two plain icons rather than a
 * pair of zeroes.
 *
 * The label is carried by `aria-label` and `title` rather than visible text, so the
 * icon is never the only thing naming the destination.
 */
function UtilityAction({ item, count, active }) {
  const { c } = useOrbit();
  const label = count
    ? `${item.label} (${count} ${count === 1 ? 'item' : 'items'})`
    : item.label;

  return (
    <Hoverable
      as="a"
      href={item.href}
      aria-label={label}
      title={label}
      aria-current={active ? 'page' : undefined}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 36,
        padding: count ? '0 11px' : '0 9px',
        borderRadius: 999,
        textDecoration: 'none',
        border: `1px solid ${active ? c.ink(0.18) : 'transparent'}`,
        background: active ? c.ink(0.06) : 'transparent',
        color: active ? c.text : c.ink(0.72),
        flex: 'none',
        transition: 'color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
      }}
      hoverStyle={{ color: c.text, background: c.ink(0.07) }}
    >
      <Icon name={item.icon} size={17} />
      {count ? (
        <span className="num" aria-hidden="true" style={{ fontSize: 11.5, color: c.accent }}>
          {count}
        </span>
      ) : null}
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
    saved,
    compareIds,
  } = useOrbit();

  const themeLabel = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  const counts = { saved: saved.length, compare: compareIds.length };

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
        // nav floats over the page at every scroll position.
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
          background: `rgba(${c.surfaceRgb},0.86)`,
          border: `1px solid ${c.ink(0.1)}`,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: c.shadowCard,
        }}
      >
        {/* The wordmark is the Home link — which is why Home is not in the nav. */}
        <a
          href="#/"
          aria-label="Orbit.ai — home"
          aria-current={route.name === 'home' ? 'page' : undefined}
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
            style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto' }}
          >
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.href} item={item} active={route.name === item.match} />
            ))}
          </nav>
        ) : (
          <span style={{ marginLeft: 'auto' }} />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 'none' }}>
          {layout.isDesktopNav ? (
            <>
              {NAV_UTILITY.map((item) => (
                <UtilityAction
                  key={item.href}
                  item={item}
                  count={counts[item.count]}
                  active={route.name === item.match}
                />
              ))}

              {/* Separates the visitor's own state from the page's action. */}
              <span
                aria-hidden="true"
                style={{ width: 1, height: 20, background: c.ink(0.12), margin: '0 4px' }}
              />
            </>
          ) : null}

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
            <a
              href={NAV_CTA.href}
              className="tf-cta cta-lift"
              aria-current={route.name === NAV_CTA.match ? 'page' : undefined}
              style={{
                marginLeft: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '10px 18px',
                borderRadius: 999,
                border: `1px solid ${c.accent}`,
                background: c.accent,
                color: c.onAccent,
                fontSize: 13.5,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                textDecoration: 'none',
              }}
            >
              {NAV_CTA.label}
              <span className="tf-arrow" style={{ display: 'flex' }}>
                <Icon name="arrowRight" size={14} />
              </span>
            </a>
          ) : null}

          <Hoverable
            as="button"
            type="button"
            className="nav-menu-btn"
            hoverStyle={iconButtonHover}
            onClick={toggleMobileNav}
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
            aria-haspopup="dialog"
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
          </Hoverable>
        </div>
      </div>
    </header>
  );
}

export default Header;
