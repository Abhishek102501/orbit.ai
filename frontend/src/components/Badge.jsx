import Icon from './Icon.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The pill primitive: a small label with an optional leading mark.
 *
 * Three tones, and the distinction between them is meaning rather than decoration:
 *
 * - `signal` — something the engine measured or a live count from the catalog.
 * - `accent` — an interactive or primary-action label.
 * - `neutral` — plain metadata.
 *
 * Numeric content is set in the mono face by default, so a figure inside a badge
 * matches every other measured value on the site.
 */
export function Badge({ children, icon, tone = 'neutral', mono = true, style }) {
  const { c } = useOrbit();

  const tones = {
    signal: { fg: c.signalInk, bg: c.signalTrack, border: c.ink(0.14) },
    accent: { fg: c.accent, bg: c.ink(0.04), border: c.accent },
    neutral: { fg: c.ink(0.7), bg: c.ink(0.04), border: c.ink(0.14) },
  };
  const t = tones[tone] || tones.neutral;

  return (
    <span
      className={mono ? 'num' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 12px',
        borderRadius: 999,
        border: `1px solid ${t.border}`,
        background: t.bg,
        color: t.fg,
        fontSize: 10.5,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon ? (
        <span aria-hidden="true" style={{ display: 'flex' }}>
          <Icon name={icon} size={11} />
        </span>
      ) : null}
      {children}
    </span>
  );
}

export default Badge;
