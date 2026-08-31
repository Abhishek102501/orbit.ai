import { useMemo } from 'react';
import Icon from '../components/Icon.jsx';
import ToolLogo from '../components/ToolLogo.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { bestOf, pricingLabel } from '../lib/tools.js';

export function Compare() {
  const {
    c,
    layout,
    TOOLS,
    compareIds,
    getTool,
    buildCard,
    toggleCompare,
    compareSearch,
    setCompareSearch,
    lastCriteria,
    engine,
  } = useOrbit();

  const compareTools = useMemo(
    () => compareIds.map(getTool).filter(Boolean),
    [compareIds, getTool],
  );
  const cards = useMemo(() => compareTools.map(buildCard), [compareTools, buildCard]);

  const isEmpty = compareTools.length === 0;
  const needsMore = compareTools.length > 0 && compareTools.length < 2;
  const hasRows = compareTools.length >= 2;
  const canAddMore = compareTools.length < 4;

  const candidates = useMemo(() => {
    const q = compareSearch.trim().toLowerCase();
    return TOOLS.filter((t) => !compareIds.includes(t.id) && (!q || t.name.toLowerCase().includes(q))).slice(0, 6);
  }, [TOOLS, compareIds, compareSearch]);

  const rows = useMemo(() => {
    if (!hasRows) return [];
    return [
      {
        label: 'Orbit Match Score',
        values: compareTools.map((t) =>
          lastCriteria && engine ? engine.scoreTool(t, lastCriteria).score + '%' : '—',
        ),
      },
      {
        label: 'Rating',
        values: compareTools.map((t) => t.rating.toFixed(1) + ' (' + t.reviewCount.toLocaleString() + ')'),
      },
      { label: 'Pricing', values: compareTools.map((t) => pricingLabel(t.pricing)) },
      { label: 'Free plan', values: compareTools.map((t) => (t.pricing !== 'paid' ? 'Yes' : 'No')) },
      {
        label: 'Ease of use',
        values: compareTools.map((t) =>
          t.skillLevel === 'beginner' ? 'Easy' : t.skillLevel === 'advanced' ? 'Advanced' : 'Moderate',
        ),
      },
      { label: 'Platforms', values: compareTools.map((t) => (t.platforms || []).join(', ')) },
      {
        label: 'API availability',
        values: compareTools.map((t) => ((t.platforms || []).includes('API') ? 'Yes' : 'No')),
      },
      {
        label: 'Key features',
        values: compareTools.map((t) => (t.features || []).slice(0, 3).join(' · ')),
      },
    ];
  }, [hasRows, compareTools, lastCriteria, engine]);

  const recommendation = useMemo(() => {
    if (!hasRows || !engine) return null;
    const best = bestOf(compareTools, lastCriteria, engine.scoreTool);
    if (!best) return null;
    return {
      name: best.name,
      text: lastCriteria
        ? 'Based on what you told the AI Advisor, ' + best.name + ' is the strongest fit here.'
        : best.name +
          ' has the strongest overall rating among these tools — ask the AI Advisor for a recommendation tailored to your exact requirement.',
    };
  }, [hasRows, compareTools, lastCriteria, engine]);

  return (
    <section
      data-screen-label="Compare"
      style={{
        maxWidth: 1160,
        margin: '0 auto',
        padding: layout.pagePad,
        animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <h1 style={{ fontSize: 32, margin: '0 0 8px' }}>Compare Tools</h1>
      <p style={{ color: c.ink(0.6), fontSize: 14, margin: '0 0 28px' }}>
        Put up to four AI tools side-by-side and see what actually differs.
      </p>

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
            <Icon name="layers" size={34} />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: 17 }}>Nothing to compare yet</h3>
          <p style={{ color: c.ink(0.55), fontSize: '13.5px', margin: '0 0 18px' }}>
            Add tools from Discover, Saved, or a Tool page.
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
      ) : null}

      {needsMore ? (
        <p style={{ fontSize: 13, color: c.ink(0.55), marginBottom: 16 }}>
          Add at least one more tool to see a full comparison.
        </p>
      ) : null}

      {!isEmpty ? (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
          {cards.map((t) => (
            <div
              key={t.id}
              style={{
                width: 220,
                background: c.surface,
                borderRadius: 10,
                padding: 14,
                boxShadow: `0 0 0 1px ${c.ring}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ToolLogo
                  initials={t.initials}
                  logoUrl={t.logoUrl}
                  size={32}
                  radius={8}
                  fontSize={12}
                />
                <a
                  href={t.detailHref}
                  style={{
                    textDecoration: 'none',
                    color: c.text,
                    fontSize: '13.5px',
                    fontWeight: 500,
                  }}
                >
                  {t.name}
                </a>
              </div>
              <button
                type="button"
                onClick={t.onToggleCompare}
                style={{
                  fontSize: '11.5px',
                  color: c.ink(0.5),
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0,
                }}
              >
                Remove
              </button>
            </div>
          ))}

          {canAddMore ? (
            <div
              style={{
                width: 240,
                background: c.ink(0.02),
                border: `1px dashed ${c.ink(0.2)}`,
                borderRadius: 10,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <input
                value={compareSearch}
                onChange={(e) => setCompareSearch(e.target.value)}
                placeholder="Add a tool…"
                style={{
                  minHeight: 32,
                  background: c.surfaceAlt,
                  border: `1px solid ${c.ink(0.14)}`,
                  borderRadius: 6,
                  padding: '0 8px',
                  color: c.text,
                  fontSize: '12.5px',
                  fontFamily: 'Inter',
                  outline: 'none',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  maxHeight: 140,
                  overflow: 'auto',
                }}
              >
                {candidates.map((cand) => (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => toggleCompare(cand.id)}
                    style={{
                      textAlign: 'left',
                      fontSize: 12,
                      background: 'none',
                      border: 'none',
                      color: c.text,
                      padding: '6px 4px',
                      cursor: 'pointer',
                      borderRadius: 5,
                    }}
                  >
                    + {cand.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {hasRows ? (
        <>
          <div style={{ overflowX: 'auto', marginBottom: 28 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      fontSize: 11,
                      color: c.ink(0.5),
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      borderBottom: `1px solid ${c.ink(0.12)}`,
                    }}
                  >
                    Criteria
                  </th>
                  {cards.map((t) => (
                    <th
                      key={t.id}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        fontSize: 13,
                        color: c.text,
                        borderBottom: `1px solid ${c.ink(0.12)}`,
                      }}
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td
                      style={{
                        padding: '12px 14px',
                        color: c.ink(0.55),
                        borderBottom: `1px solid ${c.ink(0.06)}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.label}
                    </td>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        style={{
                          padding: '12px 14px',
                          color: c.text,
                          borderBottom: `1px solid ${c.ink(0.06)}`,
                        }}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {recommendation ? (
            <div
              style={{
                background: c.verdictPanel,
                border: `1px solid ${c.accentBorder}`,
                borderRadius: 12,
                padding: 22,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: c.accentText,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Orbit Recommendation
              </span>
              <p style={{ margin: '8px 0 0', fontSize: '14.5px', color: c.text, lineHeight: 1.6 }}>
                {recommendation.text}
              </p>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

export default Compare;
