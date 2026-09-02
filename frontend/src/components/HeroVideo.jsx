import AutoVideo from './AutoVideo.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * The hero's product video: a titled media card playing a continuous muted loop.
 *
 * Playback is delegated to <AutoVideo>, which already owns everything this needs —
 * autoplay, looping, a guard that restarts the clip if a browser ever fires `ended` on
 * a looping source, an error fallback, and the speaker toggle. This component is only
 * the card around it: the title bar, the caption, and the frame.
 *
 * It starts muted because every browser blocks autoplay with sound, so an
 * unmuted-by-default video would never begin at all. The speaker control in the corner
 * of the frame is how a viewer turns audio on.
 *
 * There is no running-time badge any more. A clip that loops continuously has no
 * runtime worth advertising — the figure would imply something meant to be watched
 * from start to finish.
 *
 * Under `prefers-reduced-motion` AutoVideo holds the first frame instead of looping.
 * That is deliberate: a permanently moving panel is exactly what that preference asks
 * us not to show.
 */
export function HeroVideo({ src, label, caption, fallback = null }) {
  const { c } = useOrbit();

  return (
    <figure
      style={{
        margin: 0,
        background: c.surface,
        border: `1px solid ${c.ink(0.12)}`,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: c.shadowCard,
      }}
    >
      {/* ---- title bar ---- */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '13px 16px',
          borderBottom: `1px solid ${c.ink(0.08)}`,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: c.signal,
            flex: 'none',
            boxShadow: `0 0 8px ${c.signalGlow}`,
          }}
        />
        <span style={{ fontSize: 14, fontWeight: 500, color: c.text, minWidth: 0 }}>{label}</span>
      </div>

      {/* ---- media ---- */}
      <AutoVideo
        src={src}
        sound
        fallback={fallback}
        style={{
          display: 'block',
          width: '100%',
          aspectRatio: '16 / 10',
          objectFit: 'cover',
          background: c.chrome,
        }}
      />

      {/* ---- caption ---- */}
      {caption ? (
        <figcaption
          style={{
            padding: '13px 16px',
            borderTop: `1px solid ${c.ink(0.08)}`,
            fontSize: 13,
            lineHeight: 1.5,
            color: c.ink(0.68),
          }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default HeroVideo;
