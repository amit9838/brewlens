import { NavLink } from 'react-router-dom';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useState } from 'react';

interface RecentlyViewedStripProps {
    maxVisible?: number;
}

function RecentlyViewedCard({ item }: { item: any }) {
    // state to hold the final image URL (handles fallback)
    const [imageUrl, setImageUrl] = useState(
        `https://unavatar.io/google/${item.homepage}`
    );

    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
        const fallbackUrl = `https://www.google.com/s2/favicons?domain=${item.homepage}&sz=32`;
        e.currentTarget.src = fallbackUrl;
        e.currentTarget.removeAttribute('crossOrigin');
        // also update the background image URL
        setImageUrl(fallbackUrl);
    };

    return (
        <NavLink
            to={`/${item.type}/${item.token}`}
            // Removed overflow-hidden from here to prevent clipping
            className="shrink-0 block px-3 py-3 min-w-full sm:min-w-46 max-w-60 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all relative"
            style={
                {
                    '--bg-url': `url(${imageUrl})`,
                } as React.CSSProperties
            }
        >
            {/* Dedicated clipping wrapper for the background blur */}
            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none z-0">
                <div className="absolute inset-3 bg-contain bg-right bg-no-repeat bg-[image:var(--bg-url)] filter blur-[30px] saturate-120 opacity-10 transition-all duration-200" />
            </div>

            {/* Content – keep on top with relative positioning */}
            <div className="upper flex items-center gap-2 relative z-10">
                <img
                    src={imageUrl}
                    onError={handleImageError}
                    className="w-6 h-6 rounded-sm shrink-0"
                    alt=""
                />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate flex-1">
                    {item.name}
                </span>
                <span className="shrink-0 text-[10px] px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 uppercase">
                    {item.type === 'cask' ? 'cask' : 'fml'}
                </span>
            </div>
            <div className="lower pt-2 relative z-10">
                <span className="text-sm text-zinc-800 dark:text-zinc-400 line-clamp-2">
                    {item.desc}
                </span>
            </div>
        </NavLink>
    );
}

export default function RecentlyViewedSection({ maxVisible = 10 }: RecentlyViewedStripProps) {
    const { recentItems } = useRecentlyViewed();

    if (recentItems.length === 0) return null;

    const visible = recentItems.slice(0, maxVisible);

    return (
        <div className="flex-1 flex flex-wrap gap-4 scrollbar-none">
            {visible.map((item) => (
                <RecentlyViewedCard key={item.id} item={item} />
            ))}
        </div>
    );
}