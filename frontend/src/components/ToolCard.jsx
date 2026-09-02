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
        // No `height: 100%` here. A grid item already stretches to its row (the
        // default `align-items: normal` resolves to `stretch`), so the declaration
        // was redundant - and actively harmful without a global `box-sizing:
        // border-box`: it resolved against the *content* box, the 18px padding was
        // then added outside it, and every card overflowed its own grid row by
        // exactly its padding. With a 16px gap that left 20px of each row sitting
        // on top of the row above it.
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
                className="tabular"
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

        <Hoverable
          as="button"
          type="button"
          onClick={tool.onToggleSave}
          aria-label={
            tool.isSaved ? `Remove ${tool.name} from saved` : `Save ${tool.name}`
          }
          aria-pressed={tool.isSaved}
          title={tool.isSaved ? 'Remove from saved' : 'Save'}
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
            transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',
          }}
          hoverStyle={{
            borderColor: c.accentBorder,
            background: c.accentSoft,
            color: c.accentText,
          }}
        >
          <Icon name={tool.isSaved ? 'bookmarkFilled' : 'bookmark'} size={15} />
        </Hoverable>
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
        <span
          className="tabular"
          style={{ display: 'flex', alignItems: 'center', gap: 4, color: c.text }}
        >
          <Icon name="starFilled" size={13} />
          {tool.rating}
        </span>
        <span className="tabular" style={{ color: c.ink(0.35) }}>
          ({tool.reviewCount.toLocaleString()})
        </span>
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
        <Hoverable
          as="button"
          type="button"
          onClick={tool.onToggleCompare}
          aria-pressed={tool.isComparing}
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
            transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',
          }}
          hoverStyle={{ borderColor: c.accentBorder, background: c.accentSoft, color: c.accentText }}
        >
          <Icon name="layers" size={14} />
          {tool.compareLabel}
        </Hoverable>
        <Hoverable
          as="a"
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          hoverStyle={{ background: c.accentSoft }}
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
            transition: 'background-color 0.2s ease',
          }}
        >
          Visit
          <Icon name="arrowUpRight" size={13} />
        </Hoverable>
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
