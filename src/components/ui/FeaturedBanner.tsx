/**
 * @file FeaturedBanner.tsx
 * Auto-scrolling editorial hero carousel for the Discover page.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { FEATURED_CASKS, CASK_CATEGORIES, getCategoryForToken } from '../../data/categories';
import type { BrewItem } from '../../types';
import { Button } from './Button';
import {
    ChevronLeft, ChevronRight, Terminal, Zap, Palette, Globe,
    Film, Sliders, MessageSquare, Shield, Type, Home, Download
} from 'lucide-react';

interface FeaturedBannerProps {
    items: BrewItem[];
}

// Consolidated style map: grouped colors for leaner code while supporting light/dark modes
const CATEGORY_STYLE_MAP: Record<string, { icon: React.ElementType, color: string, bg: string }> = {
    'dev-tools': { icon: Terminal, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    productivity: { icon: Zap, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    design: { icon: Palette, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
    browsers: { icon: Globe, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    media: { icon: Film, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    utilities: { icon: Sliders, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    communication: { icon: MessageSquare, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    security: { icon: Shield, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    fonts: { icon: Type, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    all: { icon: Home, color: 'text-zinc-600 dark:text-zinc-400', bg: 'bg-zinc-500/10 border-zinc-500/20' }
};

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ items }) => {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    // Optimized: useMemo prevents recalculating this array on every 4s interval tick
    // Reduce combines the previous map + filter(Boolean) into a single iteration
    const slides = useMemo(() => 
        FEATURED_CASKS.reduce<{ token: string; item: BrewItem }[]>((acc, token) => {
            const item = items.find(i => i.token === token);
            if (item) acc.push({ token, item });
            return acc;
        }, []), 
    [items]);

    const total = slides.length;
    const next = useCallback(() => setActive(a => (a + 1) % total), [total]);
    const prev = useCallback(() => setActive(a => (a - 1 + total) % total), [total]);

    useEffect(() => {
        if (paused || total === 0) return;
        const t = setInterval(next, 4000);
        return () => clearInterval(t);
    }, [paused, next, total]);

    if (total === 0) return null;


    
    return (
        <div
            className="relative overflow-hidden rounded-3xl h-52 sm:h-64 select-none bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {slides.map((s, i) => {
                const si = s.item;
                const sUrl = `https://www.google.com/s2/favicons?domain=${si.homepage}&sz=128`;

                const catId = getCategoryForToken(si, CASK_CATEGORIES);
                const catLabel = CASK_CATEGORIES.find(c => c.id === catId)?.label || 'Featured';
                const style = CATEGORY_STYLE_MAP[catId] || CATEGORY_STYLE_MAP.all;
                const CatIcon = style.icon;

                return (
                    <div
                        key={s.token}
                        className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        {/* Blurred background with Light/Dark support */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={sUrl}
                                alt=""
                                aria-hidden
                                className="absolute top-1/2 left-6 -translate-y-1/2 w-48 h-48 object-contain filter blur-[40px] saturate-200 opacity-60 dark:opacity-90 pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-200/60 via-zinc-200/70 to-zinc-100/50 dark:from-zinc-900/80 dark:via-zinc-900/80 dark:to-zinc-950/70" />
                        </div>

                        {/* Content */}
                        <NavLink
                            to={`/cask/${s.token}`}
                            className="absolute inset-0 z-10 flex items-center justify-between gap-6 px-8 sm:px-12 group"
                        >
                            <div className="flex items-center gap-6 min-w-0 flex-1 ml-4">
                                {/* App icon */}
                                <div className="shrink-0 p-1 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-zinc-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={sUrl}
                                        alt={si.name}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 rounded-xl"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <span className={`inline-block text-[10px] font-bold tracking-widest uppercase mb-2 px-2.5 py-0.5 rounded-full border ${style.color} ${style.bg}`}>
                                        {catLabel}
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white truncate leading-tight mb-1 flex items-center gap-2">
                                        {si.name}
                                    </h2>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-1 mb-4 max-w-md">
                                        {si.desc || "Curated visual application."}
                                    </p>
                                    <Button
                                        variant="glass"
                                        onClick={(e) => { e.preventDefault(); /* Prevent NavLink trigger if installing directly */ }}
                                        isPill
                                        size="sm"
                                        className="mt-2 w-fit"
                                    >
                                        <Download size={16} />
                                        Install
                                    </Button>
                                </div>
                            </div>

                            {/* Right: Artistic oversized category icon */}
                            <div 
                                className={`hidden md:flex shrink-0 items-center justify-center pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-5 dark:opacity-[0.07] ${style.color}`}
                                style={{ transform: 'translateY(-30%) translateX(20%) rotate(15deg)' }}
                            >
                                <CatIcon size={120} strokeWidth={0.6} />
                            </div>
                        </NavLink>
                    </div>
                );
            })}

            {/* Prev / Next arrows */}
            <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-zinc-200/50 dark:bg-black/30 hover:bg-zinc-300/80 dark:hover:bg-black/50 text-zinc-700 dark:text-white flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer border border-transparent hover:border-zinc-600 dark:hover:border-zinc-200"
                aria-label="Previous"
            >
                <ChevronLeft size={16} />
            </button>
            <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-zinc-200/50 dark:bg-black/30 hover:bg-zinc-300/80 dark:hover:bg-black/50 text-zinc-700 dark:text-white flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer border border-transparent hover:border-zinc-600 dark:hover:border-zinc-200"
                aria-label="Next"
            >
                <ChevronRight size={16} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActive(i); }}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                            i === active
                                ? 'w-5 h-1.5 bg-zinc-600 dark:bg-white'
                                : 'w-1.5 h-1.5 bg-zinc-400/50 hover:bg-zinc-500/70 dark:bg-white/40 dark:hover:bg-white/70'
                        }`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedBanner;