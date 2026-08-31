import { useMemo, useState } from 'react';

/**
 * The design expresses hover states with a `style-hover` attribute that the canvas runtime
 * merges over the base inline style. This is the React equivalent: spread `bind` onto the
 * element and merge `hoverStyle` yourself, or use the <Hoverable> wrapper.
 */
export function useHover() {
  const [hovered, setHovered] = useState(false);
  const bind = useMemo(
    () => ({
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setHovered(true),
      onBlur: () => setHovered(false),
    }),
    [],
  );
  return [hovered, bind];
}
