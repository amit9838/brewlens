/**
 * @file AppLane.tsx
 * Horizontal scroll lane for the Discover page.
 * Renders curated rows of modern, compact horizontal app cards with left/right scroll arrows.
 * Card design is consistent with the ItemCard design language used across the site.
 */
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flame, Sparkles } from 'lucide-react';
import { FaviconImage } from './FaviconImage';

interface AppLaneProps {
    items: any[];
    variant?: 'trending' | 'editor';
    onSeeAll?: () => void;
}

interface LaneCardProps {
    item: any;
    badge?: React.ReactNode;
}

/** Format raw download count to compact {x.y}k notation */
function formatDownloads(raw: string | number | undefined): string | null {
    if (!raw) return null;
    const n = typeof raw === 'string' ? Number(raw.replace(/,/g, '')) : raw;
    if (isNaN(n)) return null;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
}

/**
 * Standard lane card — matches ItemCard design system:
 * - Rounded icon with light border (matches ItemCard's favicon style)
 * - Green hover accent on name
 * - Consistent zinc border → green on hover
 * - Compact version pill
 */
const LaneCard: React.FC<LaneCardProps> = ({ item, badge }) => (
    <NavLink
        to={`/${item.type}/${item.token}`}
        className="group flex items-center gap-3 w-64 h-24 bg-white dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800/50 px-3 rounded-2xl hover:border-green-500 dark:hover:border-green-500 hover:shadow-md transition-all duration-200 shrink-0"
    >
        {/* Icon — iOS-style rounded square */}
        <FaviconImage
            homepage={item.homepage}
            name={item.name}
            size={44}
            className="rounded-xl border border-gray-100 dark:border-zinc-800 shrink-0 p-1"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
            {/* Name */}
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate leading-snug group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {item.name}
            </p>

            {/* Description */}
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 leading-snug mt-0.5">
                {item.desc || 'No description available.'}
            </p>

            {/* Bottom row: version pill + badge */}
            <div className="flex items-center gap-1.5 mt-1.5">
                {item.version && (
                    <span className="bg-gray-100 dark:bg-zinc-700/30 px-2 py-0.5 text-[10px] rounded-full text-zinc-500 dark:text-zinc-400 shrink-0">
                        v{item.version}
                    </span>
                )}
                {badge}
            </div>
        </div>

        {/* GET pill */}
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 px-3 py-1 rounded-full transition-all duration-200 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 shrink-0 select-none">
            GET
        </span>
    </NavLink>
);


export const AppLane: React.FC<AppLaneProps> = ({ items, variant, onSeeAll }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
    };

    if (items.length === 0) return null;

    return (
        <div className="relative group/lane">
            {/* Left arrow */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-7 h-7 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md text-zinc-600 dark:text-zinc-300 flex items-center justify-center opacity-0 group-hover/lane:opacity-100 transition-all hover:scale-110 cursor-pointer"
                aria-label="Scroll left"
            >
                <ChevronLeft size={14} />
            </button>

            {/* Scrollable row */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map(item => {
                    let badge: React.ReactNode = null;

                    if (variant === 'trending') {
                        const count = formatDownloads(item.downloads);
                        if (count) {
                            badge = (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full border border-orange-100 dark:border-orange-900/30">
                                    <Flame size={9} strokeWidth={2} />
                                    {count}
                                </span>
                            );
                        }
                    }


                    return (
                        <div key={item.id} className="snap-start">
                            <LaneCard item={item} badge={badge} />
                        </div>
                    );
                })}

                {/* "See All" tail card */}
                {onSeeAll && (
                    <button
                        onClick={onSeeAll}
                        className="flex-shrink-0 w-32 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40 flex flex-col items-center justify-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer"
                    >
                        <ChevronRight size={20} className="opacity-60" />
                        See All
                    </button>
                )}
            </div>

            {/* Right arrow */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-7 h-7 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md text-zinc-600 dark:text-zinc-300 flex items-center justify-center opacity-0 group-hover/lane:opacity-100 transition-all hover:scale-110 cursor-pointer"
                aria-label="Scroll right"
            >
                <ChevronRight size={14} />
            </button>
        </div>
    );
};

export default AppLane;
