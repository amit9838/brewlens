/**
 * @file CategoryBadge.tsx
 * Clickable category chip for package detail pages.
 *
 * Renders the package's resolved category with its color family + icon, and
 * navigates to the /all listing with `category` + `type` filters applied —
 * the same behavior as clicking a category card on the Explore page.
 *
 * Built on the shared Button component; category color classes override the
 * variant styles via cn()/tailwind-merge so the chip reads as a distinct,
 * clickable control (shadow at rest, lift on hover, press on click).
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import type { BrewType } from "../../types";
import { Button } from "./Button";
import {
  CASK_CATEGORIES,
  FORMULA_CATEGORIES,
  getCategoryStyle,
} from "../../data/categories";
import {
  Home,
  Zap,
  Terminal,
  Globe,
  Palette,
  Film,
  Sliders,
  MessageSquare,
  Shield,
  Type,
  Bot,
  Gamepad2,
  Code,
  Database,
  Rocket,
  GitBranch,
  Cpu,
  Network,
  Hammer,
  Gauge,
} from "lucide-react";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Home,
  Zap,
  Terminal,
  Globe,
  Palette,
  Film,
  Sliders,
  MessageSquare,
  Shield,
  Type,
  Bot,
  Gamepad2,
  Code,
  Database,
  Rocket,
  GitBranch,
  Cpu,
  Network,
  Hammer,
  Gauge,
};

export const CategoryBadge: React.FC<{
  categoryId: string;
  type: BrewType;
}> = ({ categoryId, type }) => {
  const navigate = useNavigate();

  if (!categoryId || categoryId === "all") return null;

  const categories = type === "cask" ? CASK_CATEGORIES : FORMULA_CATEGORIES;
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return null;

  const s = getCategoryStyle(cat.color);
  const Icon = ICON_MAP[cat.icon] || Home;

  return (
    <Button
      onClick={() => navigate(`/all?category=${cat.id}&type=${type}`)}
      title={`Browse all ${type}s in ${cat.label}`}
      variant="secondary"
      size="sm"
      isPill
      className={cn(
        "h-auto px-3.5 py-1.5 text-xs font-bold gap-1.5 shadow-xs",
        "hover:shadow-sm",
        s.badgeBg,
        s.badgeColor,
        s.border,
        s.hoverBorder,
        s.hoverBg,
      )}
    >
      <Icon size={12} />
      <span>{cat.label}</span>
    </Button>
  );
};

export default CategoryBadge;