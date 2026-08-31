import Icon from './Icon.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

export function Toast() {
  const { c, toast } = useOrbit();
  if (!toast) return null;

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        bottom: 26,
        left: '50%',
        transform: 'translateX(-50%)',
        background: c.surfaceAlt,
        border: `1px solid rgba(${c.textRgb},0.16)`,
        color: c.text,
        padding: '12px 20px',
        borderRadius: 10,
        fontSize: 13,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Icon name="check" size={15} />
      {toast}
    </div>
  );
}

export default Toast;
