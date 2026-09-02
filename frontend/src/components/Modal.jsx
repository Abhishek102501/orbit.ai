import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon.jsx';
import Hoverable from './Hoverable.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog: Escape and backdrop close it, focus moves in on open and returns to
 * whatever opened it on close, Tab cycles inside, and the page behind stops scrolling.
 *
 * Rendered through a portal on purpose. Sections on this site carry a reveal transform,
 * and a transformed ancestor makes `position: fixed` resolve against that ancestor
 * instead of the viewport — the dialog would be trapped inside its section.
 */
export function Modal({ open, onClose, title, description, labelId, children }) {
  const describedId = description ? `${labelId}-description` : undefined;
  const { c, layout } = useOrbit();
  const panelRef = useRef(null);
  const returnFocusRef = useRef(null);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
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
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return undefined;

    returnFocusRef.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const raf = requestAnimationFrame(() => {
      if (!panelRef.current) return;
      // Land on the first field rather than the close button, which is earlier in the
      // DOM: a dialog that opens with "close" focused reads as a dead end.
      const el =
        panelRef.current.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])') ||
        panelRef.current.querySelector(FOCUSABLE);
      if (el) el.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = overflow;
      const back = returnFocusRef.current;
      if (back && typeof back.focus === 'function') back.focus();
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: layout.isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: layout.isMobile ? 0 : 24,
        background: c.scrimOverlay,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        // Scrolling inside the dialog must not chain through to the page behind it.
        overscrollBehavior: 'contain',
        animation: 'fadeUp 0.2s ease both',
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={describedId}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 560,
          maxHeight: layout.isMobile ? '92vh' : '88vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          background: c.surface,
          border: `1px solid ${c.accentBorder}`,
          borderRadius: layout.isMobile ? '18px 18px 0 0' : 18,
          boxShadow: `0 0 0 1px ${c.ring}, ${c.shadowLg}`,
          padding: layout.isMobile ? '24px 20px 28px' : '30px 32px 32px',
          animation: 'modalIn 0.28s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: `radial-gradient(120% 130% at 50% -20%, ${c.accentSoft}, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 id={labelId} style={{ fontSize: 21, margin: 0, letterSpacing: '-0.02em' }}>
                {title}
              </h2>
              {description ? (
                <p
                  id={describedId}
                  style={{ fontSize: 13.5, lineHeight: 1.55, color: c.ink(0.62), margin: '8px 0 0' }}
                >
                  {description}
                </p>
              ) : null}
            </div>
            <Hoverable
              as="button"
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 34,
                height: 34,
                flex: 'none',
                borderRadius: 9,
                border: `1px solid ${c.ink(0.16)}`,
                background: c.ink(0.04),
                color: c.ink(0.75),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
              }}
              hoverStyle={{ color: c.text, borderColor: c.accentBorder, background: c.accentSoft }}
            >
              <Icon name="close" size={16} />
            </Hoverable>
          </div>

          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
