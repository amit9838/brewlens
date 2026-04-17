/**
 * @file ItemListRow.tsx
 * Compact list-view row for a single BrewItem.
 * Layout: favicon | name (full) · token | desc (ellipsis) | badges
 */
import { memo } from "react";
import { NavLink } from "react-router-dom";
import { type BrewItem } from "../../types";
import { FaviconImage } from "../ui/FaviconImage";
import { cn } from "../../lib/utils";

interface Props {
    item: BrewItem;
}

export const ItemListRow = memo(({ item }: Props) => {
    const isInactive = item.deprecated || item.disabled;
    const reason = item.deprecated ? "Deprecated" : item.disabled ? "Disabled" : null;

    return (
        <NavLink
            to={`/${item.type}/${item.token}`}
            className="flex items-center gap-2.5 px-2 py-2 sm:py-3 sm:px-4 sm:py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 hover:border-green-500/40 hover:shadow-sm transition-all group"
        >
            {/* Favicon */}
            <FaviconImage
                homepage={item.homepage}
                name={item.name}
                size={36}
                className="shrink-0 p-0.5 border border-gray-100 dark:border-zinc-700"
            />

            {/* Name + token — fixed width so desc always has room */}
            <div className=" flex flex-col shrink-0 w-40 sm:w-44">
                <span className="font-semibold text-sm text-gray-900 dark:text-zinc-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-tight">
                    {item.name}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono truncate leading-tight">
                    {item.token}
                </span>
                <span className="lg:hidden w-fit text-[10px] text-zinc-400 dark:text-zinc-500 font-mono bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                    v{item.version}
                </span>
            </div>

            {/* Description — fills remaining space, ellipsis */}
            <p className="flex-1 min-w-0 text-xs text-gray-400 dark:text-zinc-500 truncate hidden sm:block">
                {item.desc}
            </p>

            {/* Right-side badges */}
            <div className="flex items-center flex-wrap gap-1.5 shrisnk-0 ml-2">
                {/* Version */}
                <span className="hidden lg:inline-block text-[10px] text-zinc-400 dark:text-zinc-500 font-mono bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                    v{item.version}
                </span>

                {/* OSS badge */}
                {item.package.isFoss && (
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        OSS
                    </span>
                )}

                {/* Inactive badge */}
                {isInactive && (
                    <span className={cn(
                        "text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded",
                        "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                    )}>
                        {reason}
                    </span>
                )}

                {/* Type badge */}
                <span className={cn(
                    "text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded",
                    item.type === 'cask'
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                )}>
                    {item.type}
                </span>
            </div>
        </NavLink>
    );
});
