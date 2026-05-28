/**
 * @file FeaturedBanner.tsx
 * Auto-scrolling editorial hero carousel for the Discover page.
 * Shows curated "Staff Picks" with blurred favicon backgrounds, app metadata,
 * and a direct CTA. Auto-plays every 4 seconds, pauses on hover.
 */
import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { FEATURED_CASKS } from '../../data/categories';
import type { BrewItem } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedBannerProps {
    items: BrewItem[];
}

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ items }) => {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    // Map featured config to resolved BrewItems
    const slides = FEATURED_CASKS
        .map(fc => ({
            ...fc,
            item: items.find(i => i.token === fc.token),
        }))
        .filter(s => s.item != null);

    const total = slides.length;

    const next = useCallback(() => setActive(a => (a + 1) % total), [total]);
    const prev = useCallback(() => setActive(a => (a - 1 + total) % total), [total]);

    useEffect(() => {
        if (paused || total === 0) return;
        const t = setInterval(next, 4000);
        return () => clearInterval(t);
    }, [paused, next, total]);

    if (slides.length === 0) return null;


    return (
        <div
            className="relative overflow-hidden rounded-3xl h-52 sm:h-64 select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Slides — absolute positioned, transition via opacity */}
            {slides.map((s, i) => {
                const si = s.item!;
                const sUrl = `https://www.google.com/s2/favicons?domain=${si.homepage}&sz=128`;
                return (
                    <div
                        key={s.token}
                        className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        {/* Blurred background */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={sUrl}
                                alt=""
                                aria-hidden
                                className="absolute top-1/2 left-16 -translate-y-1/2 w-48 h-48 object-contain filter blur-[60px] saturate-200 opacity-80 dark:opacity-40 pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/95 via-zinc-900/75 to-zinc-900/30 dark:from-zinc-950/98 dark:via-zinc-950/80 dark:to-zinc-950/40" />
                        </div>

                        {/* Content */}
                        <NavLink
                            to={`/cask/${s.token}`}
                            className="absolute inset-0 z-10 flex items-center gap-6 px-8 sm:px-12"
                        >
                            {/* App icon */}
                            <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 shadow-xl flex items-center justify-center overflow-hidden">
                                <img
                                    src={sUrl}
                                    alt={si.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-emerald-400 mb-2 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                                    {s.tag}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white truncate leading-tight mb-1">
                                    {si.name}
                                </h2>
                                <p className="text-sm text-zinc-300 line-clamp-1 mb-4 max-w-md">
                                    {s.tagline}
                                </p>
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors px-4 py-2 rounded-full shadow-lg">
                                    View App
                                </span>
                            </div>
                        </NavLink>
                    </div>
                );
            })}

            {/* Prev / Next arrows */}
            <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer"
                aria-label="Previous"
            >
                <ChevronLeft size={16} />
            </button>
            <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer"
                aria-label="Next"
            >
                <ChevronRight size={16} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                            i === active
                                ? 'w-5 h-1.5 bg-white'
                                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedBanner;
