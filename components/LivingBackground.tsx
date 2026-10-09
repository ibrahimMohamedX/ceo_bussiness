"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────
   LivingBackground — site-wide animated ambient layer.
   Sparse drifting glow "fireflies" + slow ambient radial washes,
   modeled on the hero ambience of build.nvidia.com, re-tuned to
   this site's palette for BOTH themes:

   • dark  → luminous cyan fireflies on the near-black base
   • light → deep-cyan motes drifting over the pale base

   Mounts ONCE as a direct <body> child from app/[locale]/layout.tsx
   and covers the viewport as a fixed layer behind all content
   (see `.living-bg` in app/globals.css; the shell/body stay
   transparent so the canvas shows through).

   Self-contained theme detection: observes the `light` class on
   <html> (the same mechanism the design tokens use) — no React
   context dependency, works in any tree position.

   Engineering notes:
   • 2D canvas, pre-rendered halo sprites (no per-frame shadowBlur).
   • Delta-time driven rAF loop; pauses when the tab is hidden.
   • prefers-reduced-motion → a single static frame, no loop.
   ───────────────────────────────────────────────────────────────── */

type Rgb = [number, number, number];

interface Wash {
  rgba: Rgb;
  alpha: number;
  /** Radius relative to min(width, height). */
  radius: number;
}

interface Palette {
  /** Particle core colors (most common first). */
  cores: Rgb[];
  /** Alpha of the soft halo sprite behind each particle. */
  haloAlpha: number;
  /** Core dot alpha range [min, max] across the pulse cycle. */
  coreAlpha: [number, number];
  /** Ambient radial washes layered under the particles. */
  washes: Wash[];
}

/* Palettes mirror the design tokens in app/globals.css:
   dark:  --background #070a0d, --primary #6ee7f2
   light: --background #f4f7f9, --primary #0891b2 */
const DARK: Palette = {
  cores: [
    [110, 231, 242],
    [110, 231, 242],
    [110, 231, 242],
    [214, 238, 244],
    [64, 199, 214],
  ],
  haloAlpha: 0.16,
  coreAlpha: [0.35, 0.95],
  washes: [
    { rgba: [0, 149, 196], alpha: 0.085, radius: 0.55 },
    { rgba: [40, 125, 136], alpha: 0.06, radius: 0.42 },
    { rgba: [0, 149, 196], alpha: 0.05, radius: 0.34 },
  ],
};

const LIGHT: Palette = {
  cores: [
    [8, 145, 178],
    [8, 145, 178],
    [8, 145, 178],
    [36, 99, 117],
    [64, 130, 148],
  ],
  haloAlpha: 0.1,
  coreAlpha: [0.3, 0.85],
  washes: [
    { rgba: [8, 145, 178], alpha: 0.05, radius: 0.55 },
    { rgba: [8, 116, 150], alpha: 0.035, radius: 0.42 },
    { rgba: [8, 145, 178], alpha: 0.03, radius: 0.34 },
  ],
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Core radius in CSS px. */
  r: number;
  /** Palette core color index. */
  color: number;
  /** Pulse phase offset (rad) and speed (rad/s). */
  phase: number;
  pulseRate: number;
  /** Vertical sine wobble amplitude (px/s) and speed (rad/s). */
  wobbleAmp: number;
  wobbleRate: number;
  /** 0 = far layer (small/dim/slow), 1 = near layer. */
  depth: number;
  /** Wobble phase offset. */
  wobblePhase: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function makeParticle(w: number, h: number): Particle {
  const depth = Math.random() < 0.62 ? 0 : 1;
  const speed = depth === 0 ? rand(2, 6) : rand(5, 11);
  const dir = Math.random() < 0.5 ? -1 : 1;
  return {
    x: rand(0, w),
    y: rand(0, h),
    vx: dir * speed,
    vy: rand(-2.2, 2.2),
    r: depth === 0 ? rand(0.5, 1.1) : rand(1.1, 2.3),
    color: Math.floor(Math.random() * 5),
    phase: rand(0, Math.PI * 2),
    pulseRate: rand(0.55, 1.5),
    wobbleAmp: rand(5, 16),
    wobbleRate: rand(0.05, 0.14),
    wobblePhase: rand(0, Math.PI * 2),
    depth,
  };
}

/** Pre-render a soft radial halo sprite per core color (64×64). */
function makeHaloSprites(cores: Rgb[]): HTMLCanvasElement[] {
  return cores.map(([r, g, b]) => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const x = c.getContext("2d");
    if (!x) return c;
    const grad = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
    grad.addColorStop(0.25, `rgba(${r},${g},${b},0.45)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = grad;
    x.fillRect(0, 0, 64, 64);
    return c;
  });
}

/** The public theme system keeps a resolved class on <html>. */
function readTheme(): "dark" | "light" {
  return document.documentElement.classList.contains("light")
    ? "light"
    : "dark";
}

export function LivingBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let theme = readTheme();
    let palette: Palette = theme === "light" ? LIGHT : DARK;
    let sprites = makeHaloSprites(palette.cores);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let last = 0;
    let lastT = rand(0, 100);
    let running = false;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const seedParticles = () => {
      const target = Math.max(24, Math.min(110, Math.round((width * height) / 22000)));
      particles = Array.from({ length: target }, () => makeParticle(width, height));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) seedParticles();
      else {
        // Keep particles in bounds after a resize.
        for (const p of particles) {
          p.x = Math.min(p.x, width);
          p.y = Math.min(p.y, height);
        }
      }
    };

    const drawWashes = (t: number) => {
      const m = Math.min(width, height);
      palette.washes.forEach((wash, i) => {
        // Each wash drifts on its own slow sine loop.
        const px = width * (0.5 + 0.34 * Math.sin(t * 0.021 + i * 2.4));
        const py = height * (0.42 + 0.3 * Math.cos(t * 0.016 + i * 1.7));
        const rad = m * wash.radius * (1 + 0.08 * Math.sin(t * 0.03 + i));
        const grad = ctx.createRadialGradient(px, py, 0, px, py, rad);
        const [r, g, b] = wash.rgba;
        grad.addColorStop(0, `rgba(${r},${g},${b},${wash.alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });
    };

    const drawParticles = (t: number, dt: number) => {
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt + Math.sin(t * p.wobbleRate + p.wobblePhase) * p.wobbleAmp * dt;
        // Wrap around the edges with a small margin.
        const margin = 24;
        if (p.x < -margin) p.x = width + margin;
        else if (p.x > width + margin) p.x = -margin;
        if (p.y < -margin) p.y = height + margin;
        else if (p.y > height + margin) p.y = -margin;

        const pulse = 0.5 + 0.5 * Math.sin(t * p.pulseRate + p.phase);
        const haloSize = p.r * 7;

        // Soft halo (pre-rendered sprite).
        ctx.globalAlpha = palette.haloAlpha * (0.45 + 0.55 * pulse);
        ctx.drawImage(
          sprites[p.color],
          p.x - haloSize,
          p.y - haloSize,
          haloSize * 2,
          haloSize * 2,
        );

        // Tight inner glow.
        const inner = p.r * 2.6;
        ctx.globalAlpha = 0.5 * (0.4 + 0.6 * pulse);
        ctx.drawImage(sprites[p.color], p.x - inner, p.y - inner, inner * 2, inner * 2);

        // Solid core dot.
        const [r, g, b] = palette.cores[p.color];
        const a = palette.coreAlpha[0] + (palette.coreAlpha[1] - palette.coreAlpha[0]) * pulse;
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const draw = (t: number, dt: number) => {
      lastT = t;
      ctx.clearRect(0, 0, width, height);
      drawWashes(t);
      drawParticles(t, dt);
    };

    const frame = (now: number) => {
      if (!running) return;
      const t = now / 1000;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      draw(t, dt);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    // Theme flips arrive as class changes on <html> (same source of
    // truth the html.light token overrides use). Palette + sprites
    // swap live; particles keep their positions.
    const onRootClass = () => {
      const next = readTheme();
      if (next === theme) return;
      theme = next;
      palette = next === "light" ? LIGHT : DARK;
      sprites = makeHaloSprites(palette.cores);
      if (!running && width > 0) draw(lastT, 0); // static-mode repaint
    };

    const mo = new MutationObserver(onRootClass);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const ro = new ResizeObserver(() => {
      // Debounce: canvas resize resets the bitmap.
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        // In reduced-motion mode there is no loop — repaint the one
        // static frame whenever the canvas is (re)sized.
        if (reducedMotion && width > 0) draw(rand(0, 100), 0);
      }, 120);
    });

    ro.observe(canvas);
    resize();

    if (reducedMotion) {
      // One calm static frame — no continuous animation.
      draw(rand(0, 100), 0);
    } else {
      start();
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      stop();
      ro.disconnect();
      mo.disconnect();
      clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="living-bg" aria-hidden="true" />;
}

export default LivingBackground;
