/**
 * @file BrewfileModal.tsx
 * Displays generated Brewfile content for a list of BrewItems.
 * Provides a copy-to-clipboard button with transient feedback.
 */
import { useState } from 'react';
import { FileText } from 'lucide-react';
import { buildBrewfile } from '../../lib/brewfile';
import { Button } from './Button';
import type { BrewItem } from '../../types';

interface BrewfileModalProps {
    items: BrewItem[];
}

export default function BrewfileModal({ items }: BrewfileModalProps) {
    const [copied, setCopied] = useState(false);
    const content = buildBrewfile(items);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="p-5 w-full max-w-lg min-w-[20rem]">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-500" />
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Bookmarks</h2>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
            </div>
            {/* <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                Copy and save as <code className="font-mono">Bookmarks</code> to restore with <code className="font-mono">brew bundle</code>
            </p> */}

            <pre className="font-mono text-sm bg-zinc-950 text-green-400 rounded-md p-4 overflow-auto max-h-72 mb-4 whitespace-pre">
                {content || '# No items bookmarked'}
            </pre>

            <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleCopy}
                disabled={items.length === 0}
            >
                {copied ? 'Copied ✓' : 'Copy to Clipboard'}
            </Button>
        </div>
    );
}
