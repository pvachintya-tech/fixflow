'use client';

import { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  phase: 0 | 1 | 2 | 3;
}

// ─── Particle ───────────────────────────────────────────────────
interface ParticleState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  consumed: boolean;
}

function createParticle(canvasW: number, canvasH: number): ParticleState {
  return {
    x: Math.random() * canvasW,
    y: Math.random() * canvasH,
    vx: (Math.random() - 0.5) * 1.6,
    vy: (Math.random() - 0.5) * 1.6,
    radius: Math.random() * 2 + 2,
    opacity: 1,
    consumed: false,
  };
}

// ─── Orbiter ────────────────────────────────────────────────────
interface OrbiterState {
  angle: number;
  speed: number;
  radius: number;
  distance: number;
  opacity: number;
}

function createOrbiter(baseDistance: number): OrbiterState {
  return {
    angle: Math.random() * Math.PI * 2,
    speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
    radius: Math.random() * 1.5 + 1,
    distance: baseDistance + Math.random() * 30 - 15,
    opacity: 0,
  };
}

// ─── Component ──────────────────────────────────────────────────
export default function ParticleCanvas({ phase }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);

  // Keep the ref in sync without re-running the effect
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Single persistent animation loop — runs once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;

    // ── Sizing ──
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // ── State ──
    const PARTICLE_COUNT = 40;
    const ORBITER_COUNT = 6;

    const particles: ParticleState[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(canvas.width, canvas.height));
    }

    const orbiters: OrbiterState[] = [];
    for (let i = 0; i < ORBITER_COUNT; i++) {
      orbiters.push(createOrbiter(70));
    }

    // Smooth transitions
    let ringOpacity = 0;        // fades in during phase 2
    let ringScale = 0;          // grows from 0 → 1
    let flareRadius = 0;
    let flareOpacity = 0;
    let glowOpacity = 0;        // ambient glow in phase 3
    let lineOpacity = 0;        // connecting lines in phase 1

    // ── Render Loop ──
    const render = () => {
      const p = phaseRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      // ─── Smooth value transitions ───

      // Lines: visible in phase 1, fade out in phase 2+
      const lineTarget = p === 1 ? 0.2 : 0;
      lineOpacity += (lineTarget - lineOpacity) * 0.04;

      // Ring: appears in phase 2, stays in phase 3
      const ringOpTarget = p >= 2 ? 1 : 0;
      ringOpacity += (ringOpTarget - ringOpacity) * 0.05;
      const ringScaleTarget = p >= 2 ? 1 : 0;
      ringScale += (ringScaleTarget - ringScale) * 0.04;

      // Glow: builds in phase 3
      const glowTarget = p === 3 ? 0.2 : 0;
      glowOpacity += (glowTarget - glowOpacity) * 0.03;

      // ─── Draw connecting lines ───
      if (lineOpacity > 0.005) {
        ctx.strokeStyle = `rgba(156, 163, 175, ${lineOpacity})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          if (particles[i].consumed) continue;
          for (let j = i + 1; j < particles.length; j++) {
            if (particles[j].consumed) continue;
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const alpha = (1 - dist / 150) * lineOpacity;
              ctx.strokeStyle = `rgba(156, 163, 175, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // ─── Draw center ring ───
      if (ringOpacity > 0.01) {
        const r = 60 * ringScale;
        ctx.save();
        ctx.globalAlpha = ringOpacity;

        // Outer glow
        const rg = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.6);
        rg.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
        rg.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = rg;
        ctx.fill();

        // Ring stroke
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      }

      // ─── Flare (when all particles consumed in phase 2) ───
      const allConsumed = particles.every(pt => pt.consumed);
      if (p === 2 && allConsumed && flareOpacity < 1) {
        // Trigger the flare once
        flareOpacity = 1;
        flareRadius = 0;
      }
      if (flareOpacity > 0.01) {
        flareRadius += 6;
        flareOpacity *= 0.96;

        const fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, flareRadius);
        fg.addColorStop(0, `rgba(34, 211, 238, ${flareOpacity * 0.8})`);
        fg.addColorStop(0.4, `rgba(251, 191, 36, ${flareOpacity * 0.3})`);
        fg.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, flareRadius, 0, Math.PI * 2);
        ctx.fillStyle = fg;
        ctx.fill();
      }

      // ─── Ambient glow (phase 3) ───
      if (glowOpacity > 0.005) {
        const ag = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
        ag.addColorStop(0, `rgba(6, 182, 212, ${glowOpacity})`);
        ag.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, 120, 0, Math.PI * 2);
        ctx.fillStyle = ag;
        ctx.fill();
      }

      // ─── Update & draw particles ───
      for (const pt of particles) {
        if (pt.consumed) continue;

        if (p === 0 || p === 1) {
          // Chaos — Brownian drift
          pt.vx += (Math.random() - 0.5) * 0.4;
          pt.vy += (Math.random() - 0.5) * 0.4;
          const speed = Math.sqrt(pt.vx * pt.vx + pt.vy * pt.vy);
          if (speed > 1.8) {
            pt.vx = (pt.vx / speed) * 1.8;
            pt.vy = (pt.vy / speed) * 1.8;
          }
          pt.x += pt.vx;
          pt.y += pt.vy;

          // Bounce off edges
          if (pt.x < 0 || pt.x > W) pt.vx *= -1;
          if (pt.y < 0 || pt.y > H) pt.vy *= -1;
          pt.x = Math.max(0, Math.min(W, pt.x));
          pt.y = Math.max(0, Math.min(H, pt.y));
        } else if (p === 2) {
          // Fusion — strong acceleration toward center
          const dx = cx - pt.x;
          const dy = cy - pt.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 15) {
            pt.consumed = true;
            pt.opacity = 0;
          } else {
            // Strong pull that increases dramatically as particles get closer
            const pull = 0.15 + (2.5 / Math.max(dist * 0.015, 0.5));
            pt.vx += (dx / dist) * pull;
            pt.vy += (dy / dist) * pull;
            // Light damping for a smooth spiral
            pt.vx *= 0.96;
            pt.vy *= 0.96;
            pt.x += pt.vx;
            pt.y += pt.vy;

            // Color transition: red → cyan as they approach center
            const t = Math.max(0, Math.min(1, 1 - dist / 400));
            const r = Math.round(248 - t * 242);  // 248 → 6
            const g = Math.round(113 + t * 69);    // 113 → 182
            const b = Math.round(113 + t * 99);    // 113 → 212
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pt.opacity})`;
            ctx.fill();
            continue; // skip default draw below
          }
        } else if (p === 3) {
          // Phase 3: any stragglers that weren't consumed — rapidly fade them out
          pt.opacity *= 0.9;
          if (pt.opacity < 0.02) {
            pt.consumed = true;
            pt.opacity = 0;
            continue;
          }
          // Still pull them toward center while fading
          const dx = cx - pt.x;
          const dy = cy - pt.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5) {
            pt.vx += (dx / dist) * 0.5;
            pt.vy += (dy / dist) * 0.5;
            pt.vx *= 0.92;
            pt.vy *= 0.92;
            pt.x += pt.vx;
            pt.y += pt.vy;
          }
        }

        // Default draw (red particle)
        if (!pt.consumed) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(248, 113, 113, ${pt.opacity})`;
          ctx.fill();
        }
      }

      // ─── Orbiters (phase 3 fade-in) ───
      for (const o of orbiters) {
        const oTarget = p === 3 ? 0.7 : 0;
        o.opacity += (oTarget - o.opacity) * 0.03;
        o.angle += o.speed;

        if (o.opacity > 0.01) {
          const ox = cx + Math.cos(o.angle) * o.distance;
          const oy = cy + Math.sin(o.angle) * o.distance;
          ctx.beginPath();
          ctx.arc(ox, oy, o.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 211, 238, ${o.opacity})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []); // ← runs ONCE, reads phase from ref

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
