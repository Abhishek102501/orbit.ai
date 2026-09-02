import Badge from './Badge.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The heading block every section opens with: a small label, the headline, and one
 * line of support beneath it.
 *
 * It exists so section headings stop being hand-rolled. Before this, six of the
 * homepage's sections each built their own `<h2>` with their own size, weight and
 * alignment, which is why the page had no consistent entry rhythm.
 *
 * The three parts resolve in sequence rather than together — see `.section-header`
 * in index.css. The offsets are small enough to read as one gesture.
 *
 * `title` takes a node, so a phrase inside it can carry the accent emphasis without
 * this component having to know about the highlight.
 */
export function SectionHeader({
  eyebrow,
  eyebrowIcon = 'sparkle',
  eyebrowTone = 'signal',
  title,
  titleId,
  subtitle,
  size = 'clamp(28px, 3.2vw, 42px)',
  maxWidth = 520,
  align = 'left',
  as: Heading = 'h2',
}) {
  const { c } = useOrbit();
  const centred = align === 'center';

  return (
    <div className="section-header" style={{ textAlign: align }}>
      {eyebrow ? (
        <span className="sh-eyebrow" style={{ display: 'inline-flex', marginBottom: 20 }}>
          <Badge icon={eyebrowIcon} tone={eyebrowTone}>
            {eyebrow}
          </Badge>
        </span>
      ) : null}

      <Heading
        id={titleId}
        className="hero-display sh-title"
        style={{
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.06,
          letterSpacing: '-0.022em',
          margin: '0 0 14px',
          maxWidth,
          marginLeft: centred ? 'auto' : 0,
          marginRight: centred ? 'auto' : 0,
        }}
      >
        {title}
      </Heading>

      {subtitle ? (
        <p
          className="sh-sub"
          style={{
            fontSize: 15,
            lineHeight: 1.65,
            color: c.ink(0.72),
            margin: 0,
            maxWidth: Math.min(maxWidth, 460),
            marginLeft: centred ? 'auto' : 0,
            marginRight: centred ? 'auto' : 0,
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeader;
