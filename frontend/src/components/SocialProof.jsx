import { useState } from 'react';
import Icon from './Icon.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { unsplashAvatarSrcSet, unsplashAvatarUrl } from '../data/categories.js';
import { SOCIAL_PROOF } from '../lib/content.js';

const AVATAR = 32;
const OVERLAP = 10;

/**
 * One avatar. Falls back to a flat accent tint if the photo fails, so the row keeps its
 * shape instead of collapsing — the same rule the rest of the app's imagery follows.
 */
function Avatar({ photo, alt, ring }) {
  const { c } = useOrbit();
  const [failed, setFailed] = useState(false);

  const shared = {
    width: AVATAR,
    height: AVATAR,
    borderRadius: '50%',
    border: `2px solid ${ring}`,
    display: 'block',
    objectFit: 'cover',
    background: c.accentSoftStrong,
  };

  if (failed) return <span aria-hidden="true" className="sp-avatar" style={shared} />;

  return (
    <img
      className="sp-avatar"
      src={unsplashAvatarUrl(photo, AVATAR)}
      srcSet={unsplashAvatarSrcSet(photo, AVATAR)}
      alt={alt}
      width={AVATAR}
      height={AVATAR}
      loading="lazy"
      decoding="async"
      draggable="false"
      onError={() => setFailed(true)}
      style={shared}
    />
  );
}

/**
 * Compact trust badge: a row of overlapping customer avatars, the headline figure, and
 * the star rating. Sized to sit inside an existing panel rather than to be its own
 * section — see the Find My AI Tool panel on the home page.
 *
 * `ring` is the colour the avatar borders punch through, so pass whatever surface the
 * badge is sitting on; that separation is what keeps overlapping faces legible.
 */
export function SocialProof({ ring, style }) {
  const { c } = useOrbit();
  const { headline, rating, ratingValue, ratingMax, avatars } = SOCIAL_PROOF;
  const ringColor = ring || c.surface;

  return (
    <div
      role="group"
      aria-label={`${headline}, rated ${ratingValue} out of ${ratingMax}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexWrap: 'wrap',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flex: 'none' }}>
        {avatars.map((a, i) => (
          <span
            key={a.photo}
            style={{
              display: 'block',
              marginLeft: i === 0 ? 0 : -OVERLAP,
              position: 'relative',
              // later avatars sit on top, so the row reads left-to-right
              zIndex: i,
            }}
          >
            <Avatar photo={a.photo} alt={a.alt} ring={ringColor} />
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: c.ink(0.88), lineHeight: 1.2 }}>
          {headline}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1 }}>
          <span aria-hidden="true" style={{ display: 'flex', gap: 1.5, color: c.star }}>
            {Array.from({ length: ratingMax }, (_, i) => (
              <Icon key={i} name="starFilled" size={12} />
            ))}
          </span>
          <span style={{ fontSize: 12, color: c.ink(0.6) }}>{rating}</span>
        </span>
      </div>
    </div>
  );
}

export default SocialProof;
