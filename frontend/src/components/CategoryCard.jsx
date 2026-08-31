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
 * Fixed-size card used by the home-page marquee. Photo bleeds behind a gradient scrim,
 * icon on top, name and tool count pinned to the bottom.
 */
export function MarqueeCategoryCard({ category, count, photoWidth = 400 }) {
  const { c } = useOrbit();

  return (
    <Hoverable
      as="a"
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
      <PhotoBackdrop photo={category.photo} width={photoWidth} opacity={0.5} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${c.scrim}, ${c.surface} 92%)`,
        }}
      />
      <span
        style={{
          position: 'relative',
          width: 48,
          height: 48,
          borderRadius: 12,
          background: c.accentSoftStrong,
          color: c.accentText,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={category.icon} size={18} />
      </span>
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
      <PhotoBackdrop photo={category.photo} width={700} opacity={0.5} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${c.scrimSoft}, ${c.surface} 90%)`,
        }}
      />
      <span
        style={{
          position: 'relative',
          width: 48,
          height: 48,
          borderRadius: 12,
          background: c.accentSoftStrong,
          color: c.accentText,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={category.icon} size={26} />
      </span>
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
