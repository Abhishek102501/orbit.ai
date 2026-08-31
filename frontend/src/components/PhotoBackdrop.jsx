import { useState } from 'react';
import { FALLBACK_PHOTO, unsplashUrl } from '../data/categories.js';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The blended photo layer behind category cards and page banners. On a load failure it
 * falls back once to the shared fallback photo, then gives up and hides — the design's
 * `onImgError` behaviour.
 *
 * The blend mode follows the theme: `lighten` keeps only pixels brighter than what is
 * underneath, which erases the photo entirely over a light surface. Light mode uses
 * `multiply`, its dual, so the same photo reads as a soft tint instead of vanishing.
 */
export function PhotoBackdrop({ photo, width = 900, opacity, style }) {
  const { c } = useOrbit();
  const [src, setSrc] = useState(() => unsplashUrl(photo || FALLBACK_PHOTO, width));
  const [fellBack, setFellBack] = useState(false);
  const [hidden, setHidden] = useState(false);

  const onError = () => {
    if (fellBack) {
      setHidden(true);
      return;
    }
    setFellBack(true);
    setSrc(unsplashUrl(FALLBACK_PHOTO, width));
  };

  if (hidden) return null;

  return (
    <img
      src={src}
      onError={onError}
      alt=""
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        mixBlendMode: c.mediaBlend,
        opacity: opacity === undefined ? c.mediaOpacity : opacity * (c.mediaOpacity / 0.5),
        ...style,
      }}
    />
  );
}

export default PhotoBackdrop;
