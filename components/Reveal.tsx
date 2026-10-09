"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ─────────────────────────────────────────────────────────────────
   Reveal — the site's scroll-entrance system.
   Wraps any content and fades/slides it in the first time it enters
   the viewport. Use `delay` for staggered grids (e.g. i * 90).

   • IntersectionObserver, fires once, auto-disconnects.
   • prefers-reduced-motion → content is shown immediately with no
     transition (the CSS also short-circuits the animation).
   ───────────────────────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${shown ? " reveal--shown" : ""}${className ? ` ${className}` : ""}`}
      style={
        {
          transitionDelay: `${delay}ms`,
          "--reveal-y": `${y}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

export default Reveal;
