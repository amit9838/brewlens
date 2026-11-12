/**
 * @file Pagination.tsx
 * Round-button pagination with first/last pages, a ±1 window, a "go to page"
 * field and an items-per-page selector.
 */
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaginationProps {
    pagination: { currentPage: number; setCurrentPage: (p: number) => void; totalPages: number };
    itemsPerPage: number;
    setItemsPerPage: (n: number) => void;
}

function pageList(current: number, total: number): (number | '…')[] {
    const set = new Set([1, total, current - 1, current, current + 1]);
    const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const out: (number | '…')[] = [];
    nums.forEach((n, i) => {
        if (i > 0 && n - nums[i - 1] > 1) out.push('…');
        out.push(n);
    });
    return out;
}

const circle = 'flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-sm font-bold';

export const Pagination: React.FC<PaginationProps> = ({ pagination, itemsPerPage, setItemsPerPage }) => {
    const { currentPage, setCurrentPage, totalPages } = pagination;
    const [jump, setJump] = useState('');
    if (totalPages <= 1) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const p = parseInt(jump, 10);
        if (!Number.isNaN(p) && p > 0) { setCurrentPage(Math.min(p, totalPages)); setJump(''); }
    };

    return (
        <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-1.5">
                <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}
                    className={cn(circle, 'w-11 border border-line-strong bg-raised text-ink disabled:cursor-not-allowed disabled:opacity-40')}>
                    <ChevronLeft size={20} strokeWidth={2.2} />
                </button>
                {pageList(currentPage, totalPages).map((p, i) => p === '…' ? (
                    <span key={`e${i}`} className="px-1 text-muted" aria-hidden="true">…</span>
                ) : (
                    <button key={p} type="button" aria-current={p === currentPage ? 'page' : undefined} onClick={() => setCurrentPage(p)}
                        className={cn(circle, 'border-0', p === currentPage ? 'bg-invert text-on-invert' : 'bg-transparent text-ink hover:bg-chip')}>
                        {p}
                    </button>
                ))}
                <button type="button" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}
                    className={cn(circle, 'w-11 border border-line-strong bg-raised text-ink disabled:cursor-not-allowed disabled:opacity-40')}>
                    <ChevronRight size={20} strokeWidth={2.2} />
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted">
                <form onSubmit={submit} className="flex items-center gap-2.5">
                    <label htmlFor="jump-page">Go to</label>
                    <input id="jump-page" type="number" min={1} max={totalPages} placeholder="#" value={jump} onChange={(e) => setJump(e.target.value)}
                        className="h-11 w-20 rounded-xl border border-line-strong bg-raised px-2 text-center text-ink outline-none focus:border-accent" />
                </form>
                <label className="flex items-center gap-2.5">Per page
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="h-11 cursor-pointer rounded-xl border border-line-strong bg-raised px-3 text-sm text-ink">
                        {[24, 48, 96, 192].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                </label>
            </div>
        </nav>
    );
};
