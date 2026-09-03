import { useOrbit } from '../../store/OrbitProvider.jsx';

/**
 * The breaking-news strip.
 *
 * One list, rendered twice, translated by exactly -50%: at the moment the animation
 * wraps, the second copy sits precisely where the first began, so the loop has no
 * seam. Duplicating once is the minimum needed for that — a third copy would only
 * add DOM.
 *
 * The track moves with `transform` alone, which the compositor can run without
 * touching layout. It pauses on hover and on keyboard focus, and stops entirely
 * under `prefers-reduced-motion`, where a permanently moving line of text is exactly
 * what the preference is asking us not to draw.
 *
 * The duplicate is hidden from assistive technology so the headlines are announced
 * once, not twice.
 */
export function NewsTicker({ items, label = 'Breaking' }) {
  const { c } = useOrbit();
  if (!items.length) return null;

  const Row = ({ clone }) => (
    <ul
      aria-hidden={clone || undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 34,
        listStyle: 'none',
        margin: 0,
        padding: '0 17px',
        flex: 'none',
      }}
    >
      {items.map((item) => (
        <li
          key={(clone ? 'c-' : '') + item.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 34,
            fontSize: 13,
            color: c.ink(0.7),
            whiteSpace: 'nowrap',
          }}
        >
          {item.label}
          <span aria-hidden="true" style={{ color: c.signal, opacity: 0.5 }}>
            •
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        borderTop: `1px solid ${c.ink(0.1)}`,
        borderBottom: `1px solid ${c.ink(0.1)}`,
        padding: '11px 0',
        overflow: 'hidden',
      }}
    >
      <span
        className="num"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          flex: 'none',
          paddingLeft: 2,
          fontSize: 10.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: c.signalInk,
        }}
      >
        <span
          aria-hidden="true"
          className="ticker-dot"
          style={{ width: 6, height: 6, borderRadius: '50%', background: c.signal }}
        />
        {label}
      </span>

      {/* The mask stops headlines appearing and vanishing at a hard edge. */}
      <div
        className="ticker-window"
        style={{
          position: 'relative',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          maskImage: 'linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)',
        }}
      >
        <div className="ticker-track" style={{ display: 'flex', width: 'max-content' }}>
          <Row />
          <Row clone />
        </div>
      </div>
    </div>
  );
}

export default NewsTicker;
