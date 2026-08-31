/**
 * The two Orbit colour schemes, lifted verbatim from `renderVals()` in the design.
 * Every surface in the app reads from the object returned by `paletteFor()`, which the
 * design refers to throughout as `c`.
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
};

export const LIGHT = {
  bg: '#f2f1f7',
  bgRgb: '242,241,247',
  surface: '#fbfafd',
  surfaceAlt: '#eeecf4',
  chrome: '#e3e0ec',
  ring: '#dcd9e8',
  text: '#1c1a24',
  textRgb: '32,29,42',
};

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
