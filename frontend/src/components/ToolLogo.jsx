import { useState } from 'react';

/**
 * The tool avatar: initials underneath, the site's favicon laid over the top.
 * If the favicon fails to load it is hidden and the initials show through — exactly the
 * `onerror="this.style.display='none'"` behaviour in the design.
 */
export function ToolLogo({ initials, logoUrl, size = 42, radius = 10, fontSize = 14, style }) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: 'rgba(145,132,217,0.14)',
        color: '#b5abfc',
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
