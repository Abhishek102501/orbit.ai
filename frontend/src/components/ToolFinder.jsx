import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Hoverable from './Hoverable.jsx';
import SocialProof from './SocialProof.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { categoryName } from '../lib/tools.js';
import { EXAMPLE_PROMPTS, PROMPT_ICONS } from '../lib/content.js';

/** The two beats shown while the engine runs. Short on purpose — no invented waiting. */
const STAGES = [
  { key: 'thinking', label: 'Understanding your goal', ms: 280 },
  { key: 'searching', label: 'Finding the best AI tools', ms: 320 },
];

/** One ranked recommendation. `rank === 0` gets the best-match treatment. */
function MatchCard({ item, rank }) {
  const { c } = useOrbit();
  const { tool, score, reasons } = item;
  const best = rank === 0;
  // The engine lists the category reason first ("Built for video work"), which reads
  // identically across every result in a category. Prefer a specific hit — a matched use
  // case, feature or budget signal — and keep the category line only as the fallback.
  const list = reasons || [];
  const why =
    list.find((r) => !/^Built for /.test(r)) || list[0] || 'Relevant AI capabilities';

  return (
    <Hoverable
      as="a"
      href={`#/tool/${tool.slug}`}
      className="tf-result"
      style={{
        display: 'block',
        textDecoration: 'none',
        color: c.text,
        background: best ? c.matchPanel : c.ink(0.03),
        border: `1px solid ${best ? c.accentBorder : c.ink(0.12)}`,
        borderRadius: 14,
        padding: best ? 20 : 16,
        transition: 'border-color 0.25s ease, transform 0.25s ease',
        animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${rank * 0.07}s both`,
      }}
      hoverStyle={{ borderColor: c.accent, transform: 'translateY(-2px)' }}
    >
      {best ? (
        <span
          style={{
            display: 'inline-block',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: c.accentText,
            marginBottom: 10,
          }}
        >
          Best match
        </span>
      ) : null}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: best ? 18 : 15, fontWeight: 600 }}>{tool.name}</span>
        <span
          style={{
            fontSize: 10.5,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: c.ink(0.5),
          }}
        >
          {categoryName(tool.category)}
        </span>
      </div>

      <p style={{ fontSize: 13, lineHeight: 1.55, color: c.ink(0.65), margin: '8px 0 0' }}>{why}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
        <span style={{ fontSize: 11, color: c.ink(0.5), flex: 'none' }}>Match</span>
        <span
          aria-hidden="true"
          style={{
            flex: 1,
            minWidth: 40,
            height: 5,
            borderRadius: 3,
            background: c.ink(0.1),
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              display: 'block',
              width: `${score}%`,
              height: '100%',
              borderRadius: 3,
              background: c.accent,
              transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: c.accentText, flex: 'none' }}>
          {score}%
        </span>
        <span
          className="tf-arrow"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12.5,
            color: c.accentText,
            flex: 'none',
          }}
        >
          View tool
          <Icon name="arrowRight" size={13} />
        </span>
      </div>
    </Hoverable>
  );
}

/**
 * The home-page tool finder: one command input over the same recommendation engine the
 * Advisor page runs, with the top matches revealed in place. "See the full analysis"
 * hands the same query to the Advisor for the complete ranked breakdown, so this is an
 * entry point to that flow rather than a second copy of it.
 */
export function ToolFinder() {
  const { c, layout, heroQuery, setHeroQuery, setAdvisorText, go, quickMatch } = useOrbit();

  const [stage, setStage] = useState('idle'); // idle | thinking | searching | done
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const text = heroQuery.trim();
      if (!text) {
        if (inputRef.current) inputRef.current.focus();
        return;
      }

      clearTimers();
      setStage(STAGES[0].key);
      // The engine is synchronous and fast; the two beats exist to make the hand-off
      // legible, not to simulate work.
      timers.current.push(
        setTimeout(() => setStage(STAGES[1].key), STAGES[0].ms),
        setTimeout(() => {
          setResults(quickMatch(text, 3));
          setStage('done');
        }, STAGES[0].ms + STAGES[1].ms),
      );
    },
    [heroQuery, quickMatch],
  );

  const onPick = (text) => {
    setHeroQuery(text);
    setStage('idle');
    setResults([]);
    if (inputRef.current) inputRef.current.focus();
  };

  const busy = stage === 'thinking' || stage === 'searching';
  const activeStage = STAGES.find((s) => s.key === stage);

  return (
    <>
      <h2
        style={{
          fontSize: layout.finderTitleSize,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          margin: '0 0 10px',
          maxWidth: 620,
        }}
      >
        Find the perfect AI for what you need.
      </h2>
      <p
        style={{
          fontSize: 14.5,
          lineHeight: 1.6,
          color: c.ink(0.62),
          margin: '0 0 26px',
          maxWidth: 520,
        }}
      >
        Tell us what you&apos;re trying to accomplish and we&apos;ll find the best AI tools for you.
      </p>

      <form onSubmit={onSubmit}>
        <div
          className={focused ? 'tf-field tf-field-on' : 'tf-field'}
          style={{
            display: 'flex',
            flexDirection: layout.heroFormDir,
            alignItems: layout.isMobile ? 'stretch' : 'center',
            gap: 10,
            background: c.ink(0.03),
            border: `1px solid ${focused ? c.accent : c.ink(0.14)}`,
            borderRadius: 16,
            padding: 8,
            transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: layout.isMobile ? 'none' : 'flex',
              alignItems: 'center',
              paddingLeft: 12,
              color: focused ? c.accentText : c.ink(0.4),
              transition: 'color 0.25s ease',
              flex: 'none',
            }}
          >
            <Icon name="sparkle" size={17} />
          </span>

          <label htmlFor="finder-input" className="sr-only">
            Describe what you&apos;re trying to accomplish
          </label>
          <input
            id="finder-input"
            ref={inputRef}
            value={heroQuery}
            onChange={(e) => setHeroQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Describe what you're trying to accomplish..."
            autoComplete="off"
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: 52,
              padding: layout.isMobile ? '0 14px' : '0 12px',
              fontSize: 15.5,
              background: 'transparent',
              border: 'none',
              color: c.text,
              outline: 'none',
              fontFamily: 'Inter',
            }}
          />

          <Hoverable
            as="button"
            type="submit"
            id="heroSendBtn"
            className="tf-cta"
            disabled={busy}
            style={{
              minHeight: 52,
              padding: '0 22px',
              background: c.accent,
              border: `1px solid ${c.accent}`,
              borderRadius: 12,
              color: c.onAccent,
              fontWeight: 600,
              fontSize: 14.5,
              fontFamily: 'Inter',
              cursor: busy ? 'progress' : 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              flex: 'none',
              transition: 'filter 0.25s ease, box-shadow 0.25s ease',
            }}
            hoverStyle={busy ? undefined : { filter: 'brightness(1.07)' }}
          >
            {busy ? (
              <span
                aria-hidden="true"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: `2px solid ${c.ink(0.25)}`,
                  borderTopColor: c.onAccent,
                  animation: 'orbitSpin 0.8s linear infinite',
                }}
              />
            ) : null}
            {busy ? 'Searching' : 'Find the Right AI'}
            {busy ? null : (
              <span className="tf-arrow" style={{ display: 'flex' }}>
                <Icon name="arrowRight" size={15} />
              </span>
            )}
          </Hoverable>
        </div>
      </form>

      {/* ------------------------------------------------------- suggestions */}
      {stage === 'idle' ? (
        <div style={{ marginTop: 20 }}>
          <span
            style={{
              display: 'block',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: c.ink(0.42),
              marginBottom: 12,
            }}
          >
            Try something like
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {EXAMPLE_PROMPTS.map((text) => (
              <Hoverable
                as="button"
                key={text}
                type="button"
                onClick={() => onPick(text)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  fontSize: 12.5,
                  fontFamily: 'Inter',
                  padding: '9px 14px',
                  borderRadius: 10,
                  border: `1px solid ${c.ink(0.12)}`,
                  background: c.ink(0.02),
                  color: c.ink(0.75),
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease',
                }}
                hoverStyle={{
                  borderColor: c.accentBorder,
                  background: c.accentSoft,
                  color: c.text,
                }}
              >
                <span style={{ color: c.accentText, display: 'flex', flex: 'none' }}>
                  <Icon name={PROMPT_ICONS[text] || 'sparkle'} size={14} />
                </span>
                {text}
              </Hoverable>
            ))}
          </div>
        </div>
      ) : null}

      {/* ------------------------------------------------------------ status */}
      <p
        role="status"
        aria-live="polite"
        style={{
          display: stage === 'idle' ? 'none' : 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          color: stage === 'done' ? c.pros : c.accentText,
          margin: '20px 0 0',
          minHeight: 20,
        }}
      >
        {stage === 'done' ? (
          <Icon name="check" size={14} />
        ) : (
          <span className="tf-pulse" style={{ display: 'flex' }}>
            <Icon name="sparkle" size={14} />
          </span>
        )}
        {stage === 'done' ? 'Best matches found' : `${activeStage ? activeStage.label : ''}…`}
      </p>

      {/* ----------------------------------------------------------- results */}
      {stage === 'done' && results.length ? (
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          {results.map((item, i) => (
            <MatchCard key={item.tool.id} item={item} rank={i} />
          ))}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
            <Hoverable
              as="button"
              type="button"
              onClick={() => {
                setAdvisorText(heroQuery);
                go('#/advisor');
              }}
              style={{
                fontSize: 13,
                fontFamily: 'Inter',
                color: c.accentText,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
              hoverStyle={{ color: c.accent }}
            >
              See the full analysis
              <Icon name="arrowRight" size={13} />
            </Hoverable>
            <Hoverable
              as="button"
              type="button"
              onClick={() => {
                setStage('idle');
                setResults([]);
                setHeroQuery('');
              }}
              style={{
                fontSize: 13,
                fontFamily: 'Inter',
                color: c.ink(0.55),
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              hoverStyle={{ color: c.text }}
            >
              Start over
            </Hoverable>
          </div>
        </div>
      ) : null}

      <SocialProof
        ring={c.surface}
        style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${c.ink(0.1)}` }}
      />
    </>
  );
}

export default ToolFinder;
