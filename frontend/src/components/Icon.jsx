import { ICONS } from '../data/icons.js';

/**
 * Renders one of the primitive icon defs as an SVG on `currentColor`.
 * Equivalent to the design's `ic(name, size)` helper.
 */
export function Icon({ name, size = 16, style }) {
  const def = ICONS[name];
  if (!def) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={def.fill ? 'currentColor' : 'none'}
      stroke={def.fill ? 'none' : 'currentColor'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flex: 'none', ...style }}
      aria-hidden="true"
      focusable="false"
    >
      {def.els.map((el, i) => {
        const { t, ...rest } = el;
        const Tag = t;
        return <Tag key={i} {...rest} />;
      })}
    </svg>
  );
}

export default Icon;
