/**
 * @file SearchIndexModal.tsx
 * A–Z jump index for the Explore list.
 */
import React from 'react';
import { ArrowDownAZ } from 'lucide-react';
import { ModalShell } from './Modal';

const SearchIndexModal: React.FC<{ setNewChar: (c: string) => void }> = ({ setNewChar }) => {
    const chars = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).concat(['#']);
    return (
        <ModalShell title="Jump to letter" subtitle="Go straight to apps starting with…" icon={<ArrowDownAZ size={20} />}>
            <div className="grid grid-cols-7 gap-2 pb-3 sm:grid-cols-9">
                {chars.map((c) => (
                    <button
                        key={c}
                        type="button"
                        onClick={() => setNewChar(c)}
                        className="flex aspect-square cursor-pointer items-center justify-center rounded-2xl border-0 bg-chip text-lg font-bold text-ink-soft transition-colors hover:bg-accent hover:text-[#111114] active:scale-95"
                    >
                        {c}
                    </button>
                ))}
            </div>
        </ModalShell>
    );
};

export default SearchIndexModal;
