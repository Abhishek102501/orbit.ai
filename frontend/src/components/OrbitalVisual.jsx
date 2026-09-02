import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The figure beside the Advisor call to action: Orbit's mark at the centre of a
 * catalog turning around it.
 *
 * It is an orrery, not an ornament. Three rings carry one body each, at unrelated
 * periods and with negative start offsets, so the bodies are spread apart on the
 * first frame and the figure never settles into a recognisable pose. The scattered
 * specks an earlier version had are gone — they sat at arbitrary points and read as
 * noise. Everything drawn here is now on a ring or at the core.
 *
 * Depth comes from ordering rather than effects: a wide dashed ring furthest back, a
 * soft core disc, then the live rings, then the mark. Stroke opacity falls with
 * distance so the back of the figure recedes.
 *
 * Entirely decorative — hidden from assistive technology, and every loop stops under
 * `prefers-reduced-motion` (see `.orb-*` in index.css).
 */
export function OrbitalVisual({ size = 380 }) {
  const { c } = useOrbit();

  const rings = [
    { rx: 100, ry: 39, tilt: -22, spin: 'orb-spin-a', opacity: 0.62, dot: 5, delay: '-6s' },
    { rx: 88, ry: 64, tilt: 34, spin: 'orb-spin-b', opacity: 0.36, dot: 4, delay: '-27s' },
    { rx: 66, ry: 66, tilt: 0, spin: 'orb-spin-c', opacity: 0.2, dot: 3.5, delay: '-51s' },
  ];

  return (
    <div
      aria-hidden="true"
      style={{ position: 'relative', width: size, height: size, flex: 'none' }}
    >
      {/* Ambient bloom behind the figure, breathing very slowly. */}
      <div
        className="orb-glow"
        style={{
          position: 'absolute',
          inset: '16%',
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${c.signalGlow}, transparent 74%)`,
          filter: 'blur(38px)',
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 240 240"
        width="100%"
        height="100%"
        fill="none"
        style={{ position: 'relative', display: 'block', overflow: 'visible' }}
      >
        {/* Furthest back: a dashed boundary, turning slowest of all. */}
        <g className="orb-ring orb-spin-c" style={{ animationDelay: '-20s' }}>
          <circle
            cx="120"
            cy="120"
            r="114"
            stroke={c.ink(0.16)}
            strokeWidth="1"
            strokeDasharray="2 10"
          />
        </g>

        {/* The core, sitting under the rings so they pass in front of it. */}
        <circle cx="120" cy="120" r="46" fill={c.signal} opacity="0.05" />
        <circle cx="120" cy="120" r="34" fill={c.surface} opacity="0.7" />
        <circle cx="120" cy="120" r="34" stroke={c.ink(0.14)} strokeWidth="1" />

        {rings.map((ring) => (
          <g
            key={ring.spin}
            className={`orb-ring ${ring.spin}`}
            style={{ animationDelay: ring.delay }}
          >
            <g transform={`rotate(${ring.tilt} 120 120)`}>
              <ellipse
                cx="120"
                cy="120"
                rx={ring.rx}
                ry={ring.ry}
                stroke={c.signal}
                strokeOpacity={ring.opacity}
                strokeWidth="1"
              />
              <circle cx={120 + ring.rx} cy="120" r={ring.dot} fill={c.signal} opacity="0.9" />
            </g>
          </g>
        ))}

        {/* The mark, drawn last so nothing crosses in front of it. */}
        <g transform="rotate(-28 120 120)">
          <ellipse cx="120" cy="120" rx="22" ry="10.5" stroke={c.signal} strokeWidth="1.8" />
        </g>
        <circle cx="120" cy="120" r="8" fill={c.signal} />
      </svg>
    </div>
  );
}

export default OrbitalVisual;
