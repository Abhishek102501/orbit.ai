import Icon from './Icon.jsx';
import GlassPanel from './GlassPanel.jsx';
import SectionHeader from './SectionHeader.jsx';
import OrbitalVisual from './OrbitalVisual.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The closing call to action.
 *
 * Composed asymmetrically on purpose. The copy holds the larger share of the row and
 * the figure is given more width than its column needs, so it runs past the panel's
 * right edge and is clipped by it. That overrun is what stops the section reading as
 * a rectangle with contents arranged inside it — the panel becomes a window onto
 * something larger rather than a container.
 *
 * The gap between the two is doing work: it is what leaves the headline and the
 * button as the only things competing for attention.
 *
 * Destination, label and copy are unchanged.
 */
export function AdvisorCTA() {
  const { c, layout } = useOrbit();
  const reveal = useReveal();
  const row = layout.ctaSplitDir === 'row';
  // The panel's own horizontal padding, so the figure can be pulled back out by
  // exactly that much and meet the panel edge rather than stopping short of it.
  const edgePad = layout.ctaPad.split(' ')[1];

  return (
    <section
      ref={reveal.ref}
      className={reveal.className}
      aria-labelledby="advisor-cta-heading"
      style={{
        position: 'relative',
        maxWidth: 1160,
        margin: '0 auto',
        // No bottom padding: DiscoveryFlow owns the rhythm between this section and
        // the next, and the path it draws occupies that space.
        padding: `0 ${layout.sidePad}`,
      }}
    >
      <GlassPanel variant="flow" padding={layout.ctaPad} bloom="right">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: row ? `${layout.ctaCopyBasis} 1fr` : '1fr',
            alignItems: 'center',
            gap: row ? 28 : layout.ctaSplitGap,
          }}
        >
          {/* ----------------------------------------------------------- copy */}
          <div style={{ minWidth: 0 }}>
            <SectionHeader
              eyebrow="AI-powered matchmaking"
              titleId="advisor-cta-heading"
              title={
                <>
                  Stop guessing.
                  <br />
                  <span className="accent-text">Start matching.</span>
                </>
              }
              subtitle="Describe what you need once — Orbit ranks the AI tools that actually fit, and explains why."
              size="clamp(30px, 3.4vw, 46px)"
              maxWidth={460}
            />

            <a
              href="#/advisor"
              className="cta-lift tf-cta"
              style={{
                marginTop: 30,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                background: c.accent,
                color: c.onAccent,
                fontWeight: 600,
                padding: '14px 26px',
                borderRadius: 999,
                fontSize: 14.5,
                boxShadow: `0 10px 30px ${c.signalGlow}`,
              }}
            >
              Ask the AI Advisor
              <span className="tf-arrow" style={{ display: 'flex' }}>
                <Icon name="arrowRight" size={15} />
              </span>
            </a>
          </div>

          {/* --------------------------------------------------------- figure */}
          {/* `data-flow-from` is where the shared path begins. DiscoveryFlow measures
              this element rather than being told a percentage, so the curve still
              starts on the figure when the columns stack. */}
          <div
            data-flow-from
            style={{
              minWidth: 0,
              display: 'flex',
              justifyContent: row ? 'flex-end' : 'center',
              marginRight: row ? `calc(-1 * ${edgePad})` : 0,
            }}
          >
            <OrbitalVisual size={layout.orbitalSize} />
          </div>
        </div>
      </GlassPanel>
    </section>
  );
}

export default AdvisorCTA;
