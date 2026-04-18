/**
 * @file BookmarksModal.tsx
 * Standardized Bookmarks Modal.
 */
import { BookmarkIcon, Trash2, FileCode, Download } from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarksContext';
import { useModal } from '../contexts/ModalContexts';
import { ItemListRow } from '../page/ItemListRow';
import { Button } from './Button';
import { ModalHeader, ModalBody, ModalFooter } from './Modal';
import BrewfileModal from './BrewfileModal';
import ImportBookmarksModal from './ImportBookmarksModal';

export default function BookmarksModal() {
    const { bookmarks, clearBookmarks, toggleBookmark } = useBookmarks();
    const { openModal } = useModal();

    const handleGenerateBrewfile = () => {
        openModal(() => <BrewfileModal items={bookmarks} />, { size: 'lg' });
    };

    const handleImport = () => {
        openModal(() => <ImportBookmarksModal />, { size: 'lg' });
    };

    return (
        <>
            <ModalHeader
                title="Bookmarks"
                subtitle={`${bookmarks.length} ${bookmarks.length === 1 ? 'item' : 'items'} saved in your library`}
                icon={<BookmarkIcon className="fill-current text-yellow-500" size={20} />}
            >
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleImport}
                        title="Import bulk bookmarks"
                        className="text-zinc-600 dark:text-zinc-400"
                    >
                        <Download size={14} className="mr-2" />
                        Import
                    </Button>
                </div>
            </ModalHeader>

            <ModalBody className="max-h-[60vh] overflow-y-auto p-0 bg-gray-50/30 dark:bg-zinc-950/20">
                {bookmarks.length > 0 ? (
                    <div className="flex flex-col p-4 gap-2">
                        {bookmarks.map((item) => (
                            <div key={item.id} className="relative group">
                                <ItemListRow item={item} />
                                
                                {/* Overlay Remove Button (Centered Vertically) */}
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white/90 dark:bg-zinc-800/90 text-zinc-400 hover:text-red-500 rounded-full shadow-lg border border-gray-100 dark:border-zinc-700 transition-all z-10 backdrop-blur-sm opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 hover:scale-110"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleBookmark(item);
                                    }}
                                    title="Remove bookmark"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 py-20 px-10 text-center">
                        <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                            <BookmarkIcon className="h-10 w-10 opacity-20" />
                        </div>
                        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">No bookmarks yet</p>
                        <p className="text-sm mt-2 max-w-[240px] leading-relaxed mb-6">
                            Items you bookmark will appear here for quick access and offline reference.
                        </p>
                        <Button variant="secondary" size="md" onClick={handleImport}>
                            <Download size={16} className="mr-2" />
                            Import your library
                        </Button>
                    </div>
                )}
            </ModalBody>

            {bookmarks.length > 0 && (
                <ModalFooter className="flex-col sm:flex-row gap-3">
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={clearBookmarks}
                        className="w-full sm:w-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <Trash2 size={16} className="mr-2" />
                        Clear All
                    </Button>
                    <div className="flex-1" />
                    <Button
                        variant="primary"
                        size="md"
                        className="w-full sm:w-auto"
                        onClick={handleGenerateBrewfile}
                    >
                        <FileCode size={16} className="mr-2" />
                        Generate Brewfile
                    </Button>
                </ModalFooter>
            )}
        </>
    );
}
