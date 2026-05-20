import { NavLink } from 'react-router-dom';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { FaviconImage } from './FaviconImage';

interface RecentlyViewedStripProps {
    maxVisible?: number;
}

function RecentlyViewedCard({ item }: { item: any }) {
    // URL for the background blur effect (same as FaviconImage uses internally)
    const imageUrl = item.homepage
        ? `https://www.google.com/s2/favicons?domain=${item.homepage}&sz=64`
        : null;
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (!imageUrl) return;
        const img = new Image();
        img.onload = () => setImageLoaded(true);
        img.onerror = () => setImageLoaded(true); // Still show something if it fails
        img.src = imageUrl;
    }, [imageUrl]);

    return (
        <NavLink
            to={`/${item.type}/${item.token}`}
            className="group flex flex-col h-full px-4 py-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md hover:border-green-500/50 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all relative overflow-hidden"
            style={
                imageUrl
                    ? ({
                          '--bg-url': `url(${imageUrl})`,
                      } as React.CSSProperties)
                    : undefined
            }
        >
            {/* Shuttle Gradient: Dedicated clipping wrapper for the background blur */}
            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none z-0">
                <div
                    className={cn(
                        "absolute inset-3 bg-contain bg-right bg-no-repeat bg-[image:var(--bg-url)] filter blur-[32px] saturate-200 transition-all duration-700 transform group-hover:scale-125 group-hover:saturate-250",
                        imageLoaded ? "opacity-30 dark:opacity-10" : "opacity-0"

                    )}
                />
            </div>

            {/* Content – keep on top with relative positioning */}
            <div className="upper flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 rounded-md overflow-hidden flex items-center justify-center">
                    <FaviconImage
                        homepage={item.homepage}
                        name={item.name}
                        size={36}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate block">
                            {item.name}
                        </span>
                        <span className="shrink-0 text-[9px] font-black tracking-tighter px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase">
                            {item.type === 'cask' ? 'cask' : 'fml'}
                        </span>
                    </div>
                    {item.version && (
                        <div className="version-row mt-1">
                            <span className="text-[10px] text-zinc-400 font-bold bg-zinc-100/50 dark:bg-zinc-800/50 px-1 rounded inline-block">
                                v{item.version}
                            </span>
                        </div>
                    )}
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-1 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                        {item.desc}
                    </p>
                </div>
            </div>
        </NavLink>
    );
}

export default function RecentlyViewedSection({ maxVisible = 12 }: RecentlyViewedStripProps) {
    const { recentItems } = useRecentlyViewed();

    if (recentItems.length === 0) return null;

    // Use responsive limits: 6 for mobile (< 640px), up to 12 for desktop
    const visible = recentItems.slice(0, maxVisible);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {visible.map((item, idx) => (
                <div
                    key={item.id}
                    className={cn(
                        "flex flex-col transition-all duration-300",
                        idx >= 6 && "hidden sm:flex" // Updated from sm:block to sm:flex
                    )}
                >
                    <RecentlyViewedCard item={item} />
                </div>
            ))}
        </div>
    );
}