import { useMemo } from 'react';
import Icon from '../components/Icon.jsx';
import ToolLogo from '../components/ToolLogo.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { BUDGET_OPTIONS, EXAMPLE_PROMPTS, SKILL_OPTIONS } from '../lib/content.js';

/** Selectable pill used for the budget and skill-level chip rows. */
function ChipGroup({ label, options, value, onPick, c }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          fontSize: 11,
          color: c.ink(0.45),
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onPick(o.id)}
              style={{
                fontSize: 12,
                padding: '6px 11px',
                borderRadius: 7,
                border: `1px solid ${active ? c.accent : c.ink(0.16)}`,
                background: active ? c.accentSoftStrong : 'transparent',
                color: active ? c.accentText : c.text,
                cursor: 'pointer',
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Advisor() {
  const {
    c,
    layout,
    CATEGORIES,
    buildCard,
    advisorText,
    setAdvisorText,
    advisorBudget,
    setAdvisorBudget,
    advisorSkill,
    setAdvisorSkill,
    advisorTask,
    setAdvisorTask,
    advisorResult,
    advisorLoading,
    runAdvisor,
    resetAdvisor,
  } = useOrbit();

  const enriched = useMemo(
    () =>
      (advisorResult || []).map((item, idx) => ({
        ...buildCard(item.tool),
        score: item.score,
        reasons: item.reasons,
        reasonsJoined: item.reasons.slice(0, 2).join(' · '),
        rank: idx + 1,
      })),
    [advisorResult, buildCard],
  );

  const best = enriched[0];
  const alternatives = enriched.slice(1);

  const onSubmit = (e) => {
    e.preventDefault();
    runAdvisor();
  };

  return (
    <section
      data-screen-label="AI Advisor"
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: layout.pagePad,
        animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: c.accentText,
            border: '1px solid rgba(145,132,217,0.35)',
            background: 'rgba(145,132,217,0.08)',
            padding: '6px 14px',
            borderRadius: 20,
            marginBottom: 18,
          }}
        >
          <Icon name="sparkle" size={13} />
          AI Advisor
        </div>
        <h1 style={{ fontSize: layout.advisorTitleSize, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
          Describe what you need. Orbit finds the fit.
        </h1>
        <p style={{ color: c.ink(0.65), fontSize: '14.5px', margin: '0 auto', maxWidth: 540 }}>
          A deterministic match engine — ranked recommendations, explained in plain language, no
          external AI required.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        style={{
          background: c.surface,
          border: `1px solid ${c.ink(0.14)}`,
          borderRadius: 14,
          padding: 20,
          boxShadow: `0 0 0 1px ${c.ring}, ${c.shadowMd}`,
        }}
      >
        <textarea
          value={advisorText}
          onChange={(e) => setAdvisorText(e.target.value)}
          placeholder="I need a free AI tool to create a professional presentation. I'm a beginner."
          rows={3}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: c.text,
            outline: 'none',
            fontSize: 16,
            fontFamily: 'Inter',
            resize: 'vertical',
            lineHeight: 1.5,
            boxSizing: 'border-box',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginTop: 14,
            paddingTop: 16,
            borderTop: `1px solid ${c.ink(0.1)}`,
          }}
        >
          <ChipGroup
            label="Budget"
            options={BUDGET_OPTIONS}
            value={advisorBudget}
            onPick={setAdvisorBudget}
            c={c}
          />
          <ChipGroup
            label="Skill level"
            options={SKILL_OPTIONS}
            value={advisorSkill}
            onPick={setAdvisorSkill}
            c={c}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 180 }}>
            <span
              style={{
                fontSize: 11,
                color: c.ink(0.45),
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Task
            </span>
            <select
              value={advisorTask}
              onChange={(e) => setAdvisorTask(e.target.value)}
              style={{
                minHeight: 32,
                padding: '0 8px',
                background: c.surfaceAlt,
                border: `1px solid ${c.ink(0.16)}`,
                borderRadius: 7,
                color: c.text,
                fontSize: '12.5px',
                fontFamily: 'Inter',
              }}
            >
              <option value="any">Any category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button
            type="submit"
            style={{
              background: c.accent,
              color: c.onAccent,
              border: 'none',
              padding: '12px 26px',
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Find My AI Match
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </form>

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: 20,
        }}
      >
        {EXAMPLE_PROMPTS.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => setAdvisorText(text)}
            style={{
              fontSize: '12.5px',
              padding: '8px 14px',
              borderRadius: 20,
              border: `1px solid ${c.ink(0.14)}`,
              background: c.ink(0.02),
              color: c.ink(0.7),
              cursor: 'pointer',
            }}
          >
            {text}
          </button>
        ))}
      </div>

      {advisorLoading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: '2px solid rgba(145,132,217,0.25)',
              borderTopColor: c.accent,
              animation: 'orbitSpin 0.8s linear infinite',
            }}
          />
          <p style={{ fontSize: '13.5px', color: c.ink(0.55) }}>
            Scoring the catalog against your requirement…
          </p>
        </div>
      ) : null}

      {best ? (
        <div style={{ marginTop: 44, animation: 'fadeUp 0.5s ease both' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18,
            }}
          >
            <h2 style={{ fontSize: 20, margin: 0 }}>Your recommendations</h2>
            <button
              type="button"
              onClick={resetAdvisor}
              style={{
                background: 'none',
                border: `1px solid ${c.ink(0.16)}`,
                color: c.text,
                fontSize: '12.5px',
                padding: '8px 14px',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Try another requirement
            </button>
          </div>

          {/* ------------------------------------------------- best match */}
          <div
            style={{
              border: `1px solid ${c.accent}`,
              background: c.matchPanel,
              borderRadius: 14,
              padding: 26,
              marginBottom: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: c.onAccent,
                  background: c.accent,
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontWeight: 700,
                }}
              >
                Best Match
              </span>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <ToolLogo
                initials={best.initials}
                logoUrl={best.logoUrl}
                size={56}
                radius={14}
                fontSize={18}
                style={{ background: 'rgba(145,132,217,0.18)' }}
              />

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <a
                    href={best.detailHref}
                    style={{ textDecoration: 'none', color: c.text, fontSize: 24, fontWeight: 600 }}
                  >
                    {best.name}
                  </a>
                  <span style={{ fontSize: 22, fontWeight: 700, color: c.accentText }}>
                    {best.score}% Match
                  </span>
                </div>

                <p style={{ color: c.ink(0.7), fontSize: '13.5px', margin: '8px 0 14px' }}>
                  {best.description}
                </p>

                <p
                  style={{
                    fontSize: 12,
                    color: c.ink(0.5),
                    margin: '0 0 10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Why it matches
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                  {best.reasons.map((rs, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'flex-start',
                        fontSize: '13.5px',
                        color: c.text,
                      }}
                    >
                      <span style={{ color: c.accentText, flex: 'none', marginTop: 1 }}>
                        <Icon name="check" size={15} />
                      </span>
                      {rs}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a
                    href={best.detailHref}
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
                    View Details
                  </a>
                  <a
                    href={best.website}
                    target="_blank"
                    rel="noopener"
                    style={{
                      textDecoration: 'none',
                      border: `1px solid ${c.accent}`,
                      color: c.accentText,
                      padding: '10px 20px',
                      borderRadius: 8,
                      fontSize: '13.5px',
                    }}
                  >
                    Visit Website
                  </a>
                  <button
                    type="button"
                    onClick={best.onToggleSave}
                    style={{
                      border: `1px solid ${c.ink(0.16)}`,
                      background: 'transparent',
                      color: c.text,
                      padding: '10px 16px',
                      borderRadius: 8,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Icon name={best.isSaved ? 'bookmarkFilled' : 'bookmark'} size={15} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------ alternatives */}
          <p
            style={{
              fontSize: 12,
              color: c.ink(0.5),
              margin: '0 0 10px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Alternatives
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alternatives.map((a) => (
              <a
                key={a.id}
                href={a.detailHref}
                style={{
                  textDecoration: 'none',
                  color: c.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  background: c.surface,
                  borderRadius: 10,
                  padding: '14px 16px',
                  boxShadow: `0 0 0 1px ${c.ring}`,
                }}
              >
                <ToolLogo
                  initials={a.initials}
                  logoUrl={a.logoUrl}
                  size={38}
                  radius={10}
                  fontSize={13}
                  style={{ background: 'rgba(145,132,217,0.12)' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14.5px', fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: c.ink(0.55) }}>{a.reasonsJoined}</div>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: c.accentText, flex: 'none' }}>
                  {a.score}%
                </span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default Advisor;
