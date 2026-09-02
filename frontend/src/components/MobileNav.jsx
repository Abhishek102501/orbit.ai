import { useCallback, useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { NAV_CTA, NAV_ITEMS, NAV_UTILITY } from '../lib/content.js';

const FOCUSABLE = 'a[href], button:not([disabled])';

export function MobileNav() {
  const { c, mobileNavOpen, toggleMobileNav, saved, compareIds } = useOrbit();
  const closeRef = useRef(null);
  const panelRef = useRef(null);
  const restoreFocusTo = useRef(null);

  // Tab stays inside the drawer while it is open. Without this the drawer looks
  // modal but the keyboard walks straight out into the page behind the scrim.
  const onPanelKeyDown = useCallback((e) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const items = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

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
        overscrollBehavior: 'contain',
      }}
      onClick={toggleMobileNav}
    >
      <nav
        ref={panelRef}
        onKeyDown={onPanelKeyDown}
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
          overscrollBehavior: 'contain',
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

        {/* Same three tiers as the desktop capsule, read from the same data, so the
            two surfaces cannot drift apart. */}
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} onClick={toggleMobileNav} style={link}>
            {item.label}
          </a>
        ))}

        {NAV_UTILITY.map((item) => {
          const n = item.count === 'saved' ? saved.length : compareIds.length;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={toggleMobileNav}
              style={{ ...link, display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span aria-hidden="true" style={{ display: 'flex', color: c.ink(0.55) }}>
                <Icon name={item.icon} size={15} />
              </span>
              {item.label}
              {n ? (
                <span
                  className="num"
                  style={{ marginLeft: 'auto', fontSize: 12, color: c.accent }}
                >
                  {n}
                  <span className="sr-only"> items</span>
                </span>
              ) : null}
            </a>
          );
        })}

        <div style={{ display: 'grid', gap: 10, marginTop: 22 }}>
          <a
            href={NAV_CTA.href}
            onClick={toggleMobileNav}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              minHeight: 46,
              borderRadius: 999,
              border: `1px solid ${c.accent}`,
              background: c.accent,
              color: c.onAccent,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {NAV_CTA.label}
            <Icon name="arrowRight" size={15} />
          </a>
        </div>
      </nav>
    </div>
  );
}

export default MobileNav;
