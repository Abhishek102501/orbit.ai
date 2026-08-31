import { useMemo } from 'react';
import Icon from '../components/Icon.jsx';
import ToolCard from '../components/ToolCard.jsx';
import PhotoBackdrop from '../components/PhotoBackdrop.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { HERO_PHOTO } from '../data/categories.js';
import { RATING_CHOICES } from '../lib/content.js';

const SKELETON_SLOTS = [1, 2, 3, 4, 5, 6];

export function Discover() {
  const {
    c,
    layout,
    CATEGORIES,
    PLATFORMS,
    buildCard,
    searchQuery,
    filterCategory,
    filterPricing,
    filterPlatform,
    minRating,
    sortBy,
    discoverLoading,
    discoverVisible,
    setDiscoverVisible,
    filteredTools,
    hasActiveFilters,
    clearFilters,
    onSearchChange,
    onCategorySelect,
    onPricingSelect,
    onPlatformSelect,
    onSortSelect,
    onRatingSelect,
  } = useOrbit();

  const visible = useMemo(
    () => filteredTools.slice(0, discoverVisible).map(buildCard),
    [filteredTools, discoverVisible, buildCard],
  );

  const noResults = filteredTools.length === 0;
  const showNoResults = noResults && !discoverLoading;
  const showGrid = !discoverLoading && !noResults;
  const hasMore = filteredTools.length > discoverVisible;

  const selectStyle = {
    width: '100%',
    minHeight: 38,
    padding: '0 10px',
    background: c.surfaceAlt,
    border: `1px solid rgba(${c.textRgb},0.16)`,
    borderRadius: 8,
    color: c.text,
    fontSize: '13.5px',
    fontFamily: 'Inter',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    color: `rgba(${c.textRgb},0.55)`,
    marginBottom: 6,
  };

  return (
    <section
      data-screen-label="Discover"
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: layout.pagePad,
        animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: 14,
          overflow: 'hidden',
          height: 160,
          marginBottom: 28,
          boxShadow: `0 0 0 1px ${c.ring}`,
        }}
      >
        <PhotoBackdrop photo={HERO_PHOTO} width={1400} opacity={0.5} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(${c.bgRgb},0.35), ${c.bg} 96%)`,
          }}
        />
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 28px',
          }}
        >
          <h1 style={{ fontSize: 32, margin: '0 0 8px' }}>Discover AI Tools</h1>
          <p style={{ color: `rgba(${c.textRgb},0.65)`, fontSize: 14, margin: 0 }}>
            Search, filter, and browse the full Orbit catalog.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: layout.discoverLayoutDir, gap: 26 }}>
        {/* ------------------------------------------------------- filters */}
        <aside
          style={{
            width: layout.filterAsideWidth,
            flex: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: `rgba(${c.textRgb},0.7)`,
            }}
          >
            <Icon name="sliders" size={15} />
            Filters
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: '#b5abfc',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Clear all
              </button>
            ) : null}
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={filterCategory}
              onChange={(e) => onCategorySelect(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Pricing</label>
            <select
              value={filterPricing}
              onChange={(e) => onPricingSelect(e.target.value)}
              style={selectStyle}
            >
              <option value="all">Any pricing</option>
              <option value="free">Free</option>
              <option value="freemium">Freemium</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Platform</label>
            <select
              value={filterPlatform}
              onChange={(e) => onPlatformSelect(e.target.value)}
              style={selectStyle}
            >
              {['all', ...PLATFORMS].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ ...labelStyle, marginBottom: 8 }}>Rating</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {RATING_CHOICES.map((v) => {
                const active = minRating === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onRatingSelect(v)}
                    style={{
                      fontSize: 12,
                      padding: '7px 12px',
                      borderRadius: 7,
                      border: `1px solid rgba(${c.textRgb},0.16)`,
                      background: active ? '#9184d9' : 'transparent',
                      color: active ? c.bg : c.text,
                      cursor: 'pointer',
                    }}
                  >
                    {v === 0 ? 'Any rating' : v.toFixed(1) + '+'}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* --------------------------------------------------------- results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
            <div
              style={{
                flex: 1,
                minWidth: 200,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: c.surface,
                border: `1px solid rgba(${c.textRgb},0.14)`,
                borderRadius: 9,
                padding: '0 12px',
              }}
            >
              <Icon name="search" size={15} />
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name, task, or capability"
                style={{
                  flex: 1,
                  minHeight: 40,
                  background: 'transparent',
                  border: 'none',
                  color: c.text,
                  outline: 'none',
                  fontSize: '13.5px',
                  fontFamily: 'Inter',
                }}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortSelect(e.target.value)}
              style={{
                minHeight: 42,
                padding: '0 12px',
                background: c.surface,
                border: `1px solid rgba(${c.textRgb},0.14)`,
                borderRadius: 9,
                color: c.text,
                fontSize: 13,
                fontFamily: 'Inter',
              }}
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="rating">Sort: Rating</option>
              <option value="reviews">Sort: Most reviewed</option>
              <option value="name">Sort: Name (A–Z)</option>
            </select>
          </div>

          <p style={{ fontSize: '12.5px', color: `rgba(${c.textRgb},0.45)`, margin: '0 0 18px' }}>
            {filteredTools.length} tools found
          </p>

          {discoverLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${layout.toolGridCols},1fr)`, gap: 16 }}>
              {SKELETON_SLOTS.map((sk) => (
                <div
                  key={sk}
                  style={{
                    background: c.surface,
                    borderRadius: 12,
                    height: 280,
                    boxShadow: `0 0 0 1px ${c.ring}`,
                    backgroundImage: `linear-gradient(90deg, ${c.surface} 0%, #262a3c 50%, ${c.surface} 100%)`,
                    backgroundSize: '800px 100%',
                    animation: 'shimmer 1.6s infinite linear',
                  }}
                />
              ))}
            </div>
          ) : null}

          {showNoResults ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: c.surface,
                borderRadius: 12,
                boxShadow: `0 0 0 1px ${c.ring}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 14,
                  color: `rgba(${c.textRgb},0.3)`,
                }}
              >
                <Icon name="search" size={34} />
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: 17 }}>No tools match those filters</h3>
              <p style={{ color: `rgba(${c.textRgb},0.55)`, fontSize: '13.5px', margin: '0 0 18px' }}>
                Try widening your search or clearing a filter.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  background: '#9184d9',
                  color: '#161826',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear filters
              </button>
            </div>
          ) : null}

          {showGrid ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${layout.toolGridCols},1fr)`, gap: 16 }}>
                {visible.map((t) => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </div>
              {hasMore ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 26 }}>
                  <button
                    type="button"
                    onClick={() => setDiscoverVisible(discoverVisible + 12)}
                    style={{
                      border: `1px solid rgba(${c.textRgb},0.16)`,
                      background: 'transparent',
                      color: c.text,
                      padding: '11px 22px',
                      borderRadius: 8,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                    }}
                  >
                    Load more tools
                  </button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default Discover;
