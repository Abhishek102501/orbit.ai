import { useState } from 'react';
import { FALLBACK_PHOTO, unsplashSrcSet, unsplashUrl } from '../data/categories.js';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The photo layer behind category cards and page banners. On a load failure it falls back
 * once to the shared fallback photo, then gives up and hides — the design's `onImgError`
 * behaviour.
 *
 * Two treatments:
 *
 * - default — the blended wash the page banners use. The blend mode follows the theme:
 *   `lighten` keeps only pixels brighter than what is underneath, which erases the photo
 *   over a light surface, so light mode uses `multiply`, its dual.
 * - `vivid` — the photograph at full strength, no blend and no opacity cut. Cards that
 *   want the image to be the subject rather than a texture use this and rely on their own
 *   gradient to protect the text.
 */
export function PhotoBackdrop({
  photo,
  width = 900,
  opacity,
  vivid = false,
  alt = '',
  className,
  style,
}) {
  const { c } = useOrbit();
  const [id, setId] = useState(photo || FALLBACK_PHOTO);
  const [fellBack, setFellBack] = useState(false);
  const [hidden, setHidden] = useState(false);

  const onError = () => {
    if (fellBack) {
      setHidden(true);
      return;
    }
    setFellBack(true);
    setId(FALLBACK_PHOTO);
  };

  // Both the photo and the shared fallback failed — network offline, an ad blocker, a
  // dead id. Paint the brand gradient rather than collapsing to an empty container or
  // leaving a broken-image glyph behind.
  if (hidden) {
    return (
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: c.preview,
          ...style,
        }}
      />
    );
  }

  const treatment = vivid
    ? { mixBlendMode: 'normal', opacity: 1 }
    : {
        mixBlendMode: c.mediaBlend,
        opacity: opacity === undefined ? c.mediaOpacity : opacity * (c.mediaOpacity / 0.5),
      };

  return (
    <img
      src={unsplashUrl(id, width)}
      srcSet={unsplashSrcSet(id, width)}
      onError={onError}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable="false"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...treatment,
        ...style,
      }}
    />
  );
}

export default PhotoBackdrop;
