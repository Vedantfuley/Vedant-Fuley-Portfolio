import { useEffect, useRef } from 'react';
import './SideDecorations.css';

// Constellation dot positions (normalized 0-1 within the side panel)
const LEFT_CONSTELLATION = [
  [0.3, 0.12], [0.6, 0.22], [0.5, 0.38], [0.2, 0.45],
  [0.7, 0.52], [0.4, 0.62], [0.6, 0.75], [0.25, 0.85],
];
const LEFT_LINES = [
  [0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [5, 6], [6, 7],
];

const RIGHT_CONSTELLATION = [
  [0.5, 0.08], [0.2, 0.20], [0.7, 0.30], [0.4, 0.44],
  [0.8, 0.55], [0.3, 0.65], [0.6, 0.78], [0.45, 0.90],
];
const RIGHT_LINES = [
  [0, 1], [0, 2], [2, 3], [3, 4], [3, 5], [5, 6], [6, 7],
];

const ConstellationCanvas = ({ dots, lines, side }) => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const draw = () => {
      const W = canvas.width  = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      t += 0.008;

      const pts = dots.map(([nx, ny]) => [nx * W, ny * H]);

      // lines
      lines.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(pts[a][0], pts[a][1]);
        ctx.lineTo(pts[b][0], pts[b][1]);
        ctx.strokeStyle = 'rgba(99,179,237,0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // dots
      pts.forEach(([x, y], i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t + i * 0.8);
        const r = 1.5 + pulse * 1.2;
        // glow
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
        grd.addColorStop(0, `rgba(99,179,237,${0.3 * pulse})`);
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        // dot
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(144,205,244,${0.6 + 0.4 * pulse})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [dots, lines]);

  return <canvas ref={ref} className="constellation-canvas" />;
};

const SideDecorations = () => (
  <>
    {/* Left panel */}
    <div className="side-panel side-left">
      <ConstellationCanvas dots={LEFT_CONSTELLATION} lines={LEFT_LINES} side="left" />
      <div className="side-coords side-coords-left">
        <span>LUNA · 384,400 km</span>
        <span>MARS · 78.3M km</span>
      </div>
      <div className="side-label-vert side-label-left">MISSION CONTROL</div>
    </div>

    {/* Right panel */}
    <div className="side-panel side-right">
      <ConstellationCanvas dots={RIGHT_CONSTELLATION} lines={RIGHT_LINES} side="right" />
      <div className="side-coords side-coords-right">
        <span>ISS · 408 km ALT</span>
        <span>VEL · 7.66 km/s</span>
      </div>
      <div className="side-label-vert side-label-right">DEEP SPACE</div>
    </div>
  </>
);

export default SideDecorations;
