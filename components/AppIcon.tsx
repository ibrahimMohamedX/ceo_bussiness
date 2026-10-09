import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   AppIcon — the site's icon system.
   Every semantic icon (feature cards, process steps, tech items,
   categories) renders through this wrapper so the whole site shares
   one size scale and one stroke weight.

   Two icon families, one rule:
   • Semantic icons → AppIcon (presets below, stroke 1.5).
   • Action glyphs (arrows inside links/buttons) → raw lucide at the
     same scale with the lucide default stroke — they read as
     typography, not illustration.

   Size scale (px):
     xs 14   inline link arrows
     sm 16   button arrows, small inline marks
     md 20   list rows, hero highlights, tech items
     lg 24   category headers, accordions, step cards
     xl 28   feature cards, section headers
   ───────────────────────────────────────────────────────────────── */

export const ICON_SIZES = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
} as const;

export type IconSize = keyof typeof ICON_SIZES;

export interface AppIconProps {
  icon:
    | LucideIcon
    | ComponentType<{
        size?: number | string;
        strokeWidth?: number | string;
        className?: string;
      }>;
  size?: IconSize;
  /** Defaults to the system stroke weight (1.5). */
  strokeWidth?: number;
  className?: string;
}

export function AppIcon({
  icon: Icon,
  size = "md",
  strokeWidth = 1.5,
  className,
}: AppIconProps) {
  return (
    <Icon
      size={ICON_SIZES[size]}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}

export default AppIcon;
