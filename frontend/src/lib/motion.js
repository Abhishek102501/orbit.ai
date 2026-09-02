/**
 * Orbit's motion system.
 *
 * One easing curve and a short ladder of durations, so every transition on the site
 * feels like it came from the same hand. Anything that animates should pull its
 * numbers from here rather than inventing its own.
 *
 * The curve is a strong ease-out: motion leaves fast and settles slowly, which is what
 * makes an interface feel responsive rather than sluggish. It is already the curve the
 * rest of Orbit was using, so nothing had to be retuned to adopt this module.
 *
 * The ladder is deliberately short. Two durations for things the pointer touches, two
 * for things the scroll reveals — more than that and the timing stops reading as a
 * system.
 */
export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

/** A softer curve for things that should not overshoot, like colour fades. */
export const EASE_SOFT = 'cubic-bezier(0.4, 0, 0.2, 1)';

export const DUR = {
  /** Colour and border changes under the pointer. */
  fast: '150ms',
  /** The default for hover and press states. */
  base: '220ms',
  /** Elements that move a visible distance — cards lifting, panels opening. */
  slow: '320ms',
  /** Section reveals and anything crossing a large part of the screen. */
  reveal: '640ms',
};

/** How far a revealing element travels. Small on purpose: distance reads as weight. */
export const RISE = '26px';

/** Composes a transition string from a property list. Never returns `all`. */
export function transition(properties, duration = DUR.base, ease = EASE) {
  return properties
    .split(',')
    .map((p) => `${p.trim()} ${duration} ${ease}`)
    .join(', ');
}

/**
 * True when the visitor has asked for reduced motion. Guarded for SSR, where there is
 * no `window` — the smoke harness renders every screen without a DOM.
 */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * True when the browser can drive an animation from scroll position rather than from a
 * clock. Chrome and Edge can; Firefox cannot yet, and falls back to the observer path
 * in useReveal.
 */
export function supportsScrollTimeline() {
  return (
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('animation-timeline: view()')
  );
}
