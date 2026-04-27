import { useEffect, useRef } from 'react';

const SpaceCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W, H;

    let scrollY = 0, targetScrollY = 0;
    let mouseX = 0, mouseY = 0;
    let camX = 0, camY = 0;

    const onScroll = () => { targetScrollY = window.scrollY; };
    const onMouse  = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Stars (3 depth layers) ────────────────────────────────
    const makeStar = (layer) => ({
      x: Math.random() * 3000 - 1000,
      y: Math.random() * 6000 - 1000,
      r: layer === 0 ? Math.random() * 0.8 + 0.2
       : layer === 1 ? Math.random() * 1.2 + 0.4
       :               Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.6 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.003 + 0.001,
      layer,
    });
    const PARALLAX = [0.08, 0.18, 0.32];
    const stars = [
      ...Array.from({ length: 160 }, () => makeStar(0)),
      ...Array.from({ length: 80  }, () => makeStar(1)),
      ...Array.from({ length: 40  }, () => makeStar(2)),
    ];

    // ── Nebulae — centered in each gutter ────────────────────
    // ny: normalized 0-1 of total page scroll height (approx)
    const nebulae = [
      { side: 'left',  ny: 0.05, r: 220, c1: 'rgba(99,179,237,0.055)',  c2: 'rgba(99,179,237,0)'  },
      { side: 'right', ny: 0.18, r: 260, c1: 'rgba(159,122,234,0.05)',  c2: 'rgba(159,122,234,0)' },
      { side: 'left',  ny: 0.35, r: 200, c1: 'rgba(104,211,145,0.04)',  c2: 'rgba(104,211,145,0)' },
      { side: 'right', ny: 0.50, r: 280, c1: 'rgba(99,179,237,0.04)',   c2: 'rgba(99,179,237,0)'  },
      { side: 'left',  ny: 0.65, r: 180, c1: 'rgba(159,122,234,0.045)', c2: 'rgba(159,122,234,0)' },
      { side: 'right', ny: 0.80, r: 240, c1: 'rgba(104,211,145,0.04)',  c2: 'rgba(104,211,145,0)' },
      { side: 'left',  ny: 0.92, r: 200, c1: 'rgba(99,179,237,0.05)',   c2: 'rgba(99,179,237,0)'  },
    ];

    // ── Planets — fixed screen-Y positions, centered in gutter ─
    // sy: fraction of viewport height where planet sits (0=top, 1=bottom)
    // They float with a tiny sine wave — almost static
    const planets = [
      { side: 'left',  sy: 0.22, r: 32, color: '#1a3a5c', ring: true,  ringColor: 'rgba(99,179,237,0.3)',   glowColor: 'rgba(99,179,237,0.18)',  bands: ['rgba(99,179,237,0.14)','rgba(99,179,237,0.07)'], floatAmp: 12, floatSpeed: 0.5,  floatOffset: 0 },
      { side: 'right', sy: 0.48, r: 24, color: '#2d1b4e', ring: false, glowColor: 'rgba(159,122,234,0.22)', bands: ['rgba(159,122,234,0.16)','rgba(159,122,234,0.08)'],                                    floatAmp: 16, floatSpeed: 0.38, floatOffset: 1.2 },
      { side: 'left',  sy: 0.72, r: 18, color: '#0d2b1a', ring: false, glowColor: 'rgba(104,211,145,0.2)',  bands: ['rgba(104,211,145,0.14)'],                                                             floatAmp: 10, floatSpeed: 0.6,  floatOffset: 2.4 },
      { side: 'right', sy: 0.85, r: 12, color: '#1a2a3a', ring: false, glowColor: 'rgba(99,179,237,0.16)',  bands: [],                                                                                     floatAmp: 8,  floatSpeed: 0.7,  floatOffset: 0.8 },
      { side: 'left',  sy: 0.55, r: 26, color: '#2a1a3e', ring: true,  ringColor: 'rgba(159,122,234,0.25)', glowColor: 'rgba(159,122,234,0.18)', bands: ['rgba(159,122,234,0.12)'],                        floatAmp: 14, floatSpeed: 0.42, floatOffset: 3.0 },
      { side: 'right', sy: 0.30, r: 16, color: '#0d2020', ring: false, glowColor: 'rgba(104,211,145,0.18)', bands: ['rgba(104,211,145,0.12)'],                                                             floatAmp: 10, floatSpeed: 0.55, floatOffset: 1.8 },
    ];

    // ── Moons ─────────────────────────────────────────────────
    const moons = [
      { pi: 0, orbitR: 56, angle: 0,       speed: 0.007, r: 4, color: 'rgba(144,205,244,0.7)' },
      { pi: 1, orbitR: 44, angle: Math.PI, speed: 0.010, r: 3, color: 'rgba(183,148,244,0.7)' },
      { pi: 4, orbitR: 48, angle: 1.0,     speed: 0.008, r: 3, color: 'rgba(183,148,244,0.6)' },
    ];

    // ── Shooting stars ────────────────────────────────────────
    const shooters = [];
    let shootTimer = 0;
    const spawnShooter = () => {
      const left = Math.random() < 0.5;
      // spawn only in side gutters, never near the top navbar area
      const gutterW = Math.max(0, (W - 1100) / 2);
      shooters.push({
        x: left
          ? Math.random() * gutterW * 0.8
          : W - Math.random() * gutterW * 0.8,
        y: H * 0.15 + Math.random() * H * 0.7,  // between 15%–85% vertically
        len: Math.random() * 100 + 50,
        speed: Math.random() * 6 + 3,
        angle: Math.PI / 5 + (Math.random() - 0.5) * 0.3,
        alpha: 1, life: 1,
      });
    };

    // ── Dust ──────────────────────────────────────────────────
    const dust = Array.from({ length: 50 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.2 + 0.04,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
    }));

    // ── Helpers ───────────────────────────────────────────────
    const lighten = (hex, amt) => {
      const n = parseInt(hex.replace('#',''), 16);
      return `rgb(${Math.min(255,(n>>16)+amt)},${Math.min(255,((n>>8)&0xff)+amt)},${Math.min(255,(n&0xff)+amt)})`;
    };

    const drawPlanet = (px, py, p) => {
      // glow
      const grd = ctx.createRadialGradient(px, py, 0, px, py, p.r * 3.5);
      grd.addColorStop(0, p.glowColor); grd.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(px, py, p.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grd; ctx.fill();

      // body
      const bg = ctx.createRadialGradient(px - p.r * 0.3, py - p.r * 0.3, 0, px, py, p.r);
      bg.addColorStop(0, lighten(p.color, 38)); bg.addColorStop(1, p.color);
      ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = bg; ctx.fill();

      // surface bands
      p.bands?.forEach((bc, i) => {
        ctx.beginPath();
        ctx.ellipse(px, py + (i * p.r * 0.4 - p.r * 0.2), p.r, p.r * 0.18, 0, 0, Math.PI * 2);
        ctx.fillStyle = bc; ctx.fill();
      });

      // ring
      if (p.ring) {
        ctx.save(); ctx.translate(px, py); ctx.scale(1, 0.28);
        ctx.beginPath(); ctx.arc(0, 0, p.r * 2.1, 0, Math.PI * 2);
        ctx.strokeStyle = p.ringColor; ctx.lineWidth = 5; ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, p.r * 1.65, 0, Math.PI * 2);
        ctx.strokeStyle = p.ringColor.replace('0.3','0.12').replace('0.25','0.1');
        ctx.lineWidth = 3; ctx.stroke();
        ctx.restore();
      }
    };

    // ── Main loop ─────────────────────────────────────────────
    let t = 0;
    const draw = () => {
      t += 0.016;

      // smooth scroll & mouse
      scrollY += (targetScrollY - scrollY) * 0.06;
      camX += (((mouseX / (W||1)) - 0.5) * 50 - camX) * 0.04;
      camY += (((mouseY / (H||1)) - 0.5) * 25 - camY) * 0.04;

      ctx.clearRect(0, 0, W, H);

      const CONTENT_W = 1100;
      const gutter = Math.max(0, (W - CONTENT_W) / 2);
      // center of each gutter
      const leftCX  = gutter / 2;
      const rightCX = W - gutter / 2;

      // ── nebulae ──
      nebulae.forEach(n => {
        const nx = n.side === 'left' ? leftCX : rightCX;
        // scroll so nebulae drift slowly as you scroll — very subtle
        const ny = n.ny * H * 6 - scrollY * 0.04 + camY * 0.03;
        const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
        grd.addColorStop(0, n.c1); grd.addColorStop(1, n.c2);
        ctx.beginPath(); ctx.arc(nx, ny, n.r, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
      });

      // ── stars ──
      stars.forEach(s => {
        const pf = PARALLAX[s.layer];
        const sx = ((s.x % W + W) % W) + camX * pf;
        const sy = ((s.y - scrollY * pf) % H + H) % H - camY * pf;
        s.alpha = 0.3 + 0.7 * Math.abs(Math.sin(t * s.speed * 60 + s.twinkle));
        ctx.beginPath(); ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`; ctx.fill();
      });

      // ── dust ──
      dust.forEach(d => {
        d.x += d.vx / W * 60; d.y += d.vy / H * 60;
        if (d.x < 0) d.x = 1; if (d.x > 1) d.x = 0;
        if (d.y < 0) d.y = 1; if (d.y > 1) d.y = 0;
        ctx.beginPath(); ctx.arc(d.x * W + camX * 0.04, d.y * H - camY * 0.04, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(144,205,244,${d.alpha})`; ctx.fill();
      });

      // ── planets — fixed viewport Y, centered in gutter ──
      planets.forEach(p => {
        // X: center of gutter + horizontal float + mouse drift
        const baseX = p.side === 'left' ? leftCX : rightCX;
        const floatX = Math.cos(t * p.floatSpeed * 0.7 + p.floatOffset) * (p.floatAmp * 0.5);
        const px = baseX + floatX + camX * 0.12;

        // Y: fixed fraction of viewport + vertical float
        const floatY = Math.sin(t * p.floatSpeed + p.floatOffset) * p.floatAmp;
        const py = p.sy * H + floatY;

        p._sx = px; p._sy = py;
        drawPlanet(px, py, p);
      });

      // ── moons ──
      moons.forEach(m => {
        const p = planets[m.pi];
        if (!p._sx) return;
        m.angle += m.speed;
        const mx = p._sx + Math.cos(m.angle) * m.orbitR;
        const my = p._sy + Math.sin(m.angle) * m.orbitR * 0.38;

        // orbit path
        ctx.save(); ctx.translate(p._sx, p._sy); ctx.scale(1, 0.38);
        ctx.beginPath(); ctx.arc(0, 0, m.orbitR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();

        ctx.beginPath(); ctx.arc(mx, my, m.r, 0, Math.PI * 2);
        ctx.fillStyle = m.color; ctx.fill();
      });

      // ── shooting stars ──
      shootTimer += 0.016;
      if (shootTimer > 3.5 + Math.random() * 4) { spawnShooter(); shootTimer = 0; }
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        const ex = s.x + Math.cos(s.angle) * s.len;
        const ey = s.y + Math.sin(s.angle) * s.len;
        const grd = ctx.createLinearGradient(s.x, s.y, ex, ey);
        grd.addColorStop(0, 'rgba(255,255,255,0)');
        grd.addColorStop(0.6, `rgba(144,205,244,${s.alpha * 0.8})`);
        grd.addColorStop(1, `rgba(255,255,255,${s.alpha})`);
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(ex, ey);
        ctx.strokeStyle = grd; ctx.lineWidth = 1.5; ctx.stroke();
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= 0.022; s.alpha = s.life;
        if (s.life <= 0) shooters.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

export default SpaceCanvas;
