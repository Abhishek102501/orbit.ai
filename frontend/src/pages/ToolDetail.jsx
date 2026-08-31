import { useMemo } from 'react';
import Icon from '../components/Icon.jsx';
import ToolCard from '../components/ToolCard.jsx';
import ToolLogo from '../components/ToolLogo.jsx';
import PhotoBackdrop from '../components/PhotoBackdrop.jsx';
import NotFound from './NotFound.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { getAlternatives, getSimilar, verdict } from '../lib/tools.js';
import { FALLBACK_PHOTO } from '../data/categories.js';

export function ToolDetail() {
  const { c, layout, route, TOOLS, CATEGORIES, getToolBySlug, buildCard } = useOrbit();

  const tool = getToolBySlug(route.params.slug);

  const derived = useMemo(() => {
    if (!tool) return null;
    const alts = getAlternatives(TOOLS, tool);
    const altIds = alts.map((t) => t.id);
    return {
      card: buildCard(tool),
      alternatives: alts.map(buildCard),
      similar: getSimilar(TOOLS, tool, altIds).map(buildCard),
      bestForText: (tool.useCases || []).slice(0, 2).join(' and '),
      verdictText: verdict(tool),
      bannerPhoto: (CATEGORIES.find((x) => x.id === tool.category) || {}).photo || FALLBACK_PHOTO,
    };
  }, [tool, TOOLS, CATEGORIES, buildCard]);

  if (!tool || !derived) return <NotFound />;

  const { card, alternatives, similar, bestForText, verdictText, bannerPhoto } = derived;

  return (
    <article
      data-screen-label="Tool Details"
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: layout.pagePad,
        animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <a
        href="#/discover"
        style={{
          textDecoration: 'none',
          fontSize: '12.5px',
          color: `rgba(${c.textRgb},0.55)`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          marginBottom: 20,
        }}
      >
        <Icon name="arrowLeft" size={13} />
        Back to Discover
      </a>

      <div
        style={{
          position: 'relative',
          borderRadius: 14,
          overflow: 'hidden',
          height: 150,
          marginBottom: 24,
          boxShadow: `0 0 0 1px ${c.ring}`,
        }}
      >
        <PhotoBackdrop photo={bannerPhoto} width={1200} opacity={0.55} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(${c.bgRgb},0.3), ${c.bg} 95%)`,
          }}
        />
      </div>

      {/* ------------------------------------------------------------ header */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          marginBottom: 28,
        }}
      >
        <ToolLogo initials={card.initials} logoUrl={card.logoUrl} size={64} radius={16} fontSize={20} />

        <div style={{ flex: 1, minWidth: 220 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
              marginBottom: 6,
            }}
          >
            <h1 style={{ fontSize: 28, margin: 0 }}>{card.name}</h1>
            <span
              style={{
                fontSize: 11,
                color: `rgba(${c.textRgb},0.55)`,
                background: `rgba(${c.textRgb},0.05)`,
                padding: '3px 10px',
                borderRadius: 6,
              }}
            >
              {card.categoryLabel}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              flexWrap: 'wrap',
              fontSize: '13.5px',
              color: `rgba(${c.textRgb},0.7)`,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="starFilled" size={13} />
              {card.rating} <span style={{ color: `rgba(${c.textRgb},0.4)` }}>({card.reviewCount})</span>
            </span>
            <span
              style={{
                fontWeight: 600,
                color: card.pricingColor,
                background: card.pricingBg,
                padding: '3px 10px',
                borderRadius: 6,
                fontSize: 12,
              }}
            >
              {card.pricingLabel}
            </span>
            {card.matchScore ? (
              <span style={{ fontWeight: 700, color: '#b5abfc' }}>{card.matchScore}% Orbit Match</span>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flex: 'none' }}>
          <button
            type="button"
            onClick={card.onToggleSave}
            style={{
              border: `1px solid rgba(${c.textRgb},0.16)`,
              background: 'transparent',
              color: c.text,
              padding: '11px 16px',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon name={card.isSaved ? 'bookmarkFilled' : 'bookmark'} size={15} />
            {card.saveLabel}
          </button>
          <button
            type="button"
            onClick={card.onToggleCompare}
            style={{
              border: `1px solid ${card.compareBorder}`,
              background: card.compareBg,
              color: card.compareColor,
              padding: '11px 16px',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon name="layers" size={14} />
            {card.compareLabel}
          </button>
          <a
            href={card.website}
            target="_blank"
            rel="noopener"
            style={{
              textDecoration: 'none',
              background: '#9184d9',
              color: '#161826',
              padding: '11px 18px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Visit Website
            <Icon name="arrowUpRight" size={13} />
          </a>
        </div>
      </div>

      <p style={{ fontSize: 15, color: `rgba(${c.textRgb},0.78)`, lineHeight: 1.7, margin: '0 0 28px' }}>
        {card.description}
      </p>

      <div
        style={{
          background: c.surface,
          borderRadius: 10,
          padding: '18px 20px',
          marginBottom: 32,
          boxShadow: `0 0 0 1px ${c.ring}`,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: '#b5abfc',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Best for
        </span>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: c.text }}>{bestForText}</p>
      </div>

      {/* ------------------------------------------ features / pricing */}
      <div style={{ display: 'flex', flexDirection: layout.detailColDir, gap: 28, marginBottom: 36 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 17, margin: '0 0 14px' }}>Features</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(card.features || []).map((f) => (
              <div
                key={f}
                style={{ display: 'flex', gap: 8, fontSize: '13.5px', color: `rgba(${c.textRgb},0.78)` }}
              >
                <span style={{ color: '#9184d9', flex: 'none', marginTop: 1 }}>
                  <Icon name="check" size={15} />
                </span>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 17, margin: '0 0 14px' }}>Pricing &amp; Platforms</h2>
          <p
            style={{
              fontSize: '13.5px',
              color: `rgba(${c.textRgb},0.78)`,
              margin: '0 0 14px',
              lineHeight: 1.6,
            }}
          >
            {card.pricingDetails}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(card.platforms || []).map((p) => (
              <span
                key={p}
                style={{
                  fontSize: '11.5px',
                  color: `rgba(${c.textRgb},0.65)`,
                  background: `rgba(${c.textRgb},0.05)`,
                  padding: '4px 10px',
                  borderRadius: 6,
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------- pros / cons */}
      <div style={{ display: 'flex', flexDirection: layout.detailColDir, gap: 28, marginBottom: 36 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 17, margin: '0 0 14px', color: '#a8e0b8' }}>Pros</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(card.pros || []).map((p) => (
              <div
                key={p}
                style={{ display: 'flex', gap: 8, fontSize: '13.5px', color: `rgba(${c.textRgb},0.78)` }}
              >
                <span style={{ color: '#a8e0b8', flex: 'none' }}>+</span>
                {p}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 17, margin: '0 0 14px', color: '#e0a8a8' }}>Cons</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(card.cons || []).map((con) => (
              <div
                key={con}
                style={{ display: 'flex', gap: 8, fontSize: '13.5px', color: `rgba(${c.textRgb},0.78)` }}
              >
                <span style={{ color: '#e0a8a8', flex: 'none' }}>−</span>
                {con}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, rgba(38,42,96,0.4), rgba(35,37,50,0.5))',
          border: '1px solid rgba(145,132,217,0.25)',
          borderRadius: 12,
          padding: 22,
          marginBottom: 44,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: '#b5abfc',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Orbit Verdict
        </span>
        <p style={{ margin: '8px 0 0', fontSize: '14.5px', color: c.text, lineHeight: 1.6 }}>
          {verdictText}
        </p>
      </div>

      <h2 style={{ fontSize: 20, margin: '0 0 16px' }}>Alternatives</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${layout.detailGridCols},1fr)`,
          gap: 16,
          marginBottom: 40,
        }}
      >
        {alternatives.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>

      <h2 style={{ fontSize: 20, margin: '0 0 16px' }}>Similar Tools</h2>
      <div
        style={{ display: 'grid', gridTemplateColumns: `repeat(${layout.detailGridCols},1fr)`, gap: 16 }}
      >
        {similar.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
    </article>
  );
}

export default ToolDetail;
