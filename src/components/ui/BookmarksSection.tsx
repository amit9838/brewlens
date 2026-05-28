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
        <div className="section bg-gradient-to-br from-amber-400/5 via-yellow-500/3 to-transparent dark:from-amber-600/5 dark:via-yellow-700/2 dark:to-transparent border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-4 transition-all duration-300 hover:border-amber-500/20 hover:shadow-lg">
            <div className="header flex flex-wrap justify-between items-center text-md text-zinc-900 dark:text-zinc-300 mb-2">
                <div className="title flex items-center font-bold text-zinc-900 dark:text-zinc-200 text-lg">
                    <span className="flex items-center justify-center bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 p-2 rounded-xl mr-3 shadow-sm">
                        <BookmarkIcon size={16} />
                    </span>
                    <span>Bookmarks</span>
                    <span className="ml-2 text-xs font-normal text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full">
                        {bookmarks.length} saved
                    </span>
                </div>
                <div className="action">
                    <Button variant="ghost" size="sm" onClick={handleViewAllBookmarks} className="hover:bg-yellow-500/10 hover:text-yellow-600 cursor-pointer">
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
