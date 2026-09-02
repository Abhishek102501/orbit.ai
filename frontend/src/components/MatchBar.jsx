import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The match instrument.
 *
 * Orbit's whole claim is that it *measures* fit rather than listing tools, so the
 * score is drawn as a gauge rather than as a progress pill: a ruled scale with a
 * tick every 10%, a filled span, and a needle standing at the value. That is the
 * one place in the app allowed to use the `signal` hue — see lib/palette.js.
 *
 * The score comes from `engine.scoreTool()` by way of `quickMatch()`. Nothing here
 * computes or adjusts it; this only draws the number it is handed.
 *
 * `score` is 0-100. `labelId` associates the bar with whatever names it, so the
 * gauge reads as "Match, 87 percent" rather than as a bare number.
 */
export function MatchBar({ score, labelId, height = 16 }) {
  const { c } = useOrbit();
  const value = Math.max(0, Math.min(100, Number(score) || 0));

  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-labelledby={labelId}
      aria-valuetext={`${value}% match`}
      style={{ position: 'relative', height, width: '100%', flex: 1, minWidth: 90 }}
    >
      {/* Ruled scale: one hairline every 10% of the span. A gradient rather than
          ten elements, so the ruling costs nothing to render. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 4,
          height: height - 7,
          backgroundImage: `repeating-linear-gradient(to right, ${c.signalTick} 0 1px, transparent 1px 10%)`,
        }}
      />

      {/* Baseline — the full extent of the scale. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          borderRadius: 2,
          background: c.signalTrack,
        }}
      />

      {/* The measured span. Transitioned rather than keyframed so an interrupted
          re-run animates from wherever it currently stands; the global
          reduced-motion rule in index.css neutralises it. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 3,
          width: `${value}%`,
          borderRadius: 2,
          background: c.signal,
          transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* The needle: where the value actually falls on the scale. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: `${value}%`,
          bottom: 0,
          transform: 'translateX(-1px)',
          width: 2,
          height,
          background: c.signal,
          boxShadow: `0 0 8px ${c.signalGlow}`,
          transition: 'left 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </div>
  );
}

/**
 * The score itself, set in the mono face with tabular figures so the digits hold
 * their columns as results re-rank. The percent sign is set smaller and dimmer:
 * the number is the reading, the unit is not.
 */
export function MatchScore({ score, size, id, tone }) {
  const { c } = useOrbit();
  return (
    <span
      id={id}
      className="num"
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 1,
        fontSize: size,
        lineHeight: 1,
        fontWeight: 500,
        letterSpacing: '-0.03em',
        color: tone || c.signalInk,
      }}
    >
      {score}
      <span aria-hidden="true" style={{ fontSize: '0.44em', opacity: 0.6, fontWeight: 400 }}>
        %
      </span>
      <span className="sr-only"> percent match</span>
    </span>
  );
}

export default MatchBar;
