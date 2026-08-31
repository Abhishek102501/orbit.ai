import Hoverable from './Hoverable.jsx';
import Icon from './Icon.jsx';
import ToolLogo from './ToolLogo.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * Port of ToolCard.dc.html. `tool` is a card object from `buildCard()`.
 */
export function ToolCard({ tool }) {
  const { c } = useOrbit();

  return (
    <Hoverable
      style={{
        background: c.surface,
        borderRadius: 12,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: `0 0 0 1px ${c.ring}`,
        height: '100%',
        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease',
      }}
      hoverStyle={{
        transform: 'translateY(-5px)',
        boxShadow: `0 0 0 1px ${c.hoverRing}, ${c.shadowCard}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <ToolLogo initials={tool.initials} logoUrl={tool.logoUrl} size={42} radius={10} fontSize={14} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <a
              href={tool.detailHref}
              style={{ textDecoration: 'none', color: c.text, fontWeight: 600, fontSize: '15.5px' }}
            >
              {tool.name}
            </a>
            {tool.matchScore ? (
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  color: c.badgeText,
                  background: c.badgeBg,
                  borderRadius: 6,
                  padding: '2px 7px',
                }}
              >
                {tool.matchScore}% match
              </span>
            ) : null}
          </div>
          <span
            style={{
              fontSize: '10.5px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: c.ink(0.5),
            }}
          >
            {tool.categoryLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={tool.onToggleSave}
          aria-label="Save"
          style={{
            width: 32,
            height: 32,
            flex: 'none',
            border: `1px solid ${c.ink(0.16)}`,
            borderRadius: 8,
            background: 'transparent',
            color: tool.saveColor,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={tool.isSaved ? 'bookmarkFilled' : 'bookmark'} size={15} />
        </button>
      </div>

      <p
        style={{
          fontSize: 13,
          color: c.ink(0.68),
          lineHeight: 1.55,
          margin: 0,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {tool.description}
      </p>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tool.topFeatures.map((f) => (
          <span
            key={f}
            style={{
              fontSize: '10.5px',
              color: c.ink(0.6),
              background: c.ink(0.04),
              borderRadius: 6,
              padding: '3px 8px',
            }}
          >
            {f}
          </span>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '12.5px',
          color: c.ink(0.7),
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: c.text }}>
          <Icon name="starFilled" size={13} />
          {tool.rating}
        </span>
        <span style={{ color: c.ink(0.35) }}>({tool.reviewCount})</span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '10.5px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: tool.pricingColor,
            background: tool.pricingBg,
            padding: '3px 9px',
            borderRadius: 6,
          }}
        >
          {tool.pricingLabel}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
        <button
          type="button"
          onClick={tool.onToggleCompare}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: '12.5px',
            padding: '9px 10px',
            borderRadius: 8,
            border: `1px solid ${tool.compareBorder}`,
            background: tool.compareBg,
            color: tool.compareColor,
            cursor: 'pointer',
          }}
        >
          <Icon name="layers" size={14} />
          {tool.compareLabel}
        </button>
        <a
          href={tool.website}
          target="_blank"
          rel="noopener"
          style={{
            flex: 1,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: '12.5px',
            padding: '9px 10px',
            borderRadius: 8,
            border: `1px solid ${c.accent}`,
            color: c.accentText,
          }}
        >
          Visit
          <Icon name="arrowUpRight" size={13} />
        </a>
      </div>

      <a
        href={tool.detailHref}
        style={{
          textDecoration: 'none',
          textAlign: 'center',
          fontSize: 12,
          color: c.ink(0.55),
          marginTop: -2,
        }}
      >
        View full details
      </a>
    </Hoverable>
  );
}

export default ToolCard;
