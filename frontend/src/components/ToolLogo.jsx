import { useState } from 'react';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The tool avatar: initials underneath, the site's favicon laid over the top.
 * If the favicon fails to load it is hidden and the initials show through — exactly the
 * `onerror="this.style.display='none'"` behaviour in the design.
 */
export function ToolLogo({ initials, logoUrl, size = 42, radius = 10, fontSize = 14, style }) {
  const { c } = useOrbit();
  const [failed, setFailed] = useState(false);

  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: c.accentSoftStrong,
        color: c.accentText,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize,
        flex: 'none',
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {initials}
      {logoUrl && !failed ? (
        <img
          src={logoUrl}
          onError={() => setFailed(true)}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            background: '#f3f5fe',
          }}
          alt=""
        />
      ) : null}
    </span>
  );
}

export default ToolLogo;
