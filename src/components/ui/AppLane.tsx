/**
 * @file AppLane.tsx
 * Horizontal scroll lane component for the Discover page.
 * Renders curated rows of modern, compact horizontal app cards with left/right scroll arrows,
 * styled like standard App Store list-row lanes with minimal redundant items.
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

/** 
 * Standard, modern, space-efficient horizontal app card.
 * Removes redundant blurred background images and layout weight.
 */
const LaneCard: React.FC<LaneCardProps> = ({ item, badge }) => (
    <NavLink
        to={`/${item.type}/${item.token}`}
        className="group flex items-center justify-between gap-3 w-64 sm:w-72 bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 p-3 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200"
    >
        {/* Left: Rounded Icon */}
        <FaviconImage
            homepage={item.homepage}
            name={item.name}
            size={36}
            className="rounded-md"
        />

        {/* Middle: Content */}
        <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.name}
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 line-clamp-1 leading-snug mt-0.5">
                {item.desc || "No description available."}
            </p>
            {badge && (
                <div className="mt-1">
                    {badge}
                </div>
            )}
        </div>

        {/* Right: GET CTA */}
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 px-3.5 py-1 rounded-full transition-all duration-200 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 shadow-3xs shrink-0 select-none">
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
                        const formatted = item.downloads
                            ? (isNaN(Number(item.downloads.replace(/,/g, '')))
                                ? item.downloads
                                : Number(item.downloads.replace(/,/g, '')).toLocaleString())
                            : null;

                        if (formatted) {
                            badge = (
                                <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-orange-600 dark:text-orange-400">
                                    <Flame size={8} />
                                    {formatted} installs
                                </span>
                            );
                        }
                    } else if (variant === 'editor') {
                        badge = (
                            <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-amber-600 dark:text-amber-400">
                                <Sparkles size={8} />
                                Editor's Choice
                            </span>
                        );
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
