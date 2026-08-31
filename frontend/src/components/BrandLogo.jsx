import { useState } from 'react';

/**
 * The Orbit wordmark.
 *
 * Renders `/assets/orbit-logo-full.png` (or the light-theme variant). Those PNGs live in
 * the Claude Design project and could not be exported through the design API, so until
 * they are dropped into `public/assets/` this falls back to a vector stand-in at the same
 * height. Drop the real files in and they take over automatically — no code change.
 *
 * See README.md → "Brand assets".
 */
export function BrandLogo({ src, height = 30, glow = '0 0 10px rgba(145,132,217,0.35)' }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={src}
        alt="Orbit.ai"
        onError={() => setFailed(true)}
        style={{ height, width: 'auto', filter: `drop-shadow(${glow})` }}
      />
    );
  }

  return <BrandLogoFallback height={height} glow={glow} />;
}

/** Vector stand-in: orbit mark + wordmark, scaled to the requested pixel height. */
export function BrandLogoFallback({ height = 30, glow = '0 0 10px rgba(145,132,217,0.35)' }) {
  return (
    <svg
      viewBox="0 0 132 32"
      height={height}
      width={height * (132 / 32)}
      role="img"
      aria-label="Orbit.ai"
      style={{ display: 'block', filter: `drop-shadow(${glow})`, overflow: 'visible' }}
    >
      <ellipse
        cx="16"
        cy="16"
        rx="14.5"
        ry="7"
        fill="none"
        stroke="#9184d9"
        strokeWidth="1.6"
        transform="rotate(-28 16 16)"
      />
      <circle cx="16" cy="16" r="5.2" fill="#b5abfc" />
      <text
        x="38"
        y="22.5"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="-0.8"
        fill="#e9e9ed"
      >
        Orbit
        <tspan fill="#9184d9">.ai</tspan>
      </text>
    </svg>
  );
}

/** Square mark used on the splash screen. */
export function BrandMark({ height = 48 }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src="/assets/orbit-mark-icon.png"
        alt=""
        onError={() => setFailed(true)}
        style={{
          height,
          width: 'auto',
          filter: 'drop-shadow(0 0 16px rgba(145,132,217,0.5))',
          animation: 'splashPulse 1.6s ease-in-out infinite',
        }}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 32 32"
      height={height}
      width={height}
      aria-hidden="true"
      style={{
        display: 'block',
        filter: 'drop-shadow(0 0 16px rgba(145,132,217,0.5))',
        animation: 'splashPulse 1.6s ease-in-out infinite',
      }}
    >
      <ellipse
        cx="16"
        cy="16"
        rx="14.5"
        ry="7"
        fill="none"
        stroke="#9184d9"
        strokeWidth="1.8"
        transform="rotate(-28 16 16)"
      />
      <circle cx="16" cy="16" r="5.6" fill="#b5abfc" />
    </svg>
  );
}

export default BrandLogo;
