import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../Icon.jsx';
import Hoverable from '../Hoverable.jsx';
import Badge from '../Badge.jsx';
import PhotoBackdrop from '../PhotoBackdrop.jsx';
import { newsImage } from '../../data/news.js';
import { useOrbit } from '../../store/OrbitProvider.jsx';
import { prefersReducedMotion } from '../../lib/motion.js';

const INTERVAL = 7000;

/**
 * The featured story, rotating on its own.
 *
 * A crossfade, not a slide. Every story is stacked in the same grid cell and only
 * opacity changes, so nothing travels horizontally and the panel cannot jump when one
 * headline is longer than the next — the cell is always as tall as the tallest story,
 * measured once by the browser rather than guessed at.
 *
 * Rotation stops when it should: while the pointer is inside, while focus is inside,
 * and whenever the tab is hidden — a carousel advancing in a background tab is just a
 * timer burning battery. Under `prefers-reduced-motion` it does not rotate at all;
 * the dots become the only way through, which is the point of the preference.
 *
 * The timer is a single `setTimeout` re-armed per step rather than an interval, so a
 * manual selection restarts the clock instead of racing a half-elapsed tick.
 */
export function FeaturedCarousel({ items }) {
  const { c, layout } = useOrbit();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);
  const reduced = prefersReducedMotion();
  const count = items.length;

  const go = useCallback(
    (next) => setIndex(((next % count) + count) % count),
    [count],
  );

  // Rotation. Cleared on every dependency change and on unmount, so no timer
  // outlives the component or stacks on top of another.
  useEffect(() => {
    if (reduced || paused || count < 2) return undefined;
    timer.current = setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearTimeout(timer.current);
  }, [index, paused, count, reduced]);

  // A hidden tab should not advance. `visibilitychange` is the only reliable signal.
  useEffect(() => {
    const onVis = () => setPaused(document.visibilityState !== 'visible');
    document.addEventListener('visibilitychange', onVis);
    onVis();
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  if (!count) return null;
  const stacked = layout.isMobile || layout.isTablet;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(document.visibilityState !== 'visible')}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      style={{
        position: 'relative',
        borderRadius: 18,
        border: `1px solid ${c.ink(0.12)}`,
        background: `linear-gradient(150deg, rgba(${c.surfaceRgb},0.9), rgba(${c.surfaceRgb},0.45))`,
        overflow: 'hidden',
      }}
    >
      {/* Every slide occupies the same grid cell, so the panel is sized by the
          tallest story and never resizes as they change. */}
      <div style={{ display: 'grid' }}>
        {items.map((item, i) => {
          const on = i === index;
          return (
            <article
              key={item.id}
              aria-hidden={!on}
              className={on ? 'feat-slide feat-on' : 'feat-slide'}
              style={{
                gridArea: '1 / 1',
                display: 'grid',
                gridTemplateColumns: stacked ? '1fr' : '1.15fr 0.85fr',
                gap: stacked ? 20 : 36,
                alignItems: 'center',
                padding: stacked ? '26px 22px' : '38px 40px',
                // Hidden slides must not be reachable by tab or read out.
                visibility: on ? 'visible' : 'hidden',
                pointerEvents: on ? 'auto' : 'none',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <span className="feat-1" style={{ display: 'inline-flex', marginBottom: 16 }}>
                  <Badge icon="bolt" tone="signal">
                    Featured now
                  </Badge>
                </span>

                <h3
                  className="feat-2 hero-display"
                  style={{
                    fontWeight: 600,
                    fontSize: stacked ? 24 : 32,
                    lineHeight: 1.12,
                    letterSpacing: '-0.02em',
                    margin: '0 0 12px',
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="feat-3"
                  style={{
                    margin: '0 0 20px',
                    fontSize: 14.5,
                    lineHeight: 1.65,
                    color: c.ink(0.7),
                    maxWidth: 460,
                  }}
                >
                  {item.summary}
                </p>

                <div
                  className="feat-4"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 14,
                    fontSize: 12.5,
                    color: c.ink(0.55),
                  }}
                >
                  <span className="num">{item.company}</span>
                  {item.readMinutes ? (
                    <span className="num">{item.readMinutes} min read</span>
                  ) : null}
                  {item.toolSlug ? (
                    <Hoverable
                      as="a"
                      href={`#/tool/${item.toolSlug}`}
                      className="tf-cta"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        padding: '9px 16px',
                        borderRadius: 999,
                        border: `1px solid ${c.accent}`,
                        color: c.accent,
                        textDecoration: 'none',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                      hoverStyle={{ background: c.signalTrack }}
                    >
                      Explore the tool
                      <span className="tf-arrow" style={{ display: 'flex' }}>
                        <Icon name="arrowRight" size={13} />
                      </span>
                    </Hoverable>
                  ) : null}
                </div>
              </div>

              {/* Photograph under Orbit's own mark. The image is atmosphere and
                  carries an empty alt: a stock photo cannot depict a release, and
                  captioning it as if it did would be a claim about the picture that
                  is not true. The glyph on top is what identifies the panel. */}
              <div
                className="feat-art"
                style={{
                  position: 'relative',
                  display: stacked ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 210,
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: `1px solid ${c.ink(0.1)}`,
                }}
              >
                <PhotoBackdrop photo={newsImage(item).photo} alt="" width={640} vivid />
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(120% 100% at 50% 50%, rgba(${c.bgRgb},0.35), rgba(${c.bgRgb},0.85))`,
                  }}
                />
                <span style={{ position: 'relative' }}>
                  <FeatureGlyph c={c} seed={i} />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* -------------------------------------------------------- controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: stacked ? '0 22px 20px' : '0 40px 24px',
        }}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show story ${i + 1} of ${count}: ${item.title}`}
            aria-current={i === index ? 'true' : undefined}
            style={{
              width: i === index ? 26 : 8,
              height: 8,
              padding: 0,
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: i === index ? c.signal : c.ink(0.18),
              transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1), background-color 0.35s ease',
            }}
          />
        ))}
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <RailButton c={c} label="Previous story" icon="chevronLeft" onClick={() => go(index - 1)} />
          <RailButton c={c} label="Next story" icon="chevronRight" onClick={() => go(index + 1)} />
        </span>
      </div>
    </section>
  );
}

function RailButton({ c, label, icon, onClick, disabled }) {
  return (
    <Hoverable
      as="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${c.ink(0.16)}`,
        background: 'transparent',
        color: disabled ? c.ink(0.3) : c.ink(0.75),
        cursor: disabled ? 'default' : 'pointer',
        transition: 'color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
      }}
      hoverStyle={disabled ? undefined : { color: c.text, borderColor: c.signal, background: c.signalTrack }}
    >
      <Icon name={icon} size={14} />
    </Hoverable>
  );
}

/** Orbit's own geometry, varied per slide so the four do not look identical. */
function FeatureGlyph({ c, seed }) {
  const tilt = [-24, 18, 40, -8][seed % 4];
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="86" stroke={c.ink(0.12)} strokeWidth="1" strokeDasharray="2 9" />
      <g className="orb-ring orb-spin-b" style={{ animationDelay: `${seed * -9}s` }}>
        <g transform={`rotate(${tilt} 100 100)`}>
          <ellipse cx="100" cy="100" rx="74" ry="30" stroke={c.signal} strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="174" cy="100" r="4" fill={c.signal} />
        </g>
      </g>
      <circle cx="100" cy="100" r="30" fill={c.signal} opacity="0.06" />
      <g transform="rotate(-28 100 100)">
        <ellipse cx="100" cy="100" rx="19" ry="9" stroke={c.signal} strokeWidth="1.6" />
      </g>
      <circle cx="100" cy="100" r="7" fill={c.signal} />
    </svg>
  );
}

export default FeaturedCarousel;
