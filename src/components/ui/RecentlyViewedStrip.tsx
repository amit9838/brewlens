/**
 * @file RecentlyViewedStrip.tsx
 * Horizontally scrollable strip of recently viewed brew items.
 */
import { NavLink } from 'react-router-dom';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';

interface RecentlyViewedStripProps {
    maxVisible?: number;
}

export default function RecentlyViewedStrip({ maxVisible = 10 }: RecentlyViewedStripProps) {
    const { recentItems } = useRecentlyViewed();

    if (recentItems.length === 0) return null;

    const visible = recentItems.slice(0, maxVisible);

    return (
        <div className="flex-1 flex flex-wrap gap-4 scrollbar-none">
            {visible.map((item) => (
                <NavLink
                    key={item.id}
                    to={`/${item.type}/${item.token}`}
                    className="shrink-0 gap-2 px-3 py-3  w-57 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                    title={item.name}
                >
                    <div className="upper flex items-center gap-2">
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${item.homepage}&sz=32`}
                            onError={(e) => (e.currentTarget.src = '/vite.svg')}
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
                    <div className="lower pt-2">
                        <span className="text-sm text-zinc-800 dark:text-zinc-400 line-clamp-2">
                            {item.desc}
                        </span>
                    </div>
                </NavLink>
            ))}
        </div>

    );
}
