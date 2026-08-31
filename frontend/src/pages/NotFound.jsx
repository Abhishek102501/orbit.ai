import { useOrbit } from '../store/OrbitProvider.jsx';

export function NotFound() {
  const { c } = useOrbit();

  return (
    <section
      data-screen-label="404"
      style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '120px 24px',
        textAlign: 'center',
        animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: '1.5px solid #9184d9',
          position: 'relative',
          margin: '0 auto 28px',
        }}
      >
        <span
          style={{
            position: 'absolute',
            inset: 14,
            borderRadius: '50%',
            background: '#9184d9',
          }}
        />
      </div>

      <h1 style={{ fontSize: 26, margin: '0 0 10px' }}>This orbit doesn&apos;t exist</h1>
      <p style={{ color: `rgba(${c.textRgb},0.6)`, fontSize: 14, margin: '0 0 26px' }}>
        The page you&apos;re looking for has drifted out of range. Let&apos;s get you back on course.
      </p>
      <a
        href="#/"
        style={{
          textDecoration: 'none',
          background: '#9184d9',
          color: '#161826',
          padding: '11px 22px',
          borderRadius: 8,
          fontSize: '13.5px',
          fontWeight: 600,
        }}
      >
        Back to Home
      </a>
    </section>
  );
}

export default NotFound;
