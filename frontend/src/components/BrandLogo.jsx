import { useState } from 'react';

/**
 * The Orbit wordmark.
 *
 * Renders the raster wordmark when one is configured (BRAND_LOGO_DARK /
 * BRAND_LOGO_LIGHT in lib/content.js), and the vector mark when one is not.
 *
 * `src` is empty by default because those PNGs have never existed in this repository.
 * Rendering an <img> with no usable source is not free: an empty `src` resolves against
 * the page URL, so the browser fetches the HTML document and hands it to the image
 * decoder. Checking the path first means no wasted request and no flash before the
 * fallback appears. Fill the constants in and the raster takes over automatically.
 *
 * See README.md → "Brand assets".
 */
export function BrandLogo({ src, height = 30, glow = '0 0 10px rgba(105,129,141,0.35)', color, markColor, accentColor }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
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

/**
 * Square mark used on the splash screen.
 *
 * Same rule as BrandLogo: `src` is empty until a real icon exists, and an empty source
 * means the vector below is drawn directly rather than after a failed fetch. The same
 * geometry is mirrored in public/orbit-mark.svg, which serves the browser tab icon.
 */
export function BrandMark({ height = 48, src = '' }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
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
