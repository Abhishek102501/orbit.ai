import { useState } from 'react';
import { FALLBACK_PHOTO, unsplashUrl } from '../data/categories.js';

/**
 * The blended photo layer behind category cards and page banners. On a load failure it
 * falls back once to the shared fallback photo, then gives up and hides — the design's
 * `onImgError` behaviour.
 */
export function PhotoBackdrop({ photo, width = 900, opacity = 0.5, style }) {
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
        mixBlendMode: 'lighten',
        opacity,
        ...style,
      }}
    />
  );
}

export default PhotoBackdrop;
