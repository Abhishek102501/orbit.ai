import { useCallback, useEffect, useRef, useState } from 'react';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { DUR, EASE, prefersReducedMotion } from '../lib/motion.js';

/**
 * A sequence read by scrolling: the step list stays pinned on the left while each
 * step's panel passes through on the right, and the list marks where you are.
 *
 * The active step is resolved with an IntersectionObserver rather than a scroll
 * handler — it fires only when a panel crosses the middle band of the viewport, so
 * there is no work on the majority of frames. `rootMargin` shrinks the observation
 * box to that band; whichever panel occupies it is the current step.
 *
 * The list is not decoration. Each entry is a real button that moves to its panel, so
 * the sequence is navigable from the keyboard and not only by scrolling.
 *
 * Below the desktop breakpoint the pinning is dropped entirely: on a short viewport a
 * sticky column and a scrolling column compete for the same space. Each step becomes
 * an ordinary stacked block with its own heading.
 */
export function StepScroller({ steps, ariaLabel = 'How it works' }) {
  const { c, layout } = useOrbit();
  const [active, setActive] = useState(0);
  const panelRefs = useRef([]);
  const pinned = !layout.isMobile && !layout.isTablet;

  useEffect(() => {
    if (!pinned) return undefined;
    const nodes = panelRefs.current.filter(Boolean);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = nodes.indexOf(entry.target);
            if (index !== -1) setActive(index);
          }
        });
      },
      // A narrow band across the middle of the viewport.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [pinned, steps.length]);

  const goTo = useCallback((index) => {
    const el = panelRefs.current[index];
    if (!el) return;
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: pinned ? 'row' : 'column',
        gap: pinned ? 64 : 32,
        alignItems: 'flex-start',
      }}
    >
      {/* ------------------------------------------------------- step list */}
      {pinned ? (
        <nav
          aria-label={ariaLabel}
          style={{
            position: 'sticky',
            // Clears the floating header capsule.
            top: 120,
            flex: '0 0 260px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {steps.map((step, i) => {
            const on = i === active;
            return (
              <button
                key={step.n}
                type="button"
                onClick={() => goTo(i)}
                aria-current={on ? 'step' : undefined}
                style={{
                  appearance: 'none',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  borderBottom: `1px solid ${on ? c.signal : c.ink(0.12)}`,
                  padding: '14px 2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 14.5,
                  fontWeight: on ? 600 : 400,
                  color: on ? c.text : c.ink(0.5),
                  transition: `color ${DUR.slow} ${EASE}, border-color ${DUR.slow} ${EASE}, font-weight ${DUR.slow} ${EASE}`,
                }}
              >
                <span
                  className="num"
                  aria-hidden="true"
                  style={{
                    fontSize: 11,
                    color: on ? c.signalInk : c.ink(0.35),
                    transition: `color ${DUR.slow} ${EASE}`,
                  }}
                >
                  {step.n}
                </span>
                {step.title}
              </button>
            );
          })}
        </nav>
      ) : null}

      {/* ---------------------------------------------------------- panels */}
      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          flex: 1,
          minWidth: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: pinned ? 0 : 28,
        }}
      >
        {steps.map((step, i) => (
          <li
            key={step.n}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            style={{
              // Each panel occupies enough of the scroll for its step to hold the
              // middle band on its own; stacked, they are just blocks.
              minHeight: pinned ? '38vh' : 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingBottom: pinned ? 32 : 0,
            }}
          >
            {!pinned ? (
              <span
                className="num"
                style={{ fontSize: 11, color: c.signalInk, letterSpacing: '0.14em' }}
              >
                {step.n}
              </span>
            ) : null}

            <h3
              className="hero-display"
              style={{
                fontWeight: 600,
                fontSize: pinned ? 'clamp(24px, 2.4vw, 32px)' : 22,
                letterSpacing: '-0.015em',
                lineHeight: 1.15,
                margin: pinned ? '0 0 12px' : '8px 0 10px',
              }}
            >
              {step.title}
            </h3>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.65,
                color: c.ink(0.72),
                margin: 0,
                maxWidth: 520,
              }}
            >
              {step.body}
            </p>

            {step.panel ? <div style={{ marginTop: 24 }}>{step.panel}</div> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default StepScroller;
