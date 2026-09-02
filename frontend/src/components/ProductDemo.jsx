import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Hoverable from './Hoverable.jsx';
import ToolLogo from './ToolLogo.jsx';
import { MatchBar, MatchScore } from './MatchBar.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { DEMO_SCENARIOS } from '../lib/content.js';
import { prefersReducedMotion } from '../lib/motion.js';

/**
 * The interactive product demonstration.
 *
 * Nothing here is staged. "Run Orbit" calls `quickMatch`, which is the same
 * `engine.recommend()` the Advisor page runs — the scores, the ranking and the
 * reasons on screen are the ones a visitor gets by typing the same sentence into the
 * real product. The engine is deterministic and already lives in the browser, so a
 * demo built on canned results would have been *less* honest and no simpler.
 *
 * The presets exist because a good demonstration picks good examples, not because
 * the output is fixed: edit the requirement freely and the panel answers for real.
 *
 * ── layout stability ───────────────────────────────────────────────────────
 * Both panels hold a fixed height for the whole sequence. The results do not push
 * anything as they arrive; they fade into space that was already reserved. Nothing
 * in the run animates a layout property.
 */
const STAGES = [
  { key: 'thinking', label: 'Understanding your requirement' },
  { key: 'searching', label: 'Searching matching AI tools' },
  { key: 'ranking', label: 'Ranking the best matches' },
];

export function ProductDemo() {
  const { c, layout, quickMatch, setAdvisorText, go } = useOrbit();

  const [requirement, setRequirement] = useState(DEMO_SCENARIOS[0].requirement);
  const [activeScenario, setActiveScenario] = useState(DEMO_SCENARIOS[0].id);
  const [tab, setTab] = useState('requirement');
  const [stage, setStage] = useState('idle'); // idle | thinking | searching | ranking | done
  const [results, setResults] = useState([]);
  const timers = useRef([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const run = useCallback(() => {
    const text = requirement.trim();
    if (!text) return;

    // Re-running mid-sequence must not leave an older timeline still firing.
    clearTimers();
    setResults([]);
    // Deliberately does not switch tabs. Jumping to Process moved the scenario
    // chips out from under the cursor, so choosing a second scenario meant finding
    // the way back first. The stages render in the results pane instead, and the
    // Process tab mirrors them for anyone who opens it.

    const reduced = prefersReducedMotion();
    const step = reduced ? 0 : 420;

    setStage(STAGES[0].key);
    timers.current.push(
      setTimeout(() => setStage(STAGES[1].key), step),
      setTimeout(() => setStage(STAGES[2].key), step * 2),
      setTimeout(() => {
        setResults(quickMatch ? quickMatch(text, 3) : []);
        setStage('done');
      }, step * 3),
    );
  }, [requirement, quickMatch, clearTimers]);

  const clear = useCallback(() => {
    clearTimers();
    setRequirement('');
    setActiveScenario(null);
    setResults([]);
    setStage('idle');
    setTab('requirement');
  }, [clearTimers]);

  const pickScenario = useCallback(
    (s) => {
      clearTimers();
      setRequirement(s.requirement);
      setActiveScenario(s.id);
      setResults([]);
      setStage('idle');
      setTab('requirement');
    },
    [clearTimers],
  );

  // Hands the same sentence to the Advisor, which is the pattern the hero finder
  // already uses for "see the full analysis".
  const openFullResults = useCallback(() => {
    setAdvisorText(requirement);
    go('#/advisor');
  }, [requirement, setAdvisorText, go]);

  const busy = stage !== 'idle' && stage !== 'done';
  const stacked = layout.isMobile || layout.isTablet;
  // A fixed height, not a minimum. The results pane grew 20px once three rows
  // rendered, which pushed everything below it. Rows now fade into space that was
  // already reserved, and the pane scrolls internally if it ever overflows.
  const paneSize = stacked ? { minHeight: 'auto' } : { height: 452 };

  const tabButton = (id, label, icon) => {
    const on = tab === id;
    return (
      <Hoverable
        as="button"
        type="button"
        onClick={() => setTab(id)}
        aria-pressed={on}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '9px 14px',
          borderRadius: 9,
          border: '1px solid transparent',
          background: on ? c.ink(0.06) : 'transparent',
          color: on ? c.text : c.ink(0.6),
          fontSize: 13,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: on ? 600 : 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'color 0.2s ease, background-color 0.2s ease',
        }}
        hoverStyle={{ color: c.text, background: c.ink(0.05) }}
      >
        <Icon name={icon} size={13} />
        {label}
      </Hoverable>
    );
  };

  return (
    <div
      data-demo-root
      style={{
        display: 'grid',
        gridTemplateColumns: stacked ? '1fr' : '1fr 1fr',
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${c.ink(0.12)}`,
        background: c.surface,
        boxShadow: c.shadowLg,
        textAlign: 'left',
      }}
    >
      {/* ------------------------------------------------------------- input */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...paneSize,
          borderRight: stacked ? 'none' : `1px solid ${c.ink(0.1)}`,
          borderBottom: stacked ? `1px solid ${c.ink(0.1)}` : 'none',
          background: c.ink(0.02),
        }}
      >
        <div
          role="tablist"
          aria-label="Demo input"
          style={{ display: 'flex', gap: 4, padding: 12, borderBottom: `1px solid ${c.ink(0.08)}` }}
        >
          {tabButton('requirement', 'Your Requirement', 'code')}
          {tabButton('process', 'Process', 'layers')}
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, minWidth: 0 }}>
          {tab === 'requirement' ? (
            <>
              <label htmlFor="demo-requirement" className="sr-only">
                Describe what you need an AI tool for
              </label>
              <textarea
                id="demo-requirement"
                value={requirement}
                onChange={(e) => {
                  setRequirement(e.target.value);
                  setActiveScenario(null);
                }}
                spellCheck={false}
                placeholder="Describe what you need an AI tool to do…"
                style={{
                  width: '100%',
                  minHeight: stacked ? 96 : 132,
                  resize: 'vertical',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: `1px solid ${c.ink(0.14)}`,
                  background: c.ink(0.03),
                  color: c.text,
                  outline: 'none',
                  fontFamily: "'JetBrains Mono', 'IBM Plex Mono', monospace",
                  fontSize: 13,
                  lineHeight: 1.6,
                  boxSizing: 'border-box',
                }}
              />

              <span
                className="num"
                style={{
                  display: 'block',
                  margin: '16px 0 10px',
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: c.ink(0.5),
                }}
              >
                Try a scenario
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {DEMO_SCENARIOS.map((s) => {
                  const on = activeScenario === s.id;
                  return (
                    <Hoverable
                      as="button"
                      key={s.id}
                      type="button"
                      onClick={() => pickScenario(s)}
                      aria-pressed={on}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        fontFamily: 'Inter, system-ui, sans-serif',
                        padding: '7px 11px',
                        borderRadius: 8,
                        border: `1px solid ${on ? c.signal : c.ink(0.14)}`,
                        background: on ? c.signalTrack : c.ink(0.02),
                        color: on ? c.signalInk : c.ink(0.72),
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',
                      }}
                      hoverStyle={{ borderColor: c.signal, color: c.text }}
                    >
                      <Icon name={s.icon} size={12} />
                      {s.label}
                    </Hoverable>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <Stages stage={stage} c={c} />
              {stage === 'idle' ? (
                <p style={{ fontSize: 12.5, color: c.ink(0.5), margin: '14px 0 0' }}>
                  Press Run Orbit to score the catalog against your requirement.
                </p>
              ) : null}
            </>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: 16,
            borderTop: `1px solid ${c.ink(0.08)}`,
          }}
        >
          <Hoverable
            as="button"
            type="button"
            onClick={clear}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '10px 14px',
              borderRadius: 9,
              border: `1px solid ${c.ink(0.14)}`,
              background: 'transparent',
              color: c.ink(0.7),
              fontSize: 13,
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
            hoverStyle={{ color: c.text, borderColor: c.ink(0.24) }}
          >
            <Icon name="trash" size={13} />
            Clear
          </Hoverable>

          <Hoverable
            as="button"
            type="button"
            className="tf-cta cta-lift"
            onClick={run}
            disabled={busy || !requirement.trim()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 20px',
              borderRadius: 999,
              border: `1px solid ${c.accent}`,
              background: c.accent,
              color: c.onAccent,
              fontSize: 13.5,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 600,
              cursor: busy ? 'progress' : requirement.trim() ? 'pointer' : 'not-allowed',
              opacity: requirement.trim() ? 1 : 0.55,
              whiteSpace: 'nowrap',
            }}
            hoverStyle={busy ? undefined : { filter: 'brightness(1.06)' }}
          >
            {busy ? (
              <span
                aria-hidden="true"
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  border: `2px solid ${c.ink(0.25)}`,
                  borderTopColor: c.onAccent,
                  animation: 'orbitSpin 0.8s linear infinite',
                }}
              />
            ) : (
              <Icon name="play" size={13} />
            )}
            {busy ? 'Running' : 'Run Orbit'}
          </Hoverable>
        </div>
      </div>

      {/* ----------------------------------------------------------- results */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...paneSize,
          background: c.ink(0.01),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '18px 16px',
            borderBottom: `1px solid ${c.ink(0.08)}`,
          }}
        >
          <span aria-hidden="true" style={{ display: 'flex', color: c.signal }}>
            <Icon name="sparkle" size={14} />
          </span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Orbit&rsquo;s recommendation</span>
          {stage === 'done' && results.length ? (
            <span
              className="num"
              style={{
                marginLeft: 'auto',
                padding: '4px 10px',
                borderRadius: 999,
                background: c.signalTrack,
                color: c.signalInk,
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Top match
            </span>
          ) : null}
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: 16,
            display: 'grid',
            gap: 10,
            alignContent: 'start',
          }}
        >
          {stage === 'done' && results.length
            ? results.map((item, i) => (
                <ResultRow key={item.tool.id} item={item} rank={i} />
              ))
            : busy ? (
              <div style={{ paddingTop: 6 }}>
                <Stages stage={stage} c={c} />
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  minHeight: stacked ? 150 : 260,
                  color: c.ink(0.45),
                  fontSize: 13,
                  textAlign: 'center',
                }}
              >
                <span aria-hidden="true" style={{ color: c.ink(0.3) }}>
                  <Icon name="layers" size={26} />
                </span>
                {busy ? 'Scoring the catalog…' : 'Your ranked matches will appear here.'}
              </div>
            )}
        </div>

        <div style={{ padding: 16, borderTop: `1px solid ${c.ink(0.08)}` }}>
          <Hoverable
            as="button"
            type="button"
            className="tf-cta"
            onClick={openFullResults}
            disabled={!requirement.trim()}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '13px 16px',
              borderRadius: 10,
              border: `1px solid ${c.ink(0.14)}`,
              background: 'transparent',
              color: requirement.trim() ? c.text : c.ink(0.4),
              fontSize: 13.5,
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: requirement.trim() ? 'pointer' : 'not-allowed',
              transition: 'border-color 0.2s ease, background-color 0.2s ease',
            }}
            hoverStyle={
              requirement.trim() ? { borderColor: c.signal, background: c.signalTrack } : undefined
            }
          >
            View full results on Orbit.ai
            <span className="tf-arrow" style={{ display: 'flex', color: c.signal }}>
              <Icon name="arrowRight" size={15} />
            </span>
          </Hoverable>
        </div>
      </div>
    </div>
  );
}

/**
 * The analysis sequence. Rendered in the results pane during a run and mirrored by
 * the Process tab, from one definition so the two cannot disagree.
 */
function Stages({ stage, c }) {
  const index = STAGES.findIndex((x) => x.key === stage);
  return (
    <ol
      aria-live="polite"
      style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}
    >
      {STAGES.map((item, i) => {
        const done = stage === 'done' || (index > -1 && i < index);
        const current = item.key === stage;
        return (
          <li
            key={item.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              fontSize: 13,
              color: done || current ? c.text : c.ink(0.45),
              transition: 'color 0.3s ease',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 20,
                height: 20,
                flex: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${done || current ? c.signal : c.ink(0.16)}`,
                background: done ? c.signalTrack : 'transparent',
                color: c.signal,
                transition: 'border-color 0.3s ease, background-color 0.3s ease',
              }}
            >
              {done ? <Icon name="check" size={11} /> : null}
              {current ? (
                <span
                  className="tf-pulse"
                  style={{ width: 5, height: 5, borderRadius: '50%', background: c.signal }}
                />
              ) : null}
            </span>
            {item.label}
          </li>
        );
      })}
    </ol>
  );
}

/** One ranked row. Real tool, real score, real reason. */
function ResultRow({ item, rank }) {
  const { c } = useOrbit();
  const { tool, score, reasons } = item;
  const best = rank === 0;
  const scoreId = `demo-score-${tool.id}`;
  const list = reasons || [];
  const why = list.find((r) => !/^Built for /.test(r)) || list[0] || '';

  return (
    <article
      className="demo-result"
      style={{
        // Delay is per position, so the three arrive in order.
        animationDelay: `${rank * 140}ms`,
        display: 'flex',
        gap: 12,
        padding: '13px 14px',
        borderRadius: 12,
        border: `1px solid ${best ? c.signal : c.ink(0.12)}`,
        background: best ? c.signalTrack : c.ink(0.03),
      }}
    >
      <span
        className="num"
        aria-hidden="true"
        style={{
          flex: 'none',
          width: 22,
          height: 22,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10.5,
          background: best ? c.signal : c.ink(0.08),
          // The ground colour is what reads on the mint fill in either theme.
          color: best ? c.bg : c.ink(0.7),
        }}
      >
        {rank + 1}
      </span>

      <ToolLogo initials={tool.initials} logoUrl={tool.logoUrl} size={34} radius={9} fontSize={12} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
          <a
            id={scoreId}
            href={`#/tool/${tool.slug}`}
            style={{ fontSize: 14, fontWeight: 600, color: c.text, textDecoration: 'none' }}
          >
            {tool.name}
          </a>
          <MatchScore score={score} size="15px" />
        </div>
        <p style={{ margin: '4px 0 0', fontSize: 12.5, lineHeight: 1.5, color: c.ink(0.62) }}>
          {why}
        </p>
        <div style={{ marginTop: 9 }}>
          <MatchBar score={score} labelId={scoreId} height={11} />
        </div>
      </div>
    </article>
  );
}

export default ProductDemo;
