import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../Icon.jsx';
import Hoverable from '../Hoverable.jsx';
import { useOrbit } from '../../store/OrbitProvider.jsx';
import { prefersReducedMotion } from '../../lib/motion.js';

/**
 * A horizontal run of cards the reader drives.
 *
 * Deliberately not auto-scrolling. These sections carry release names and dates that
 * take a moment to read, and a rail that moves on its own takes that moment away.
 * The marquee on the home page can drift because nothing there needs reading; this
 * cannot.
 *
 * Scrolling itself is native — the row is a scroll container with snap points, so it
 * already works with a trackpad, a touch drag and a shift-wheel. The buttons exist
 * for pointer users on a mouse, and they disable at each end rather than sitting
 * there doing nothing.
 */
export function ScrollRail({ children, ariaLabel, itemWidth = 260 }) {
  const { c } = useOrbit();
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft >= max - 1 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      if (ro) ro.disconnect();
    };
  }, [measure]);

  const nudge = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({
      left: dir * (itemWidth + 14) * 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        tabIndex={0}
        className="rail-scroller"
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          scrollSnapType: 'x proximity',
          // Room for the lift on hover, so a raised card is not clipped by the
          // scroll container's own edge.
          padding: '4px 2px 10px',
        }}
      >
        {children}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
        <RailNav c={c} label="Scroll left" icon="chevronLeft" disabled={edges.start} onClick={() => nudge(-1)} />
        <RailNav c={c} label="Scroll right" icon="chevronRight" disabled={edges.end} onClick={() => nudge(1)} />
      </div>
    </div>
  );
}

function RailNav({ c, label, icon, onClick, disabled }) {
  return (
    <Hoverable
      as="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${c.ink(0.14)}`,
        background: 'transparent',
        color: disabled ? c.ink(0.28) : c.ink(0.72),
        cursor: disabled ? 'default' : 'pointer',
        transition: 'color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
      }}
      hoverStyle={
        disabled ? undefined : { color: c.text, borderColor: c.signal, background: c.signalTrack }
      }
    >
      <Icon name={icon} size={13} />
    </Hoverable>
  );
}

export default ScrollRail;
