import { useEffect, useState } from 'react';
import './Loader.css';

const Loader = ({ onDone }) => {
  const [count, setCount] = useState(3);
  const [phase, setPhase] = useState('countdown'); // countdown | launch | done

  useEffect(() => {
    if (count > 0) {
      const t = setTimeout(() => setCount(c => c - 1), 800);
      return () => clearTimeout(t);
    } else {
      setPhase('launch');
      const t = setTimeout(() => { setPhase('done'); onDone(); }, 1000);
      return () => clearTimeout(t);
    }
  }, [count, onDone]);

  if (phase === 'done') return null;

  return (
    <div className={`loader-overlay ${phase === 'launch' ? 'loader-launch' : ''}`}>
      <div className="loader-inner">
        <div className={`loader-rocket ${phase === 'launch' ? 'rocket-launch' : ''}`}>
          <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
            {/* body */}
            <path d="M30 5 C18 5 12 30 12 55 L48 55 C48 30 42 5 30 5Z" fill="#c8d8e8"/>
            <path d="M30 5 C36 5 42 30 42 55 L30 55 Z" fill="#e8f0f8"/>
            {/* window */}
            <circle cx="30" cy="32" r="9" fill="#63b3ed" opacity="0.9"/>
            <circle cx="27" cy="29" r="3" fill="rgba(255,255,255,0.4)"/>
            {/* fins */}
            <path d="M12 55 L2 75 L12 65 Z" fill="#63b3ed"/>
            <path d="M48 55 L58 75 L48 65 Z" fill="#63b3ed"/>
            {/* stripe */}
            <rect x="12" y="46" width="36" height="5" fill="rgba(99,179,237,0.6)" rx="2"/>
            {/* flame */}
            <ellipse cx="30" cy="62" rx="8" ry="12" fill="url(#flameGrad)" className="loader-flame"/>
            <defs>
              <radialGradient id="flameGrad" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fff7aa"/>
                <stop offset="40%" stopColor="#ff9020"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
            </defs>
          </svg>
        </div>

        {phase === 'countdown' && (
          <>
            <div className="loader-count" key={count}>{count === 0 ? '🚀' : count}</div>
            <div className="loader-label">
              {count === 3 ? 'SYSTEMS CHECK' : count === 2 ? 'FUELING UP' : count === 1 ? 'IGNITION' : 'LAUNCH'}
            </div>
            <div className="loader-bar">
              <div className="loader-bar-fill" style={{ width: `${((3 - count) / 3) * 100}%` }} />
            </div>
          </>
        )}
        {phase === 'launch' && <div className="loader-launch-text">🚀 LAUNCHING</div>}
      </div>

      {/* stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="loader-star" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
        }}/>
      ))}
    </div>
  );
};

export default Loader;
