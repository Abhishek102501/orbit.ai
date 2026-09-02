import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The shared environment for the closing discovery run.
 *
 * Its children — the Advisor call to action and the contribution section — own only
 * their content. This owns everything that has to be continuous across both of them:
 * the background, the ambient light, the vertical rhythm, and the single path that
 * travels from one to the other.
 *
 * That division is the whole point. The previous version gave each section its own
 * absolutely-positioned connector inside its own `<section>`, which meant two
 * unrelated coordinate systems and a line that stopped 158px short of anything. A
 * path cannot join two boxes it does not share a space with.
 *
 * ── how the path is built ──────────────────────────────────────────────────
 * Rather than guessing at percentages, it measures. A descendant marked
 * `data-flow-from` is the origin (the orbital figure) and one marked `data-flow-to`
 * is the destination (the first timeline node). Both are measured relative to this
 * wrapper, and the curve is drawn between them in real pixels — the SVG's viewBox
 * matches its box exactly, so nothing is stretched and the stroke stays true. The
 * earlier version used `preserveAspectRatio="none"` over a 100-unit viewBox, which
 * scaled x 12x more than y and flattened the curve into a stray horizontal line.
 *
 * Geometry is recomputed only on resize. It is never animated: the reveal animates
 * `stroke-dashoffset` alone, so the line draws itself along a path that never moves.
 */
export function DiscoveryFlow({ children, gap }) {
  const { c } = useOrbit();
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const [geom, setGeom] = useState(null);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const from = wrap.querySelector('[data-flow-from]');
    const to = wrap.querySelector('[data-flow-to]');
    if (!from || !to) {
      setGeom(null);
      return;
    }

    const w = wrap.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const z = to.getBoundingClientRect();

    // Leave from the underside of the figure, arrive at the top of the node.
    const x1 = a.left - w.left + a.width / 2;
    const y1 = a.bottom - w.top;
    const x2 = z.left - w.left + z.width / 2;
    const y2 = z.top - w.top;

    // Both control points pulled vertically, so the curve leaves and arrives
    // travelling straight down and never doubles back on itself.
    const pull = Math.max(48, (y2 - y1) * 0.55);
    const d = `M ${x1} ${y1} C ${x1} ${y1 + pull}, ${x2} ${y2 - pull}, ${x2} ${y2}`;

    setGeom({ w: Math.round(w.width), h: Math.round(w.height), d, x2, y2 });
  }, []);

  useLayoutEffect(() => {
    measure();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return undefined;
    // Content height changes with the viewport (wrapping copy, stacking columns),
    // so the anchors are re-read whenever the region resizes.
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [measure]);

  // The dash length has to be the real arc length, or the reveal either starts
  // part-drawn or never finishes.
  useEffect(() => {
    const el = pathRef.current;
    if (!el || !geom) return;
    const len = Math.ceil(el.getTotalLength());
    el.style.setProperty('--len', len);
  }, [geom]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        // One ground for both sections instead of two. Nothing here resolves into an
        // edge: every layer is transparent well before it reaches a boundary.
        background:
          `radial-gradient(46% 30% at 74% 22%, ${c.signalTrack}, transparent 100%),`
          + `radial-gradient(50% 34% at 24% 74%, ${c.accentSoft}, transparent 100%),`
          + `radial-gradient(60% 46% at 50% 50%, rgba(${c.surfaceRgb},0.45), transparent 100%)`,
      }}
    >
      {/* The measured grid, spanning the whole region rather than restarting inside
          each section. Faded out well before the edges. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `radial-gradient(${c.ink(0.06)} 1px, transparent 1px)`,
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(62% 46% at 50% 50%, #000, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(62% 46% at 50% 50%, #000, transparent 100%)',
        }}
      />

      {geom ? (
        <svg
          aria-hidden="true"
          width={geom.w}
          height={geom.h}
          viewBox={`0 0 ${geom.w} ${geom.h}`}
          fill="none"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
        >
          <defs>
            <linearGradient id="flow-stroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.signal} stopOpacity="0.15" />
              <stop offset="22%" stopColor={c.signal} stopOpacity="0.55" />
              <stop offset="100%" stopColor={c.signal} stopOpacity="0.75" />
            </linearGradient>
          </defs>
          <path
            ref={pathRef}
            className="flow-path"
            d={geom.d}
            stroke="url(#flow-stroke)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          {/* Sits exactly on the arrival point, so the line visibly lands on the
              first step rather than fading out near it. */}
          <circle className="flow-node" cx={geom.x2} cy={geom.y2} r="3" fill={c.signal} />
        </svg>
      ) : null}

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap }}>{children}</div>
    </div>
  );
}

export default DiscoveryFlow;
