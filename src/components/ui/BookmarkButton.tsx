/**
 * @file BookmarkButton.tsx
 * A toggle button that bookmarks/unbookmarks a BrewItem into the 'favourites' collection.
 */

import { Bookmark } from 'lucide-react';
import { Button } from './Button';
import { useBookmarks } from '../contexts/BookmarksContext';
import type { BrewItem } from '../../types';

interface BookmarkButtonProps {
    item: BrewItem;
    size?: 'sm' | 'md';
}

export function BookmarkButton({ item, size = 'md' }: BookmarkButtonProps) {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const bookmarked = isBookmarked(item.id);

    return (
        <Button
            variant="ghost"
            size={size}
            onClick={() => toggleBookmark(item)}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
            <Bookmark
                className={bookmarked ? 'fill-current text-yellow-500' : undefined}
                size={size === 'sm' ? 18 : 20}
            />
        </Button>
    );
}
