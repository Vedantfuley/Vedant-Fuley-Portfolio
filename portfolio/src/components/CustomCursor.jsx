import { useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const trailRef = useRef([]);
  const pos      = useRef({ x: -100, y: -100 });
  const ring     = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Create trail particles
    const TRAIL = 8;
    const container = document.createElement('div');
    container.className = 'cursor-trail-container';
    document.body.appendChild(container);
    trailRef.current = Array.from({ length: TRAIL }, (_, i) => {
      const el = document.createElement('div');
      el.className = 'cursor-trail-dot';
      el.style.opacity = `${1 - i / TRAIL}`;
      el.style.width = el.style.height = `${6 - i * 0.5}px`;
      container.appendChild(el);
      return { el, x: -100, y: -100 };
    });

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onEnter = () => {
      dotRef.current?.classList.add('cursor-hover');
      ringRef.current?.classList.add('cursor-hover');
    };
    const onLeave = () => {
      dotRef.current?.classList.remove('cursor-hover');
      ringRef.current?.classList.remove('cursor-hover');
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    // Animate ring with lag + trail
    let animId;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }

      // shift trail
      const trail = trailRef.current;
      for (let i = trail.length - 1; i > 0; i--) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.35;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.35;
        trail[i].el.style.transform = `translate(${trail[i].x}px, ${trail[i].y}px)`;
      }
      trail[0].x = pos.current.x;
      trail[0].y = pos.current.y;
      trail[0].el.style.transform = `translate(${trail[0].x}px, ${trail[0].y}px)`;

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMove);
      container.remove();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

export default CustomCursor;
