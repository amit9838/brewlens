/**
 * @file BrewfileModal.tsx
 * Standardized Brewfile generation modal.
 */
import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { buildBrewfile } from '../../lib/brewfile';
import { Button } from './Button';
import { ModalHeader, ModalBody, ModalFooter } from './Modal';
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
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <ModalHeader 
                title="Generated Brewfile" 
                subtitle={`Ready to use with "brew bundle"`}
                icon={<FileText size={20} />}
            />
            
            <ModalBody>
                <div className="relative group">
                    <pre className="font-mono text-[13px] bg-zinc-950 text-emerald-400 rounded-2xl p-6 overflow-auto max-h-[40vh] whitespace-pre-wrap leading-relaxed border border-zinc-800 shadow-inner">
                        {content || '# No items selected'}
                    </pre>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-3 px-1">
                    Save this content as a file named <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-zinc-700 dark:text-zinc-300">Brewfile</code> then run <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-zinc-700 dark:text-zinc-300">brew bundle</code> in that directory to install everything at once.
                </p>
            </ModalBody>

            <ModalFooter>
                <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto min-w-[160px]"
                    onClick={handleCopy}
                    disabled={items.length === 0}
                >
                    {copied ? (
                        <>
                            <Check size={16} className="mr-2" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy size={16} className="mr-2" />
                            Copy to Clipboard
                        </>
                    )}
                </Button>
            </ModalFooter>
        </>
    );
}
