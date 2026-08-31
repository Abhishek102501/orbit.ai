import { useEffect, useState } from 'react';

/** Tracks window width, the single input to the design's responsive value table. */
export function useViewport() {
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280));

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return vw;
}
