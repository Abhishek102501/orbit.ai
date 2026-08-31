import { useMemo } from 'react';
import Icon from '../components/Icon.jsx';
import ToolCard from '../components/ToolCard.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

export function Saved() {
  const { c, layout, saved, getTool, buildCard, compareSavedNow } = useOrbit();

  const savedTools = useMemo(
    () => saved.map(getTool).filter(Boolean).map(buildCard),
    [saved, getTool, buildCard],
  );

  const isEmpty = savedTools.length === 0;

  return (
    <section
      data-screen-label="Saved"
      style={{
        maxWidth: 1160,
        margin: '0 auto',
        padding: layout.pagePad,
        animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 28,
        }}
      >
        <div>
          <h1 style={{ fontSize: 32, margin: '0 0 8px' }}>Saved Tools</h1>
          <p style={{ color: c.ink(0.6), fontSize: 14, margin: 0 }}>
            Your shortlist, ready to compare or revisit.
          </p>
        </div>

        {savedTools.length >= 2 ? (
          <button
            type="button"
            onClick={compareSavedNow}
            style={{
              background: c.accent,
              color: c.onAccent,
              border: 'none',
              padding: '11px 20px',
              borderRadius: 8,
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon name="layers" size={14} />
            Compare saved
          </button>
        ) : null}
      </div>

      {isEmpty ? (
        <div
          style={{
            textAlign: 'center',
            padding: '70px 20px',
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
              color: c.ink(0.3),
            }}
          >
            <Icon name="bookmark" size={34} />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: 17 }}>No saved tools yet</h3>
          <p style={{ color: c.ink(0.55), fontSize: '13.5px', margin: '0 0 18px' }}>
            Save tools from Discover or the AI Advisor to build your shortlist.
          </p>
          <a
            href="#/discover"
            style={{
              textDecoration: 'none',
              background: c.accent,
              color: c.onAccent,
              padding: '10px 20px',
              borderRadius: 8,
              fontSize: '13.5px',
              fontWeight: 600,
            }}
          >
            Browse tools
          </a>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${layout.savedGridCols},1fr)`,
            gap: 16,
          }}
        >
          {savedTools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Saved;
