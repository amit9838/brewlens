/**
 * @file AppLane.tsx
 * Horizontal scroll lane component for the Discover page.
 * Renders a curated row of compact app cards with left/right scroll arrows,
 * styled like App Store category lanes.
 */
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BrewItem } from '../../types';
import { FaviconImage } from './FaviconImage';

interface AppLaneProps {
    items: BrewItem[];
    onSeeAll?: () => void;
}

/** Compact lane card — icon + name + one-line desc */
const LaneCard: React.FC<{ item: BrewItem }> = ({ item }) => (
    <NavLink
        to={`/${item.type}/${item.token}`}
        className="group flex-shrink-0 w-44 sm:w-48"
    >
        <div className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/80 p-3.5 transition-all duration-200 hover:border-emerald-400/50 hover:shadow-md hover:shadow-emerald-500/5 hover:-translate-y-0.5 h-full">
            {/* Blurred favicon background */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <img
                    src={`https://www.google.com/s2/favicons?domain=${item.homepage}&sz=64`}
                    alt=""
                    aria-hidden
                    className="absolute -right-2 -top-2 w-20 h-20 filter blur-[24px] saturate-200 opacity-40 dark:opacity-20"
                />
            </div>

            <div className="relative z-10 flex flex-col gap-2.5">
                {/* Icon */}
                <FaviconImage
                    homepage={item.homepage}
                    name={item.name}
                    size={40}
                    className="rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-800"
                />

                {/* Name + desc */}
                <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate leading-snug">
                        {item.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-tight mt-0.5">
                        {item.desc}
                    </p>
                </div>

                {/* Get button */}
                <span className="mt-auto inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1 rounded-full w-fit transition-colors group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40">
                    Get
                </span>
            </div>
        </div>
    </NavLink>
);

export const AppLane: React.FC<AppLaneProps> = ({ items, onSeeAll }) => {
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
                {items.map(item => (
                    <div key={item.id} className="snap-start">
                        <LaneCard item={item} />
                    </div>
                ))}

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
