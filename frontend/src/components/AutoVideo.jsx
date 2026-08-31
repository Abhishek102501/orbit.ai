import { useEffect, useRef, useState } from 'react';

/**
 * Looping, muted, autoplaying background video that honours `prefers-reduced-motion`
 * and restarts itself if a browser ever fires `ended` on a looping source — the same
 * guard the design applies in `bgVideoRef` / `showcaseVideoRef`.
 *
 * The .mp4 files live in the Claude Design project and could not be exported through the
 * design API. Until they are dropped into `public/uploads/`, `fallback` renders instead.
 * See README.md → "Brand assets".
 */
export function AutoVideo({ src, style, fallback = null }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    el.loop = true;
    const onEnded = () => {
      el.currentTime = 0;
      el.play().catch(() => {});
    };
    const onError = () => setFailed(true);

    el.addEventListener('ended', onEnded);
    el.addEventListener('error', onError, true);

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) el.pause();
    else el.play().catch(() => {});

    return () => {
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('error', onError, true);
    };
  }, [src]);

  if (failed && fallback) return fallback;

  return (
    <video ref={ref} autoPlay muted loop playsInline style={style}>
      <source src={src} type="video/mp4" onError={() => setFailed(true)} />
    </video>
  );
}

export default AutoVideo;
