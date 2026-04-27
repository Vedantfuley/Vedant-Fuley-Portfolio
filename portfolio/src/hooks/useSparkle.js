import { useEffect } from 'react';

const COLORS = ['#63b3ed', '#90cdf4', '#9f7aea', '#68d391', '#ffffff'];

const useSparkle = () => {
  useEffect(() => {
    const handle = (e) => {
      if (Math.random() > 0.3) return;
      const el = document.createElement('div');
      el.className = 'sparkle-particle';
      const size = Math.random() * 5 + 3;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      Object.assign(el.style, {
        left: `${e.clientX + (Math.random() - 0.5) * 16}px`,
        top:  `${e.clientY + (Math.random() - 0.5) * 16}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        animationDuration: `${Math.random() * 0.4 + 0.4}s`,
      });
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);
};

export default useSparkle;
