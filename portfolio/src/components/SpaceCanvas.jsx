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

    // ── Stars ────────────────────────────────────────────────
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

    // ── Nebulae ───────────────────────────────────────────────
    const nebulae = [
      { side: 'left',  ny: 0.05, r: 220, c1: 'rgba(99,179,237,0.055)',  c2: 'rgba(99,179,237,0)'  },
      { side: 'right', ny: 0.18, r: 260, c1: 'rgba(159,122,234,0.05)',  c2: 'rgba(159,122,234,0)' },
      { side: 'left',  ny: 0.35, r: 200, c1: 'rgba(104,211,145,0.04)',  c2: 'rgba(104,211,145,0)' },
      { side: 'right', ny: 0.50, r: 280, c1: 'rgba(99,179,237,0.04)',   c2: 'rgba(99,179,237,0)'  },
      { side: 'left',  ny: 0.65, r: 180, c1: 'rgba(159,122,234,0.045)', c2: 'rgba(159,122,234,0)' },
      { side: 'right', ny: 0.80, r: 240, c1: 'rgba(104,211,145,0.04)',  c2: 'rgba(104,211,145,0)' },
      { side: 'left',  ny: 0.92, r: 200, c1: 'rgba(99,179,237,0.05)',   c2: 'rgba(99,179,237,0)'  },
    ];

    // ── Celestial bodies ──────────────────────────────────────
    // Moon: grey, cratered look, left gutter upper area
    // Mars: reddish-orange, right gutter mid area
    // Saturn-like planet: purple, left gutter lower
    // Small ice planet: cyan, right gutter lower
    const planets = [
      {
        id: 'moon',
        side: 'left', sy: 0.20, r: 36,
        color: '#8a9bb0', glowColor: 'rgba(180,200,220,0.15)',
        bands: ['rgba(255,255,255,0.06)', 'rgba(0,0,0,0.08)'],
        ring: false, craters: true,
        floatAmp: 10, floatSpeed: 0.4, floatOffset: 0,
      },
      {
        id: 'mars',
        side: 'right', sy: 0.38, r: 28,
        color: '#c1440e', glowColor: 'rgba(220,80,30,0.2)',
        bands: ['rgba(180,60,20,0.3)', 'rgba(240,120,60,0.15)'],
        ring: false, craters: false,
        floatAmp: 14, floatSpeed: 0.35, floatOffset: 1.5,
      },
      {
        id: 'saturn',
        side: 'left', sy: 0.62, r: 26,
        color: '#2d1b4e', ring: true,
        ringColor: 'rgba(159,122,234,0.35)',
        glowColor: 'rgba(159,122,234,0.2)',
        bands: ['rgba(159,122,234,0.18)', 'rgba(159,122,234,0.08)'],
        craters: false,
        floatAmp: 12, floatSpeed: 0.45, floatOffset: 2.8,
      },
      {
        id: 'ice',
        side: 'right', sy: 0.75, r: 16,
        color: '#0d2b3a', glowColor: 'rgba(99,179,237,0.18)',
        bands: ['rgba(99,179,237,0.2)'],
        ring: false, craters: false,
        floatAmp: 8, floatSpeed: 0.6, floatOffset: 0.9,
      },
      {
        id: 'green',
        side: 'right', sy: 0.88, r: 14,
        color: '#0d2b1a', glowColor: 'rgba(104,211,145,0.18)',
        bands: ['rgba(104,211,145,0.2)'],
        ring: false, craters: false,
        floatAmp: 7, floatSpeed: 0.55, floatOffset: 4.0,
      },
    ];

    // ── Satellites ────────────────────────────────────────────
    // Each satellite orbits a planet (by index) or drifts freely
    const satellites = [
      // ISS-style orbiting Moon
      { pi: 0, orbitR: 62, angle: 0,       speed: 0.012, r: 3,   color: 'rgba(200,220,255,0.8)', isSat: true },
      // Small moon orbiting Mars
      { pi: 1, orbitR: 50, angle: Math.PI, speed: 0.009, r: 3.5, color: 'rgba(220,140,100,0.7)', isSat: false },
      // Moon orbiting Saturn
      { pi: 2, orbitR: 55, angle: 1.0,     speed: 0.008, r: 3,   color: 'rgba(183,148,244,0.7)', isSat: false },
    ];

    // ── Rocket ────────────────────────────────────────────────
    // Drifts slowly upward in the right gutter, loops
    const rocket = {
      side: 'right',
      x: 0, y: 0,        // set in draw
      vy: -0.18,          // pixels per frame upward
      baseY: 0,
      initialized: false,
      flameT: 0,
    };

    // ── Shooting stars ────────────────────────────────────────
    const shooters = [];
    let shootTimer = 0;
    const spawnShooter = () => {
      const left = Math.random() < 0.5;
      const gutterW = Math.max(0, (W - 1100) / 2);
      shooters.push({
        x: left ? Math.random() * gutterW * 0.8 : W - Math.random() * gutterW * 0.8,
        y: H * 0.15 + Math.random() * H * 0.7,
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
      bg.addColorStop(0, lighten(p.color, 40)); bg.addColorStop(1, p.color);
      ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = bg; ctx.fill();

      // surface bands
      p.bands?.forEach((bc, i) => {
        ctx.beginPath();
        ctx.ellipse(px, py + (i * p.r * 0.4 - p.r * 0.2), p.r, p.r * 0.18, 0, 0, Math.PI * 2);
        ctx.fillStyle = bc; ctx.fill();
      });

      // craters (Moon)
      if (p.craters) {
        const craterData = [
          { ox: -0.3, oy: -0.25, r: 0.22 },
          { ox:  0.25, oy:  0.3,  r: 0.16 },
          { ox: -0.1, oy:  0.4,  r: 0.12 },
          { ox:  0.4, oy: -0.1,  r: 0.10 },
        ];
        craterData.forEach(c => {
          ctx.beginPath();
          ctx.arc(px + c.ox * p.r, py + c.oy * p.r, c.r * p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,0,0,0.18)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.06)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });
      }

      // ring
      if (p.ring) {
        ctx.save(); ctx.translate(px, py); ctx.scale(1, 0.28);
        ctx.beginPath(); ctx.arc(0, 0, p.r * 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = p.ringColor; ctx.lineWidth = 5; ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, p.r * 1.7, 0, Math.PI * 2);
        ctx.strokeStyle = p.ringColor.replace('0.35','0.12');
        ctx.lineWidth = 3; ctx.stroke();
        ctx.restore();
      }
    };

    // Draw a tiny satellite (ISS-like cross shape)
    const drawSatellite = (sx, sy, angle) => {
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      // body
      ctx.fillStyle = 'rgba(200,220,255,0.85)';
      ctx.fillRect(-4, -2, 8, 4);
      // solar panels
      ctx.fillStyle = 'rgba(99,179,237,0.7)';
      ctx.fillRect(-10, -1.5, 5, 3);
      ctx.fillRect(5, -1.5, 5, 3);
      // glow
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 8);
      g.addColorStop(0, 'rgba(144,205,244,0.3)');
      g.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.restore();
    };

    // Draw rocket pointing upward with flame
    const drawRocket = (rx, ry, flameT) => {
      ctx.save();
      ctx.translate(rx, ry);

      // flame
      const flicker = 0.7 + 0.3 * Math.sin(flameT * 18);
      const fg = ctx.createRadialGradient(0, 18, 0, 0, 22, 14 * flicker);
      fg.addColorStop(0, `rgba(255,220,80,${0.9 * flicker})`);
      fg.addColorStop(0.4, `rgba(255,100,30,${0.7 * flicker})`);
      fg.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(0, 22, 14 * flicker, 0, Math.PI * 2);
      ctx.fillStyle = fg; ctx.fill();

      // exhaust trail
      for (let i = 0; i < 5; i++) {
        const ty = 20 + i * 8;
        const ta = (0.25 - i * 0.04) * flicker;
        ctx.beginPath();
        ctx.arc((Math.random() - 0.5) * 4, ty, 3 - i * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,160,40,${ta})`;
        ctx.fill();
      }

      // body
      const bodyGrad = ctx.createLinearGradient(-7, -20, 7, -20);
      bodyGrad.addColorStop(0, '#c8d8e8');
      bodyGrad.addColorStop(0.5, '#e8f0f8');
      bodyGrad.addColorStop(1, '#8090a0');
      ctx.beginPath();
      ctx.moveTo(-6, 14);
      ctx.lineTo(-6, -10);
      ctx.quadraticCurveTo(-6, -22, 0, -26);
      ctx.quadraticCurveTo(6, -22, 6, -10);
      ctx.lineTo(6, 14);
      ctx.closePath();
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // window
      const wg = ctx.createRadialGradient(-1, -8, 0, -1, -8, 4);
      wg.addColorStop(0, 'rgba(144,205,244,0.9)');
      wg.addColorStop(1, 'rgba(30,80,140,0.8)');
      ctx.beginPath(); ctx.arc(0, -8, 4, 0, Math.PI * 2);
      ctx.fillStyle = wg; ctx.fill();
      ctx.strokeStyle = 'rgba(200,230,255,0.5)'; ctx.lineWidth = 0.8; ctx.stroke();

      // fins
      ctx.fillStyle = '#63b3ed';
      ctx.beginPath(); ctx.moveTo(-6, 14); ctx.lineTo(-13, 20); ctx.lineTo(-6, 6); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(6, 14);  ctx.lineTo(13, 20);  ctx.lineTo(6, 6);  ctx.closePath(); ctx.fill();

      // stripe
      ctx.fillStyle = 'rgba(99,179,237,0.6)';
      ctx.fillRect(-6, -2, 12, 3);

      ctx.restore();
    };

    // ── Main loop ─────────────────────────────────────────────
    let t = 0;
    const draw = () => {
      t += 0.016;

      scrollY += (targetScrollY - scrollY) * 0.06;
      camX += (((mouseX / (W||1)) - 0.5) * 50 - camX) * 0.04;
      camY += (((mouseY / (H||1)) - 0.5) * 25 - camY) * 0.04;

      ctx.clearRect(0, 0, W, H);

      const CONTENT_W = 1100;
      const gutter = Math.max(0, (W - CONTENT_W) / 2);
      const leftCX  = gutter / 2;
      const rightCX = W - gutter / 2;

      // nebulae
      nebulae.forEach(n => {
        const nx = n.side === 'left' ? leftCX : rightCX;
        const ny = n.ny * H * 6 - scrollY * 0.04 + camY * 0.03;
        const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
        grd.addColorStop(0, n.c1); grd.addColorStop(1, n.c2);
        ctx.beginPath(); ctx.arc(nx, ny, n.r, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
      });

      // stars
      stars.forEach(s => {
        const pf = PARALLAX[s.layer];
        const sx = ((s.x % W + W) % W) + camX * pf;
        const sy = ((s.y - scrollY * pf) % H + H) % H - camY * pf;
        s.alpha = 0.3 + 0.7 * Math.abs(Math.sin(t * s.speed * 60 + s.twinkle));
        ctx.beginPath(); ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`; ctx.fill();
      });

      // dust
      dust.forEach(d => {
        d.x += d.vx / W * 60; d.y += d.vy / H * 60;
        if (d.x < 0) d.x = 1; if (d.x > 1) d.x = 0;
        if (d.y < 0) d.y = 1; if (d.y > 1) d.y = 0;
        ctx.beginPath(); ctx.arc(d.x * W + camX * 0.04, d.y * H - camY * 0.04, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(144,205,244,${d.alpha})`; ctx.fill();
      });

      // planets
      planets.forEach(p => {
        const baseX = p.side === 'left' ? leftCX : rightCX;
        const floatX = Math.cos(t * p.floatSpeed * 0.7 + p.floatOffset) * (p.floatAmp * 0.5);
        const px = baseX + floatX + camX * 0.12;
        const floatY = Math.sin(t * p.floatSpeed + p.floatOffset) * p.floatAmp;
        const py = p.sy * H + floatY;
        p._sx = px; p._sy = py;
        drawPlanet(px, py, p);
      });

      // satellites / moons
      satellites.forEach(m => {
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

        if (m.isSat) {
          drawSatellite(mx, my, m.angle + Math.PI / 2);
        } else {
          ctx.beginPath(); ctx.arc(mx, my, m.r, 0, Math.PI * 2);
          ctx.fillStyle = m.color; ctx.fill();
        }
      });

      // rocket — drifts upward in right gutter, loops back from bottom
      if (gutter > 40) {
        if (!rocket.initialized) {
          rocket.x = rightCX + (Math.random() - 0.5) * gutter * 0.3;
          rocket.y = H * 0.85;
          rocket.initialized = true;
        }
        rocket.y += rocket.vy;
        rocket.flameT += 0.016;
        // slight horizontal sway
        const sway = Math.sin(t * 0.4) * 4;
        if (rocket.y < -60) {
          rocket.y = H + 60;
          rocket.x = rightCX + (Math.random() - 0.5) * gutter * 0.3;
        }
        drawRocket(rocket.x + sway + camX * 0.08, rocket.y, rocket.flameT);
      }

      // shooting stars
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
