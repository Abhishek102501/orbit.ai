import { useHover } from '../hooks/useHover.js';

/**
 * React stand-in for the design's `style-hover` attribute: renders `as` with `style`,
 * merging `hoverStyle` on top while the pointer (or keyboard focus) is on it.
 */
export function Hoverable({ as: Tag = 'div', style, hoverStyle, children, ...rest }) {
  const [hovered, bind] = useHover();
  return (
    <Tag {...rest} {...bind} style={hovered ? { ...style, ...hoverStyle } : style}>
      {children}
    </Tag>
  );
}

export default Hoverable;
