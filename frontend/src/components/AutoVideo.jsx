import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Hoverable from './Hoverable.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

/**
 * Looping, muted, autoplaying background video that honours `prefers-reduced-motion`
 * and restarts itself if a browser ever fires `ended` on a looping source — the same
 * guard the design applies in `bgVideoRef` / `showcaseVideoRef`.
 *
 * With `sound`, a small speaker button sits in the corner of the frame so the viewer can
 * turn the audio on. Playback still *starts* muted: every browser blocks autoplay with
 * sound, so an unmuted-by-default video would simply never start.
 */
export function AutoVideo({ src, style, fallback = null, sound = false }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    el.loop = true;
    const onEnded = () => {
      el.currentTime = 0;
      el.play().catch(() => {});
    };
    const onError = () => setFailed(true);

    el.addEventListener('ended', onEnded);
    el.addEventListener('error', onError, true);

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) el.pause();
    else el.play().catch(() => {});

    return () => {
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('error', onError, true);
    };
  }, [src]);

  // Drive the element's own property as well as the attribute: some browsers ignore a
  // React-rendered `muted` attribute change on an already-playing element.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = muted;
    if (!muted) el.play().catch(() => {});
  }, [muted]);

  if (failed && fallback) return fallback;

  const video = (
    <video ref={ref} autoPlay muted loop playsInline style={style}>
      <source src={src} type="video/mp4" onError={() => setFailed(true)} />
    </video>
  );

  if (!sound) return video;

  return (
    <span style={{ display: 'block', position: 'relative' }}>
      {video}
      <SoundButton muted={muted} onToggle={() => setMuted((m) => !m)} />
    </span>
  );
}

/** Corner speaker toggle. Reads the palette so it stays legible over either theme's frame. */
function SoundButton({ muted, onToggle }) {
  const { c } = useOrbit();
  const label = muted ? 'Turn video sound on' : 'Turn video sound off';

  return (
    <Hoverable
      as="button"
      type="button"
      className="video-sound-btn"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={!muted}
      title={label}
      style={{
        position: 'absolute',
        right: 12,
        bottom: 12,
        zIndex: 2,
        width: 34,
        height: 34,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Fixed dark glass rather than a palette surface: this sits on top of the video,
        // whose brightness has nothing to do with the page theme.
        background: 'rgba(12,13,20,0.55)',
        border: `1px solid ${c.accentBorder}`,
        color: '#f1f0f7',
        cursor: 'pointer',
        backdropFilter: 'blur(6px)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
      }}
      hoverStyle={{
        background: 'rgba(12,13,20,0.75)',
        borderColor: c.accent,
        transform: 'translateY(-1px)',
      }}
    >
      <Icon name={muted ? 'volumeOff' : 'volumeOn'} size={16} />
    </Hoverable>
  );
}

export default AutoVideo;
