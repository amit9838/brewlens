/**
 * @file ItemListRow.tsx
 * Compact list-view row for a single BrewItem.
 * Optimized for both main list and narrow modal views.
 */
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { type BrewItem } from "../../types";
import { FaviconImage } from "../ui/FaviconImage";
import { cn } from "../../lib/utils";

interface Props {
    item: BrewItem;
    showDesc?: boolean;
}

export const ItemListRow = memo(({ item, showDesc = true }: Props) => {
    const navigate = useNavigate();
    const isInactive = item.deprecated || item.disabled;
    const reason = item.deprecated ? "Deprecated" : item.disabled ? "Disabled" : null;

    const handleRowClick = () => {
        navigate(`/${item.type}/${item.token}`);
    };

    return (
        <div
            onClick={handleRowClick}
            className="flex items-center gap-3 px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 hover:border-green-500/40 hover:shadow-md transition-all group cursor-pointer"
        >
            {/* Favicon */}
            <div className="shrink-0">
                <FaviconImage
                    homepage={item.homepage}
                    name={item.name}
                    size={28}
                    className="p-0.5 border border-gray-100 dark:border-zinc-700"
                />
            </div>

            {/* Name + token (Flexible width) */}
            <div className="flex flex-col min-w-0 flex-1 sm:flex-none sm:w-48">
                <span className="font-semibold text-sm text-gray-900 dark:text-zinc-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-tight truncate">
                    {item.name}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono truncate leading-tight mt-0.5">
                    {item.token}
                </span>
            </div>

            {/* Description — visible on large screens, takes remaining space */}
            {showDesc && (
                <p className="flex-[2] min-w-0 text-xs text-gray-500 dark:text-zinc-400 truncate hidden lg:block">
                    {item.desc}
                </p>
            )}

            {/* Right-side area: Badges */}
            <div className="flex items-center justify-end gap-2">
                {/* Badges container */}
                <div className="flex items-center flex-wrap justify-end gap-1.5">
                    {/* Version (hidden on very small) */}
                    <span className="hidden sm:inline-block text-[10px] text-zinc-400 dark:text-zinc-500 font-mono bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                        v{item.version}
                    </span>

                    {/* Status badges */}
                    {item.package.isFoss && (
                        <span className="hidden md:inline-block text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            OSS
                        </span>
                    )}

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
            </div>
        </div>
    );
});
