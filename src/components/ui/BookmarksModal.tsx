/**
 * @file BookmarksModal.tsx
 * Management UI for bookmark collections.
 * Allows creating, renaming, and deleting collections.
 */
import { useState, useRef, useEffect } from 'react';
import { Trash2, Pencil, Check, X, BookmarkIcon } from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarksContext';
import { useModal } from '../contexts/ModalContexts';
import { Button } from './Button';
import BrewfileModal from './BrewfileModal';
import type { Collection } from '../contexts/BookmarksContext';
import type { BrewItem, BrewType } from '../../types';

export default function BookmarksModal() {
    const { collections, addCollection, removeCollection, renameCollection } = useBookmarks();
    const { openModal } = useModal();

    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const editInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [editingId]);

    const handleAdd = () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        addCollection(trimmed);
        setNewName('');
    };

    const handleAddKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAdd();
    };

    const startEdit = (collection: Collection) => {
        setEditingId(collection.id);
        setEditingName(collection.name);
    };

    const commitEdit = () => {
        if (editingId && editingName.trim()) {
            renameCollection(editingId, editingName.trim());
        }
        setEditingId(null);
        setEditingName('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleEditKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') commitEdit();
        if (e.key === 'Escape') cancelEdit();
    };

    const handleGenerateBrewfile = () => {
        // Collect all bookmarked item IDs across all collections.
        // TODO: store BrewType alongside itemId in Collection to avoid defaulting to 'cask'.
        const allItems: BrewItem[] = collections
            .flatMap(c => c.itemIds)
            .filter((id, idx, arr) => arr.indexOf(id) === idx) // deduplicate
            .map(id => ({ id, token: id, type: 'cask' as BrewType, name: id, desc: '', version: '', installCmd: '', package: { verified: false, isFoss: false, fossUrl: null }, raw: {}, _searchString: '' }));

        openModal(() => <BrewfileModal items={allItems} />, { size: 'md' });
    };

    return (
        <div className="p-5 w-full max-w-md min-w-[20rem]">
            <div className="flex items-center gap-2 mb-1">
                <BookmarkIcon className="h-5 w-5 text-green-600 dark:text-green-500" />
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Collections</h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                Manage your bookmark collections
            </p>

            {/* Collection list */}
            <ul className="space-y-1 mb-4">
                {collections.map((col) => (
                    <li
                        key={col.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800/60 group"
                    >
                        {editingId === col.id ? (
                            <>
                                <input
                                    ref={editInputRef}
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onKeyDown={handleEditKeyDown}
                                    className="flex-1 text-sm bg-transparent border-b border-zinc-400 dark:border-zinc-500 outline-none text-zinc-900 dark:text-zinc-100"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={commitEdit}
                                    aria-label="Confirm rename"
                                    className="h-7 w-7 text-green-600 dark:text-green-500"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={cancelEdit}
                                    aria-label="Cancel rename"
                                    className="h-7 w-7"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => startEdit(col)}
                                    className="flex-1 text-left text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-green-600 dark:hover:text-green-400 transition-colors truncate"
                                    title="Click to rename"
                                >
                                    {col.name}
                                </button>
                                <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
                                    {col.itemIds.length} {col.itemIds.length === 1 ? 'item' : 'items'}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => startEdit(col)}
                                    aria-label={`Rename ${col.name}`}
                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeCollection(col.id)}
                                    aria-label={`Delete ${col.name}`}
                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 dark:text-red-400"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </>
                        )}
                    </li>
                ))}
                {collections.length === 0 && (
                    <li className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-4">
                        No collections yet
                    </li>
                )}
            </ul>

            {/* Add new collection */}
            <div className="flex gap-2 mb-5">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleAddKeyDown}
                    placeholder="New collection name…"
                    maxLength={50}
                    className="flex-1 h-9 px-3 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAdd}
                    disabled={!newName.trim()}
                >
                    Add
                </Button>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                <Button
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={handleGenerateBrewfile}
                    title="Full Brewfile generation coming in a future update"
                >
                    View Bookmarks
                </Button>
            </div>
        </div>
    );
}
