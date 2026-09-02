import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { NAV_ACTIONS } from '../lib/content.js';

export function MobileNav() {
  const { c, mobileNavOpen, toggleMobileNav, saved } = useOrbit();
  const closeRef = useRef(null);
  const restoreFocusTo = useRef(null);

  // While the drawer is open: hold the page still behind it, close on Escape, close if
  // the route changes some other way (browser back, a deep link), and park focus on the
  // close button so a keyboard or screen-reader user lands inside the drawer.
  useEffect(() => {
    if (!mobileNavOpen) return undefined;

    restoreFocusTo.current = document.activeElement;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') toggleMobileNav();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('hashchange', toggleMobileNav);

    const id = window.setTimeout(() => {
      if (closeRef.current) closeRef.current.focus();
    }, 0);

    return () => {
      body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('hashchange', toggleMobileNav);
      window.clearTimeout(id);
      const back = restoreFocusTo.current;
      if (back && typeof back.focus === 'function') back.focus();
    };
  }, [mobileNavOpen, toggleMobileNav]);

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
        aria-label="Site"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '78%',
          maxWidth: 320,
          background: c.surface,
          // Fixed to the viewport, so it sits outside the body's safe-area padding and
          // has to inset itself away from the notch and the home indicator.
          padding: 'calc(24px + env(safe-area-inset-top)) calc(22px + env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom)) 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          overflowY: 'auto',
          borderLeft: `1px solid ${c.ink(0.12)}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <button
            ref={closeRef}
            type="button"
            className="mobile-nav-close"
            onClick={toggleMobileNav}
            aria-label="Close menu"
            style={{
              width: 34,
              height: 34,
              border: `1px solid ${c.ink(0.16)}`,
              borderRadius: 8,
              background: c.ink(0.05),
              color: c.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
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
        <a href="#/saved" onClick={toggleMobileNav} style={link}>
          Saved{saved.length ? ' (' + saved.length + ')' : ''}
        </a>

        {/* Account actions mirror the desktop capsule. Inert until they are wired — see
            NAV_ACTIONS in lib/content.js. */}
        <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
          <button
            type="button"
            style={{
              minHeight: 44,
              borderRadius: 999,
              border: `1px solid ${c.ink(0.16)}`,
              background: 'transparent',
              color: c.text,
              fontSize: 14,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {NAV_ACTIONS.signIn.label}
          </button>
          <button
            type="button"
            style={{
              minHeight: 44,
              borderRadius: 999,
              border: `1px solid ${c.accent}`,
              background: c.accent,
              color: c.onAccent,
              fontSize: 14,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {NAV_ACTIONS.getStarted.label}
          </button>
        </div>
      </nav>
    </div>
  );
}

export default MobileNav;
