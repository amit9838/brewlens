/**
 * @file FeaturedBanner.tsx
 * Auto-scrolling editorial hero carousel for the Discover page.
 * Shows curated Casks dynamically populated with their actual live metadata (desc, version, category) from the API.
 * Includes dynamic category styling and a floating category icon.
 */
import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { FEATURED_CASKS, CASK_CATEGORIES, getCategoryForToken } from '../../data/categories';
import type { BrewItem } from '../../types';
import { Button } from './Button';
import {
    ChevronLeft,
    ChevronRight,
    Terminal,
    Zap,
    Palette,
    Globe,
    Film,
    Sliders,
    MessageSquare,
    Shield,
    Type,
    Home,
    Download
} from 'lucide-react';

interface FeaturedBannerProps {
    items: BrewItem[];
}

// Curated style map to tint and color code each category card uniquely
const CATEGORY_STYLE_MAP: Record<string, { icon: React.ComponentType<any>, textColor: string, bgColor: string, borderColor: string }> = {
    'dev-tools': {
        icon: Terminal,
        textColor: 'text-indigo-400',
        bgColor: 'bg-indigo-500/10',
        borderColor: 'border-indigo-500/20'
    },
    productivity: {
        icon: Zap,
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20'
    },
    design: {
        icon: Palette,
        textColor: 'text-pink-400',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/20'
    },
    browsers: {
        icon: Globe,
        textColor: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20'
    },
    media: {
        icon: Film,
        textColor: 'text-rose-400',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/20'
    },
    utilities: {
        icon: Sliders,
        textColor: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20'
    },
    communication: {
        icon: MessageSquare,
        textColor: 'text-teal-400',
        bgColor: 'bg-teal-500/10',
        borderColor: 'border-teal-500/20'
    },
    security: {
        icon: Shield,
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20'
    },
    fonts: {
        icon: Type,
        textColor: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/20'
    },
    all: {
        icon: Home,
        textColor: 'text-zinc-400',
        bgColor: 'bg-zinc-500/10',
        borderColor: 'border-zinc-500/20'
    }
};

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ items }) => {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    // Map featured token config dynamically to resolved BrewItems loaded from the API
    const slides = FEATURED_CASKS
        .map(token => {
            const item = items.find(i => i.token === token);
            return item ? { token, item } : null;
        })
        .filter(Boolean) as { token: string; item: BrewItem }[];

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
                const si = s.item;
                const sUrl = `https://www.google.com/s2/favicons?domain=${si.homepage}&sz=128`;

                // Dynamically resolve category label using the package classifier
                const catId = getCategoryForToken(si, CASK_CATEGORIES);
                const catLabel = CASK_CATEGORIES.find(c => c.id === catId)?.label || 'Featured';

                // Resolve specific styling and icon for category color tinting
                const style = CATEGORY_STYLE_MAP[catId] || CATEGORY_STYLE_MAP.all;
                const CatIcon = style.icon;

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
                                className="absolute top-1/2 left-16 -translate-y-1/2 w-48 h-48 object-contain filter blur-[60px] saturate-200 opacity-80 dark:opacity-90 pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-700/95 via-zinc-600/75 to-zinc-700/50 dark:from-zinc-950/50 dark:via-zinc-950/80 dark:to-zinc-950/70" />
                        </div>

                        {/* Content */}
                        <NavLink
                            to={`/cask/${s.token}`}
                            className="absolute inset-0 z-10 flex items-center justify-between gap-6 px-8 sm:px-12 border border-white/10 rounded-3xl group"
                        >
                            <div className="flex items-center gap-6 min-w-0 flex-1 ml-4">
                                {/* App icon */}
                                <div className="shrink-0 p-1 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 shadow-xl flex items-center justify-center overflow-hidden">
                                    <img
                                        src={sUrl}
                                        alt={si.name}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 rounded-lg"
                                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <span className={`inline-block text-[10px] font-bold tracking-widest uppercase mb-2 px-2.5 py-0.5 rounded-full border ${style.textColor} ${style.bgColor} ${style.borderColor}`}>
                                        {catLabel}
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white truncate leading-tight mb-1 flex items-center gap-2">
                                        {si.name}

                                    </h2>
                                    <p className="text-sm text-zinc-300 line-clamp-1 mb-4 max-w-md">
                                        {si.desc || "Curated visual application."}
                                    </p>
                                    {/* <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors px-4 py-2 rounded-full shadow-lg">
                                        View App
                                    </span> */}
                                    <Button
                                        variant="glass"
                                        onClick={() => { }}
                                        isPill
                                        size="sm"
                                        className="mt-2 w-fit"
                                    >
                                        <Download size={16} />
                                        Install
                                    </Button>
                                </div>
                            </div>

                            {/* Right: Artistic oversized category icon — decorative watermark */}
                            <div className={`hidden md:flex shrink-0 items-center justify-center pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.07] ${style.textColor}`}
                                style={{ transform: 'translateY(-50%) rotate(15deg)' }}
                            >
                                <CatIcon size={200} strokeWidth={0.6} />
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
                        className={`transition-all duration-300 rounded-full cursor-pointer ${i === active
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
