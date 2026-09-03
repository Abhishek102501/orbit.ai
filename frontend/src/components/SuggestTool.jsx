import Icon from './Icon.jsx';
import Hoverable from './Hoverable.jsx';
import GlassPanel from './GlassPanel.jsx';
import SectionHeader from './SectionHeader.jsx';
import ContributionSteps from './ContributionSteps.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { SUGGEST_STEPS } from '../lib/content.js';

/**
 * "Suggest an AI Tool": the community entry point that sits between the closing CTA
 * and the footer.
 *
 * The section only invites the contribution. The dialog itself is <SuggestToolModal>,
 * mounted once in App and opened from the store, so the header can reach it from any
 * route and there is still only one form in the project.
 */
export function SuggestTool() {
  const { c, layout, CATEGORIES, TOOLS, openSuggest } = useOrbit();
  // Observer-driven: the timeline steps live inside a clipped panel, where a
  // scroll-driven timeline does not resolve against the viewport.
  const reveal = useReveal(0.12, { observe: true });

  // Both figures come straight from the loaded catalog rather than being written
  // into the page, so they cannot drift out of date.
  const stats = [
    { value: TOOLS.length, label: 'AI tools listed', icon: 'layers' },
    { value: CATEGORIES.length, label: 'Categories covered', icon: 'grid' },
  ];

  return (
    <section
      ref={reveal.ref}
      className={reveal.className}
      aria-labelledby="suggest-heading"
      style={{
        position: 'relative',
        maxWidth: 1160,
        margin: '0 auto',
        padding: `0 ${layout.sidePad}`,
      }}
    >
      <GlassPanel variant="flow" padding={layout.suggestPad} bloom="right" pattern>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: layout.suggestDir === 'row' ? '1.05fr 0.95fr' : '1fr',
            gap: layout.isMobile ? 36 : 56,
            alignItems: 'center',
          }}
        >
          {/* ------------------------------------------------------------ copy */}
          <div style={{ minWidth: 0 }}>
            <SectionHeader
              eyebrow="Community contribution"
              titleId="suggest-heading"
              title={
                <>
                  Know an AI tool
                  <br />
                  <span className="accent-text">we missed?</span>
                </>
              }
              subtitle="The AI ecosystem is growing every day. Help us keep Orbit ahead by suggesting tools that deserve to be discovered."
              size="clamp(28px, 3vw, 40px)"
              maxWidth={420}
            />

            <Hoverable
              as="button"
              type="button"
              className="tf-cta cta-lift"
              onClick={openSuggest}
              style={{
                marginTop: 28,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                minHeight: 48,
                padding: '0 24px',
                // Outlined, not filled. The Advisor block above carries the one
                // filled action on this stretch of the page; a second solid button
                // here would flatten the order between the two sections.
                background: 'transparent',
                border: `1px solid ${c.accent}`,
                borderRadius: 999,
                color: c.accent,
                fontWeight: 600,
                fontSize: 14.5,
                fontFamily: 'Inter',
                cursor: 'pointer',
              }}
              hoverStyle={{ background: c.signalTrack }}
            >
              <Icon name="plus" size={15} />
              Suggest an AI Tool
              <span className="tf-arrow" style={{ display: 'flex' }}>
                <Icon name="arrowRight" size={15} />
              </span>
            </Hoverable>

            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12.5,
                color: c.ink(0.55),
                margin: '16px 0 0',
              }}
            >
              <span aria-hidden="true" style={{ display: 'flex', color: c.signal }}>
                <Icon name="shield" size={13} />
              </span>
              Your suggestion will be reviewed before being added to the directory.
            </p>

            {/* --------------------------------------------------------- metrics */}
            <dl
              style={{
                display: 'flex',
                alignItems: 'stretch',
                flexWrap: 'wrap',
                gap: layout.isMobile ? 22 : 32,
                margin: 0,
                marginTop: layout.isMobile ? 28 : 36,
                paddingTop: layout.isMobile ? 22 : 26,
                borderTop: `1px solid ${c.ink(0.1)}`,
              }}
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: layout.isMobile ? 22 : 32,
                  }}
                >
                  {i > 0 && !layout.isMobile ? (
                    <span aria-hidden="true" style={{ width: 1, background: c.ink(0.12) }} />
                  ) : null}
                  {/* Column flex so `order` can put the figure above its label while
                      the markup keeps the term-then-definition order a description
                      list requires. */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <dt
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 12.5,
                        color: c.ink(0.6),
                        order: 2,
                      }}
                    >
                      {stat.label}
                    </dt>
                    <dd
                      className="num"
                      style={{
                        margin: '0 0 4px',
                        fontSize: 26,
                        fontWeight: 500,
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                        color: c.text,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 9,
                      }}
                    >
                      <span aria-hidden="true" style={{ display: 'flex', color: c.signal }}>
                        <Icon name={stat.icon} size={15} />
                      </span>
                      {stat.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* -------------------------------------------------------- timeline */}
          <div style={{ minWidth: 0 }}>
            <ContributionSteps steps={SUGGEST_STEPS} />

            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12,
                color: c.ink(0.5),
                margin: '18px 0 0',
                paddingLeft: 50,
              }}
            >
              <Icon name="sparkle" size={12} />
              Built by AI explorers, improved by the community.
            </p>
          </div>
        </div>
      </GlassPanel>

    </section>
  );
}

export default SuggestTool;
