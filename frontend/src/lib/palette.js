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
  bg: '#161826',
  bgRgb: '22,24,38',
  surface: '#1c1f2e',
  surfaceAlt: '#232532',
  chrome: '#20222f',
  ring: '#3f424d',
  text: '#e9e9ed',
  textRgb: '233,233,237',

  // --- semantic roles (see the block comment above) ---
  surfaceRgb: '28,31,46',
  // Glass chip that sits on top of a photo. Fixed values rather than palette surfaces:
  // it has to stay legible over whatever the photograph is doing underneath it.
  glassBg: 'rgba(12,13,20,0.45)',
  glassBorder: 'rgba(255,255,255,0.22)',
  glassIcon: '#f1f0f7',
  glassShadow: '0 6px 18px rgba(0,0,0,0.35)',
  accent: '#9184d9',
  accentText: '#b5abfc',
  accentSoft: 'rgba(145,132,217,0.10)',
  accentSoftStrong: 'rgba(145,132,217,0.14)',
  accentBorder: 'rgba(145,132,217,0.35)',
  onAccent: '#161826',
  badgeBg: '#423a6a',
  badgeText: '#f5f4ff',
  pros: '#a8e0b8',
  cons: '#e0a8a8',
  hoverRing: '#5d5294',
  shadowCard: '0 16px 34px rgba(0,0,0,0.4)',
  shadowMd: '0 24px 60px rgba(0,0,0,0.4)',
  shadowLg: '0 30px 70px rgba(0,0,0,0.55)',
  shadowToast: '0 10px 30px rgba(0,0,0,0.5)',
  vignette: 'inset 0 0 60px rgba(0,0,0,0.4)',
  vignetteSoft: 'inset 0 0 60px rgba(0,0,0,0.35)',
  shimmerMid: '#262a3c',
  mediaBlend: 'lighten',
  mediaOpacity: 0.5,
  scrim: 'rgba(28,31,46,0.3)',
  scrimSoft: 'rgba(28,31,46,0.25)',
  scrimOverlay: 'rgba(10,11,18,0.7)',
  preview: 'linear-gradient(135deg, #2a2550, #423a6a 50%, #2a2550)',
  ctaPanel: 'linear-gradient(135deg, rgba(38,42,96,0.55), rgba(35,37,50,0.4))',
  matchPanel: 'linear-gradient(135deg, rgba(145,132,217,0.12), rgba(35,37,50,0.5))',
  verdictPanel: 'linear-gradient(135deg, rgba(38,42,96,0.4), rgba(35,37,50,0.5))',
  logoGlow: '0 0 10px rgba(145,132,217,0.35)',
};

export const LIGHT = {
  bg: '#f2f1f7',
  bgRgb: '242,241,247',
  surface: '#fbfafd',
  surfaceAlt: '#eeecf4',
  chrome: '#e3e0ec',
  ring: '#d3cee6',
  text: '#1c1a24',
  textRgb: '32,29,42',

  // --- semantic roles ---
  // `accent` stays the brand purple in both themes because it is only ever used as a
  // fill or a border. Accent *text* needs its own value: #b5abfc reads at ~1.9:1 on
  // this ground, so light mode uses a deepened purple that clears 4.5:1.
  surfaceRgb: '251,250,253',
  glassBg: 'rgba(255,255,255,0.74)',
  glassBorder: 'rgba(28,26,36,0.16)',
  glassIcon: '#453a86',
  glassShadow: '0 6px 18px rgba(46,40,72,0.18)',
  accent: '#9184d9',
  accentText: '#5a4bb5',
  accentSoft: 'rgba(145,132,217,0.12)',
  accentSoftStrong: 'rgba(145,132,217,0.18)',
  accentBorder: 'rgba(122,108,206,0.45)',
  onAccent: '#161826',
  badgeBg: '#423a6a',
  badgeText: '#f5f4ff',
  pros: '#2e7d52',
  cons: '#b0453f',
  hoverRing: '#c3b9ee',
  // Shadows are tinted with the ink colour rather than pure black: black shadows go
  // grey and muddy over a light ground.
  shadowCard: '0 14px 30px rgba(46,40,72,0.12)',
  shadowMd: '0 20px 44px rgba(46,40,72,0.10)',
  shadowLg: '0 26px 60px rgba(46,40,72,0.14)',
  shadowToast: '0 10px 30px rgba(46,40,72,0.18)',
  vignette: 'inset 0 0 60px rgba(46,40,72,0.14)',
  vignetteSoft: 'inset 0 0 50px rgba(46,40,72,0.10)',
  shimmerMid: '#e6e2f2',
  // `lighten` keeps only pixels brighter than the ground, so on a near-white surface a
  // photo disappears entirely. `multiply` is its light-ground dual.
  mediaBlend: 'multiply',
  mediaOpacity: 0.38,
  // The card scrim fades the photo into the card surface; over a light surface it has
  // to fade toward light, not toward the dark-theme navy.
  scrim: 'rgba(251,250,253,0.30)',
  scrimSoft: 'rgba(251,250,253,0.24)',
  // A 70% near-black backdrop is far heavier over a light page than over a dark one.
  scrimOverlay: 'rgba(46,40,72,0.38)',
  preview: 'linear-gradient(135deg, #e7e3f5, #d3cbec 50%, #e7e3f5)',
  ctaPanel: 'linear-gradient(135deg, rgba(145,132,217,0.16), rgba(145,132,217,0.06))',
  matchPanel: 'linear-gradient(135deg, rgba(145,132,217,0.18), rgba(251,250,253,0.9))',
  verdictPanel: 'linear-gradient(135deg, rgba(145,132,217,0.14), rgba(251,250,253,0.85))',
  logoGlow: '0 0 10px rgba(145,132,217,0.25)',
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
export const ACCENT = '#9184d9';
export const ACCENT_BRIGHT = '#b5abfc';
export const ACCENT_DEEP = '#423a6a';
export const ACCENT_RING = '#5d5294';
export const ON_ACCENT = '#161826';
export const PROS = '#a8e0b8';
export const CONS = '#e0a8a8';

/** Breakpoints used by the design's responsive value table. */
export const MOBILE_MAX = 720;
export const TABLET_MAX = 1080;
export const DESKTOP_NAV_MIN = 860;
