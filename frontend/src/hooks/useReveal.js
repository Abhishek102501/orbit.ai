import { useEffect, useRef, useState } from 'react';

/**
 * One-shot scroll reveal, matching the design's IntersectionObserver at threshold 0.12:
 * the section fades and rises into place the first time it enters the viewport, then
 * stops being observed.
 */
export function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return undefined;

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

  const style = {
    transition:
      'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translateY(0)' : 'translateY(30px)',
  };

  return { ref, revealed, style };
}
