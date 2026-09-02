import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The section panel: a translucent surface over a blur, with a hairline edge and a
 * single bloom bleeding in from one corner.
 *
 * Both closing sections were building this chrome inline, which is why they drifted
 * apart. The point of the surface is depth, not decoration — one light source, one
 * edge, and nothing else — so the content on it is what the eye lands on.
 *
 * `overflow: clip` rather than `hidden` is load-bearing. `hidden` makes the panel a
 * scroll container, and a scroll container becomes the scrollport that
 * `animation-timeline: view()` resolves against — children then freeze part-way
 * through their reveal. `clip` still clips to the radius without that side effect.
 */
export function GlassPanel({
  children,
  padding,
  bloom = 'right',
  hairline = true,
  pattern = false,
  radius = 22,
  variant = 'card',
  style,
}) {
  const { c } = useOrbit();

  const bloomX = bloom === 'left' ? '12%' : bloom === 'center' ? '50%' : '88%';

  // Two ways of being a surface.
  //
  // `card` is a real container: a hard edge, a shadow, a filled ground. Use it when
  // the boundary is the point — when the content inside genuinely is a separate
  // object from the page.
  //
  // `flow` is a lit area rather than a box. There is no border and no shadow, and
  // the ground is a soft pool that fades out well before it reaches an edge, so the
  // section never resolves into a rectangle. Stacked, these read as one continuous
  // page with bright and quiet regions instead of a column of floating cards.
  // `flow` is not a surface at all - it is a padding box. Its parent owns the
  // ground, the light and the path, so anything painted here would be a second
  // environment nested inside the first, which is exactly what made these sections
  // read as separate slabs.
  const isFlow = variant === 'flow';
  const surface = isFlow
    ? {
        overflow: 'visible',
        borderRadius: 0,
        background: 'none',
        border: 'none',
        boxShadow: 'none',
      }
    : {
        overflow: 'clip',
        borderRadius: radius,
        background: `linear-gradient(152deg, rgba(${c.surfaceRgb},0.92), rgba(${c.surfaceRgb},0.5))`,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: `1px solid ${c.ink(0.1)}`,
        boxShadow: c.shadowMd,
      };

  return (
    <div
      style={{
        position: 'relative',
        padding,
        ...surface,
        ...style,
      }}
    >
      {/* A faint measured grid, faded out well before the edges so it never reads
          as a border. It gives large empty areas a texture, which is what stops
          them feeling unfinished rather than deliberate. */}
      {pattern && !isFlow ? (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `radial-gradient(${c.ink(0.07)} 1px, transparent 1px)`,
            backgroundSize: '26px 26px',
            maskImage: 'radial-gradient(80% 72% at 42% 38%, #000, transparent 76%)',
            WebkitMaskImage: 'radial-gradient(80% 72% at 42% 38%, #000, transparent 76%)',
          }}
        />
      ) : null}

      {bloom && !isFlow ? (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(85% 115% at ${bloomX} -10%, ${c.signalTrack}, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />
      ) : null}

      {hairline && !isFlow ? (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '12%',
            right: '12%',
            height: 1,
            background: `linear-gradient(90deg, transparent, ${c.signal}, transparent)`,
            opacity: 0.45,
            pointerEvents: 'none',
          }}
        />
      ) : null}

      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

export default GlassPanel;
