/**
 * @file ImportBookmarksModal.tsx
 * Bulk import bookmarks by pasting app tokens/names.
 */
import { useState } from 'react';
import { Download, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useBrewData } from '../../hooks/useBrewData';
import { useBookmarks } from '../contexts/BookmarksContext';
import { ModalHeader, ModalBody, ModalFooter } from './Modal';
import { Button } from './Button';
import { useModal } from '../contexts/ModalContexts';
import BookmarksModal from './BookmarksModal';

export default function ImportBookmarksModal() {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'resolving' | 'success'>('idle');
    const [results, setResults] = useState<{ matched: number; total: number }>({ matched: 0, total: 0 });

    // Fetch both to ensure we can resolve anything pasted
    const { data: casks = [] } = useBrewData('cask');
    const { data: formulae = [] } = useBrewData('formula');

    const { bookmarks, toggleBookmark } = useBookmarks();
    const { openModal } = useModal();

    const handleImport = () => {
        setStatus('resolving');

        // 1. Split into lines
        const lines = input.split('\n');
        const extractedTokens: string[] = [];

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;

            // 2. Try to match Brewfile format: cask "token" or brew "token"
            const brewfileMatch = trimmed.match(/^(?:cask|brew)\s+["'](.+?)["']/i);
            if (brewfileMatch) {
                extractedTokens.push(brewfileMatch[1].toLowerCase());
            } else {
                // 3. Fallback: Split by space/comma and strip quotes from all parts
                const parts = trimmed.split(/[\s,]+/).map(p => p.replace(/['"]/g, '').toLowerCase());
                parts.forEach(p => {
                    if (p && p !== 'cask' && p !== 'brew' && p !== 'install') {
                        extractedTokens.push(p);
                    }
                });
            }
        });

        // Unique tokens
        const tokens = Array.from(new Set(extractedTokens));

        if (tokens.length === 0) {
            setStatus('idle');
            return;
        }

        const allItems = [...casks, ...formulae];
        let matchedCount = 0;
        const existingIds = new Set(bookmarks.map(b => b.id));

        tokens.forEach(token => {
            const item = allItems.find(i =>
                i.token.toLowerCase() === token ||
                i.name.toLowerCase() === token
            );

            if (item && !existingIds.has(item.id)) {
                toggleBookmark(item);
                matchedCount++;
                existingIds.add(item.id);
            }
        });

        setResults({ matched: matchedCount, total: tokens.length });
        setStatus('success');
    };

    return (
        <>
            <ModalHeader
                title="Import Bookmarks"
                subtitle="Paste app names or tokens (one per line or space-separated)"
                icon={<Download size={20} />}
            />

            <ModalBody className="bg-inherit">
                {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-95">
                        <div className="h-16 w-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Import Complete</h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
                            Successfully added <span className="font-bold text-green-600 dark:text-green-400">{results.matched}</span> new items
                            from <span className="font-bold">{results.total}</span> identified tokens.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative group">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Example:&#10;visual-studio-code&#10;spotify&#10;iterm2&#10;git"
                                className="w-full h-48 p-4 font-mono text-gray-900 dark:text-white text-sm bg-gray-50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-inner"
                            />
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-green-50/50 dark:bg-green-900/10 border border-green-100/50 dark:border-green-900/20 rounded-xl">
                            <AlertCircle size={16} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                                You can paste raw content from a <code className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1 rounded">Brewfile</code> or a simple list of app IDs. We will automatically resolve them to current Homebrew packages.
                            </p>
                        </div>
                    </div>
                )}
            </ModalBody>

            <ModalFooter>
                {status === 'success' ? (
                    <div className="flex w-full gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => setStatus('idle')}>
                            Import More
                        </Button>
                        <Button variant="primary" className="flex-1" onClick={() => openModal(() => <BookmarksModal />, { size: 'lg' })}>
                            View Library
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={handleImport}
                        disabled={!input.trim() || status === 'resolving'}
                    >
                        {status === 'resolving' ? (
                            <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Resolving Items...
                            </>
                        ) : (
                            'Resolve & Import'
                        )}
                    </Button>
                )}
            </ModalFooter>
        </>
    );
}
