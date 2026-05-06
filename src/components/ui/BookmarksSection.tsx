/**
 * @file BookmarksSection.tsx
 * A standalone dashboard section for displaying a preview of bookmarked items.
 */
import { BookmarkIcon } from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarksContext';
import { useModal } from '../contexts/ModalContexts';
import BookmarksModal from './BookmarksModal';
import { ItemCard } from '../ItemCard';
import { Button } from './Button';

interface BookmarksSectionProps {
    maxItems?: number;
}

export default function BookmarksSection({ maxItems = 4 }: BookmarksSectionProps) {
    const { bookmarks } = useBookmarks();
    const { openModal } = useModal();

    if (!bookmarks || bookmarks.length === 0) return null;

    const handleViewAllBookmarks = () => {
        openModal(() => <BookmarksModal />, { size: 'lg' });
    };

    return (
        <div className="section bg-gradient-to-br from-yellow-400/5 via-amber-500/5 to-transparent dark:from-yellow-500/2 dark:via-amber-600/4 dark:to-transparent border border-zinc-100 dark:border-zinc-800/50 rounded-xl p-4 backdrop-blur-sm transition-all duration-500">
            <div className="header flex flex-wrap justify-between items-center text-md text-zinc-900 dark:text-zinc-300 mb-2">
                <div className="title flex items-center">
                    <span className="bg-yellow-600 mr-3 w-1 h-5 rounded-xs" />
                    <span className="font-semibold">Bookmarks</span>
                    <span className="ml-2 text-xs font-normal text-zinc-500">
                        ({bookmarks.length})
                    </span>
                </div>
                <div className="action">
                    <Button variant="ghost" size="sm" onClick={handleViewAllBookmarks} className="hover:bg-yellow-500/10 hover:text-yellow-600">
                        <BookmarkIcon size={16} className="mr-2" />
                        <span className="text-sm font-medium">View All</span>
                    </Button>
                </div>
            </div>
            <div className="contents mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {bookmarks.slice(0, maxItems).map((item) => (
                        <ItemCard key={item.id} item={item} enableBackground={true} />
                    ))}
                </div>
            </div>
        </div>
    );
}
