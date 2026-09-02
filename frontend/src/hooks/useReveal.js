import { useEffect, useRef, useState } from 'react';
import { supportsScrollTimeline } from '../lib/motion.js';

/**
 * Scroll reveal for a section.
 *
 * Returns a ref and a class name. The styling lives in index.css under `.reveal`,
 * which has two implementations of the same effect:
 *
 * - Where `animation-timeline: view()` is supported, CSS drives the reveal from scroll
 *   position and this hook does nothing at all — no observer, no state, no React
 *   re-render on scroll.
 * - Everywhere else, an IntersectionObserver adds `.is-in` once and a transition
 *   handles it, which is the behaviour this hook always had.
 *
 * Grids opt into the staggered variant separately, by carrying `reveal-group` in
 * their own class name — see `.reveal-group` in index.css.
 *
 * `observe` forces the observer path and the `.reveal-io` class. Use it where a
 * scroll-driven timeline cannot resolve reliably - inside a clipped or otherwise
 * contained panel, the scrollport `view()` measures against is not the viewport, and
 * children can freeze part-way through their reveal.
 *
 * `fade` selects the travel-free variant. A section holding a `position: sticky`
 * child must use it: the transform this hook's default leaves behind would create a
 * containing block and stop the child sticking.
 */
export function useReveal(threshold = 0.12, { fade = false, observe = false } = {}) {
  const ref = useRef(null);
  // Assume revealed when CSS owns the animation, so the observer never runs and the
  // element is never left hidden if something goes wrong setting it up. `observe`
  // opts out of that and always runs the observer.
  const [revealed, setRevealed] = useState(() => !observe && supportsScrollTimeline());

  useEffect(() => {
    if (revealed) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [revealed, threshold]);

  const base = observe ? 'reveal-io' : fade ? 'reveal-fade' : 'reveal';
  const className = revealed ? `${base} is-in` : base;

  return { ref, revealed, className };
}
