/**
 * @file BookmarkButton.tsx
 * Round toggle that saves/removes a BrewItem from bookmarks.
 */
import { Bookmark } from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarksContext';
import type { BrewItem } from '../../types';
import { cn } from '../../lib/utils';

interface Props {
    item: BrewItem;
    /** `solid` = filled chip (detail page); `plain` = white on grey cards */
    tone?: 'solid' | 'plain';
    className?: string;
}

export function BookmarkButton({ item, tone = 'solid', className }: Props) {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const on = isBookmarked(item.id);
    return (
        <button
            type="button"
            aria-pressed={on}
            aria-label={on ? `Remove ${item.name} from bookmarks` : `Bookmark ${item.name}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(item); }}
            className={cn(
                'flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 transition-colors',
                tone === 'solid' ? 'h-11 w-11' : 'h-10 w-10',
                on ? 'bg-accent-soft text-accent-ink' : tone === 'solid' ? 'bg-chip text-ink hover:bg-line-strong' : 'bg-raised text-ink hover:bg-chip',
                className,
            )}
        >
            <Bookmark size={tone === 'solid' ? 18 : 20} fill={on ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>
    );
}
