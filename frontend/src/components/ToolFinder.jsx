import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Hoverable from './Hoverable.jsx';
import SocialProof from './SocialProof.jsx';
import { MatchBar, MatchScore } from './MatchBar.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { categoryName } from '../lib/tools.js';
import { EXAMPLE_PROMPTS, PROMPT_ICONS } from '../lib/content.js';

/** The two beats shown while the engine runs. Short on purpose — no invented waiting. */
const STAGES = [
  { key: 'thinking', label: 'Understanding your goal', ms: 280 },
  { key: 'searching', label: 'Finding the best AI tools', ms: 320 },
];

/**
 * One ranked recommendation, read top to bottom in the order the page promises:
 * which tool, how well it scores, and why it scored that way.
 *
 * `rank === 0` is the best match and gets the full readout — the large score, the
 * gauge, and up to two reasons. The runners-up get the same instrument at a
 * smaller size so the row reads as one scale rather than three unrelated cards.
 */
function MatchCard({ item, rank }) {
  const { c, layout } = useOrbit();
  const { tool, score, reasons } = item;
  const best = rank === 0;
  const scoreId = `match-score-${tool.id}`;

  // The engine lists the category reason first ("Built for video work"), which reads
  // identically across every result in a category. Prefer the specific hits — a matched
  // use case, feature or budget signal — and keep the category line only as the fallback.
  const list = reasons || [];
  const specific = list.filter((r) => !/^Built for /.test(r));
  const why = (specific.length ? specific : list).slice(0, best ? 2 : 1);

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
        borderLeft: `2px solid ${best ? c.signal : c.ink(0.12)}`,
        borderRadius: 10,
        padding: best ? '18px 20px' : '14px 16px',
        transition: 'border-color 0.25s ease, background-color 0.25s ease',
        animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${rank * 0.07}s both`,
      }}
      hoverStyle={{ borderColor: c.accent, borderLeftColor: c.signal, background: best ? c.matchPanel : c.ink(0.05) }}
    >
      {/* ---- what matched, and how well ---- */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {best ? (
            <span
              className="num"
              style={{
                display: 'block',
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: c.signalInk,
                marginBottom: 7,
              }}
            >
              Best match
            </span>
          ) : null}

          <span
            id={scoreId}
            style={{
              display: 'block',
              fontSize: best ? 20 : 15.5,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {tool.name}
          </span>

          <span
            style={{
              display: 'block',
              marginTop: 3,
              fontSize: 10.5,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: c.ink(0.62),
            }}
          >
            {categoryName(tool.category)}
          </span>
        </div>

        <MatchScore
          score={score}
          size={best ? layout.matchScoreSize : layout.matchScoreSizeAlt}
        />
      </div>

      {/* ---- the measurement ---- */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, margin: best ? '16px 0 0' : '12px 0 0' }}>
        <MatchBar score={score} labelId={scoreId} height={best ? 18 : 13} />
      </div>

      {/* ---- why it scored that way ---- */}
      <ul
        style={{
          listStyle: 'none',
          margin: best ? '14px 0 0' : '10px 0 0',
          padding: 0,
          display: 'grid',
          gap: 5,
        }}
      >
        {why.map((reason) => (
          <li
            key={reason}
            style={{
              display: 'flex',
              gap: 7,
              fontSize: best ? 13.5 : 12.5,
              lineHeight: 1.5,
              color: c.ink(0.75),
            }}
          >
            <span aria-hidden="true" style={{ color: c.signal, flex: 'none', marginTop: 1 }}>
              <Icon name="check" size={13} />
            </span>
            {reason}
          </li>
        ))}
      </ul>

      {best ? (
        <span
          className="tf-arrow"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            marginTop: 14,
            fontSize: 12.5,
            color: c.accentText,
          }}
        >
          View tool
          <Icon name="arrowRight" size={13} />
        </span>
      ) : null}
    </Hoverable>
  );
}

/**
 * The home-page tool finder, and now the hero's primary interaction: one command
 * input over the same recommendation engine the Advisor page runs, with the top
 * matches revealed in place. "See the full analysis" hands the same query to the
 * Advisor for the complete ranked breakdown, so this is an entry point to that flow
 * rather than a second copy of it.
 *
 * The headline and supporting copy live in the hero (pages/Home.jsx) so the page has
 * exactly one <h1>; this renders from the input down.
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
      <form onSubmit={onSubmit}>
        <div
          className={focused ? 'tf-field tf-field-on' : 'tf-field'}
          style={{
            display: 'flex',
            flexDirection: layout.heroFormDir,
            alignItems: layout.isMobile ? 'stretch' : 'center',
            gap: 10,
            background: c.ink(0.03),
            border: `1px solid ${focused ? c.signal : c.ink(0.16)}`,
            borderRadius: 12,
            padding: 7,
            transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: layout.isMobile ? 'none' : 'flex',
              alignItems: 'center',
              paddingLeft: 12,
              color: focused ? c.signal : c.ink(0.45),
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
            placeholder="Describe what you&#39;re trying to accomplish…"
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: 54,
              padding: layout.isMobile ? '0 14px' : '0 12px',
              fontSize: 16,
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
              minHeight: 54,
              padding: '0 24px',
              background: c.accent,
              border: `1px solid ${c.accent}`,
              borderRadius: 9,
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
              fontSize: 10.5,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: c.ink(0.62),
              marginBottom: 11,
            }}
            className="num"
          >
            Try
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
                  padding: '9px 13px',
                  borderRadius: 8,
                  border: `1px solid ${c.ink(0.14)}`,
                  background: c.ink(0.02),
                  color: c.ink(0.75),
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease',
                }}
                hoverStyle={{
                  borderColor: c.signal,
                  background: c.signalTrack,
                  color: c.text,
                }}
              >
                <span style={{ color: c.signal, display: 'flex', flex: 'none' }}>
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
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: stage === 'done' ? c.signalInk : c.ink(0.7),
          margin: '26px 0 0',
          minHeight: 20,
        }}
        className="num"
      >
        {stage === 'done' ? (
          <Icon name="check" size={14} />
        ) : (
          <span className="tf-pulse" style={{ display: 'flex' }}>
            <Icon name="sparkle" size={14} />
          </span>
        )}
        {stage === 'done'
          ? `${results.length} matches scored`
          : `${activeStage ? activeStage.label : ''}…`}
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
        ring={c.bg}
        style={{ marginTop: 30, paddingTop: 22, borderTop: `1px solid ${c.ink(0.1)}` }}
      />
    </>
  );
}

export default ToolFinder;
