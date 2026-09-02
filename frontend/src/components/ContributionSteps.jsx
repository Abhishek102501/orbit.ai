import Icon from './Icon.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The contribution flow, drawn as one connected run rather than a stack of cards.
 *
 * The previous version boxed each step, which made three separate objects out of
 * something that is a single sequence. Here the rail is the object: one line threads
 * every node, the steps sit directly on it with no resting surface of their own, and
 * a surface only appears under the pointer. What the eye follows is the thread.
 *
 * The rail is drawn in two parts. A solid mint segment runs from the first node to
 * the last, and a faded continuation falls away below it, so the sequence reads as
 * finishing rather than as being cut off.
 *
 * Steps reveal one after another, driven by the observer on the parent section (see
 * `.timeline-step` and `.reveal-io` in index.css). A scroll-driven timeline cannot be
 * used here: these sit inside a clipped panel, which becomes the scrollport that
 * `view()` measures against, and the later steps freeze part-way through.
 */
const STEP_ICONS = ['plus', 'shield', 'checkCircle'];

export function ContributionSteps({ steps }) {
  const { c } = useOrbit();

  return (
    <ol
      style={{
        position: 'relative',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'grid',
        gap: 4,
      }}
    >
      {/* The thread. Inset so it starts and ends inside the outer nodes. */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 17,
          top: 30,
          bottom: 30,
          width: 1,
          background: `linear-gradient(180deg, ${c.signal} 0%, ${c.signal} 62%, ${c.ink(0.14)} 100%)`,
          opacity: 0.65,
        }}
      />

      {steps.map((step, i) => (
        <li
          key={step.n}
          className="timeline-step step-row"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            padding: '12px 14px 12px 0',
            borderRadius: 12,
          }}
        >
          <span
            aria-hidden="true"
            {...(i === 0 ? { 'data-flow-to': '' } : null)}
            className="num step-node"
            style={{
              position: 'relative',
              flex: 'none',
              width: 34,
              height: 34,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10.5,
              color: c.signalInk,
              background: c.bg,
              border: `1px solid ${c.signal}`,
              // Punches the thread out behind the node, so the line reads as passing
              // through the node rather than under it.
              boxShadow: `0 0 0 5px ${c.bg}`,
            }}
          >
            {step.n}
          </span>

          <span style={{ minWidth: 0, paddingTop: 5 }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 600,
                color: c.text,
              }}
            >
              <span aria-hidden="true" style={{ display: 'flex', color: c.signal }}>
                <Icon name={STEP_ICONS[i] || 'sparkle'} size={14} />
              </span>
              {step.title}
            </span>
            <span
              style={{
                display: 'block',
                fontSize: 13,
                lineHeight: 1.6,
                color: c.ink(0.62),
                marginTop: 4,
              }}
            >
              {step.body}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export default ContributionSteps;
