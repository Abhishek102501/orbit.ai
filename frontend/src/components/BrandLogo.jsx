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
export function BrandLogo({ src, height = 30, glow = '0 0 10px rgba(105,129,141,0.35)', color, markColor, accentColor }) {
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

  return (
    <BrandLogoFallback
      height={height}
      glow={glow}
      color={color}
      markColor={markColor}
      accentColor={accentColor}
    />
  );
}

/**
 * Vector stand-in: orbit mark + wordmark, scaled to the requested pixel height.
 *
 * `color` is the wordmark ink. It has to follow the theme — the mark was previously
 * pinned to the dark-theme ink (#e9e9ed), which is why "Orbit" vanished against the
 * light ground while the purple ".ai" stayed visible.
 */
export function BrandLogoFallback({
  height = 30,
  glow = '0 0 10px rgba(105,129,141,0.35)',
  color = '#afb3b7',
  markColor = '#c9d3d8',
  accentColor = '#69818d',
}) {
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
        stroke={accentColor}
        strokeWidth="1.6"
        transform="rotate(-28 16 16)"
      />
      <circle cx="16" cy="16" r="5.2" fill={markColor} />
      <text
        x="38"
        y="22.5"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="-0.8"
        fill={color}
      >
        Orbit
        <tspan fill={accentColor}>.ai</tspan>
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
          filter: 'drop-shadow(0 0 16px rgba(105,129,141,0.5))',
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
        filter: 'drop-shadow(0 0 16px rgba(105,129,141,0.5))',
        animation: 'splashPulse 1.6s ease-in-out infinite',
      }}
    >
      <ellipse
        cx="16"
        cy="16"
        rx="14.5"
        ry="7"
        fill="none"
        stroke="#69818d"
        strokeWidth="1.8"
        transform="rotate(-28 16 16)"
      />
      <circle cx="16" cy="16" r="5.6" fill="#c9d3d8" />
    </svg>
  );
}

export default BrandLogo;
