/**
 * The two Orbit colour schemes, lifted verbatim from `renderVals()` in the design.
 * Every surface in the app reads from the object returned by `paletteFor()`, which the
 * design refers to throughout as `c`.
 *
 * `c` is the project's token layer. Beyond the original ground/surface/text roles it
 * carries semantic roles so components never hardcode a colour that only resolves in one
 * theme:
 *
 *   accent / accentText / accentSoft / accentSoftStrong / accentBorder / onAccent
 *   badgeBg / badgeText / pros / cons / hoverRing
 *   shadowCard / shadowMd / shadowLg / shadowToast / vignette / vignetteSoft
 *   shimmerMid / mediaBlend / mediaOpacity / preview / ctaPanel / logoGlow
 *
 * The DARK values are byte-identical to the colours that were previously inlined in the
 * components, so the dark theme renders exactly as it did before.
 */
export const DARK = {
  bg: '#0d1f23',
  bgRgb: '13,31,35',
  surface: '#132e35',
  surfaceAlt: '#1a3a42',
  chrome: '#16333b',
  ring: '#2d4a53',
  text: '#afb3b7',
  textRgb: '175,179,183',

  // --- semantic roles (see the block comment above) ---
  surfaceRgb: '19,46,53',
  glassBg: 'rgba(6,15,17,0.45)',
  glassBorder: 'rgba(175,179,183,0.24)',
  glassIcon: '#e3e7e9',
  glassShadow: '0 6px 18px rgba(0,0,0,0.4)',
  // The solid interactive colour flips polarity between themes: a light capsule on the
  // dark ground, a deep teal one on the light ground. `onAccent` is the ink that sits on
  // it, so the pair always clears contrast without either theme borrowing the other's.
  accent: '#afb3b7',
  accentText: '#c9d3d8',
  accentSoft: 'rgba(105,129,141,0.14)',
  accentSoftStrong: 'rgba(105,129,141,0.22)',
  accentBorder: 'rgba(105,129,141,0.45)',
  accentGlow: 'rgba(105,129,141,0.22)',
  onAccent: '#0d1f23',
  badgeBg: '#2d4a53',
  badgeText: '#d7dde0',
  pros: '#a8e0b8',
  cons: '#e0a8a8',
  star: '#f5b93f',
  hoverRing: '#3e606b',
  shadowCard: '0 16px 34px rgba(0,0,0,0.4)',
  shadowMd: '0 24px 60px rgba(0,0,0,0.4)',
  shadowLg: '0 30px 70px rgba(0,0,0,0.55)',
  shadowToast: '0 10px 30px rgba(0,0,0,0.5)',
  vignette: 'inset 0 0 60px rgba(0,0,0,0.4)',
  vignetteSoft: 'inset 0 0 60px rgba(0,0,0,0.35)',
  scrim: 'rgba(19,46,53,0.3)',
  scrimSoft: 'rgba(19,46,53,0.25)',
  scrimOverlay: 'rgba(6,15,17,0.72)',
  shimmerMid: '#1a3a42',
  mediaBlend: 'lighten',
  mediaOpacity: 0.5,
  preview: 'linear-gradient(135deg, #132e35, #2d4a53 50%, #132e35)',
  ctaPanel: 'linear-gradient(135deg, rgba(45,74,83,0.55), rgba(19,46,53,0.45))',
  matchPanel: 'linear-gradient(135deg, rgba(105,129,141,0.16), rgba(19,46,53,0.55))',
  verdictPanel: 'linear-gradient(135deg, rgba(45,74,83,0.45), rgba(19,46,53,0.55))',
  logoGlow: '0 0 10px rgba(105,129,141,0.35)',
};

export const LIGHT = {
  bg: '#eef1f2',
  bgRgb: '238,241,242',
  surface: '#fafbfb',
  surfaceAlt: '#e3e7e9',
  chrome: '#dce1e3',
  ring: '#c9d1d4',
  text: '#0d1f23',
  textRgb: '13,31,35',

  // --- semantic roles ---
  surfaceRgb: '250,251,251',
  glassBg: 'rgba(255,255,255,0.74)',
  glassBorder: 'rgba(13,31,35,0.16)',
  glassIcon: '#2d4a53',
  glassShadow: '0 6px 18px rgba(13,31,35,0.18)',
  accent: '#2d4a53',
  accentText: '#2d4a53',
  accentSoft: 'rgba(105,129,141,0.14)',
  accentSoftStrong: 'rgba(105,129,141,0.22)',
  accentBorder: 'rgba(45,74,83,0.40)',
  accentGlow: 'rgba(105,129,141,0.22)',
  onAccent: '#eef1f2',
  badgeBg: '#2d4a53',
  badgeText: '#eef1f2',
  pros: '#2e7d52',
  cons: '#b0453f',
  // A lighter gold washes out on the near-white ground; this clears 4.5:1 on it.
  star: '#b8790a',
  hoverRing: '#a9b6bc',
  // Shadows are tinted with the ink colour rather than pure black: black shadows go
  // grey and muddy over a light ground.
  shadowCard: '0 14px 30px rgba(13,31,35,0.12)',
  shadowMd: '0 20px 44px rgba(13,31,35,0.10)',
  shadowLg: '0 26px 60px rgba(13,31,35,0.14)',
  shadowToast: '0 10px 30px rgba(13,31,35,0.18)',
  vignette: 'inset 0 0 60px rgba(13,31,35,0.14)',
  vignetteSoft: 'inset 0 0 50px rgba(13,31,35,0.10)',
  // The card scrim fades the photo into the card surface; over a light surface it has
  // to fade toward light, not toward the dark-theme ground.
  scrim: 'rgba(250,251,251,0.30)',
  scrimSoft: 'rgba(250,251,251,0.24)',
  // A 72% near-black backdrop is far heavier over a light page than over a dark one.
  scrimOverlay: 'rgba(13,31,35,0.38)',
  shimmerMid: '#dfe4e6',
  // `lighten` keeps only pixels brighter than the ground, so on a near-white surface a
  // photo disappears entirely. `multiply` is its light-ground dual.
  mediaBlend: 'multiply',
  mediaOpacity: 0.38,
  preview: 'linear-gradient(135deg, #dce3e5, #c3cfd3 50%, #dce3e5)',
  ctaPanel: 'linear-gradient(135deg, rgba(105,129,141,0.18), rgba(105,129,141,0.06))',
  matchPanel: 'linear-gradient(135deg, rgba(105,129,141,0.20), rgba(250,251,251,0.9))',
  verdictPanel: 'linear-gradient(135deg, rgba(105,129,141,0.16), rgba(250,251,251,0.85))',
  logoGlow: '0 0 10px rgba(105,129,141,0.28)',
};

/**
 * Ink at an alpha, as `rgba(text, a)`.
 *
 * Every secondary text colour, border and hairline in the app is expressed as the ink
 * colour at some alpha. The same alpha does not carry the same weight in both themes:
 * light ink on the dark ground stays legible far lower than dark ink does on the light
 * ground, so light mode reads washed out at the alphas the dark design was tuned at.
 *
 * `ink()` is that correction in one place. Dark returns the alpha unchanged — the dark
 * theme renders exactly as before — and light lifts it, more so at the low end where
 * borders live.
 */
function makeInk(rgb, boost) {
  return (a) => `rgba(${rgb},${boost(a)})`;
}

const identity = (a) => a;
const lift = (a) => Math.round(Math.min(1, a < 0.25 ? a * 1.5 : a * 1.22) * 1000) / 1000;

DARK.ink = makeInk(DARK.textRgb, identity);
LIGHT.ink = makeInk(LIGHT.textRgb, lift);

export function paletteFor(theme) {
  return theme === 'light' ? LIGHT : DARK;
}

/** Brand accents that stay fixed across both themes. */
export const ACCENT = '#69818d';
export const ACCENT_BRIGHT = '#afb3b7';
export const ACCENT_DEEP = '#2d4a53';
export const ACCENT_RING = '#3e606b';
export const ON_ACCENT = '#0d1f23';
export const PROS = '#a8e0b8';
export const CONS = '#e0a8a8';

/** Breakpoints used by the design's responsive value table. */
export const MOBILE_MAX = 720;
export const TABLET_MAX = 1080;
export const DESKTOP_NAV_MIN = 860;
