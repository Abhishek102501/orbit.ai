import Hoverable from './Hoverable.jsx';
import Icon from './Icon.jsx';
import PhotoBackdrop from './PhotoBackdrop.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

/** Hover lift. The ring and shadow come from the palette so the card separates from
 *  the ground in both themes instead of stamping a dark-only shadow. */
const hoverFor = (c) => ({
  transform: 'translateY(-4px)',
  boxShadow: `0 0 0 1px ${c.hoverRing}, ${c.shadowCard}`,
});

/**
 * Glass chip holding the category icon. It sits directly on the photograph, so its
 * surface is a translucent blur with its own border rather than a page surface — that is
 * what keeps the icon readable over a bright studio shot and a dark circuit board alike.
 */
function IconChip({ name, size, box = 48 }) {
  const { c } = useOrbit();
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'relative',
        width: box,
        height: box,
        borderRadius: 13,
        background: c.glassBg,
        border: `1px solid ${c.glassBorder}`,
        boxShadow: c.glassShadow,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: c.glassIcon,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <Icon name={name} size={size} />
    </span>
  );
}

/**
 * The photo is the subject: it runs full strength across the top of the card and the
 * gradient hands over to the card surface behind the text, so the type sits on a solid
 * colour in both themes instead of on the photograph.
 */
function cardScrim(c, handover) {
  return (
    `linear-gradient(180deg, rgba(${c.surfaceRgb},0) 0%, rgba(${c.surfaceRgb},0.08) ${handover - 26}%, ` +
    `rgba(${c.surfaceRgb},0.86) ${handover}%, ${c.surface} ${handover + 14}%)`
  );
}

/**
 * Fixed-size card used by the home-page marquee. Photo bleeds behind a gradient scrim,
 * icon on top, name and tool count pinned to the bottom.
 */
export function MarqueeCategoryCard({ category, count, photoWidth = 400 }) {
  const { c } = useOrbit();

  return (
    <Hoverable
      as="a"
      className="cat-card"
      href={'#/discover?category=' + category.id}
      style={{
        flex: 'none',
        width: 280,
        height: 230,
        textDecoration: 'none',
        color: c.text,
        background: c.surface,
        borderRadius: 14,
        padding: 26,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: `0 0 0 1px ${c.ring}`,
        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      hoverStyle={hoverFor(c)}
    >
      <PhotoBackdrop
        photo={category.photo}
        alt={category.photoAlt || ''}
        width={photoWidth}
        vivid
        className="cat-photo"
      />
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: cardScrim(c, 62) }}
      />
      <IconChip name={category.icon} size={18} />
      <span style={{ position: 'relative', fontSize: 19, fontWeight: 500, marginTop: 'auto' }}>
        {category.name}
      </span>
      <span style={{ position: 'relative', fontSize: 13, color: c.ink(0.55) }}>
        {count} tools
      </span>
    </Hoverable>
  );
}

/**
 * Taller card used on the Categories page — adds the tagline and a chevron affordance.
 */
export function CategoryCard({ category, count }) {
  const { c } = useOrbit();

  return (
    <Hoverable
      as="a"
      className="cat-card"
      href={'#/discover?category=' + category.id}
      style={{
        textDecoration: 'none',
        color: c.text,
        background: c.surface,
        borderRadius: 12,
        padding: 26,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: `0 0 0 1px ${c.ring}`,
        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      hoverStyle={hoverFor(c)}
    >
      <PhotoBackdrop
        photo={category.photo}
        alt={category.photoAlt || ''}
        width={700}
        vivid
        className="cat-photo"
      />
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: cardScrim(c, 56) }}
      />
      <IconChip name={category.icon} size={26} />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>{category.name}</div>
        <p style={{ fontSize: 13, color: c.ink(0.6), margin: 0, lineHeight: 1.5 }}>
          {category.tagline}
        </p>
      </div>
      <span
        style={{
          position: 'relative',
          fontSize: 12,
          color: c.accentText,
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {count} tools
        <Icon name="chevronRight" size={13} />
      </span>
    </Hoverable>
  );
}

export default CategoryCard;
