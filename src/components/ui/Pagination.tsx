import React, { useState } from 'react';
import { Button } from './Button';


interface PaginationProps {
    pagination: any;
    itemsPerPage: number;
    setItemsPerPage: (itemsPerPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ pagination, itemsPerPage, setItemsPerPage }) => {
    const [jumpPage, setJumpPage] = useState("");

    const { currentPage, setCurrentPage, totalPages } = pagination
    if (totalPages <= 1) return null;

    // Logic to show current, -2, and +2 pages
    const pageNumbers = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        pageNumbers.push(i);
    }

    const handleJump = (e: React.FormEvent) => {
        e.preventDefault();
        const page = parseInt(jumpPage);
        if (!isNaN(page) && page > 0) {
            setCurrentPage(Math.min(page, totalPages));
            setJumpPage("");
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 pt-8">
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <Button
                    variant="secondary"
                    size='sm'
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Prev
                </Button>

                {/* Dynamic Page Numbers */}
                <div className="flex gap-1">
                    {pageNumbers.map((page) => (
                        <Button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            variant={currentPage === page ? "white" : "ghost"}
                            size="sm"
                        >
                            {page}
                        </Button>
                    ))}
                </div>

                {/* Next Button */}
                <Button
                    variant="secondary"
                    size='sm'
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </Button>
            </div>

            {/* Custom Page Jump & Info */}
            <div className="flex items-center gap-4 text-sm font-mono text-zinc-500 dark:text-zinc-400">
                <span>Page {currentPage} of {totalPages}</span>

                <form onSubmit={handleJump} className="flex items-center gap-2 border-l border-r px-4 border-zinc-200 dark:border-zinc-700">
                    <label htmlFor="jump" className="text-xs uppercase tracking-wider">Go to:</label>
                    <input
                        id="jump"
                        type="number"
                        placeholder='#'
                        value={jumpPage}
                        onChange={(e) => setJumpPage(e.target.value)}
                        className="w-16 rounded border border-zinc-200 bg-transparent px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700"
                    />
                </form>
                <div className="flex items-center gap-3 text-sm min-w-40">
                    <span className="text-zinc-500 dark:text-zinc-400">Items per page:</span>
                    <select
                        className="bg-transparent text-zinc-700 dark:text-zinc-200 font-medium cursor-pointer outline-none "
                        value={itemsPerPage}
                        onChange={e => setItemsPerPage(Number(e.target.value))}
                    >
                        {[12, 24, 48].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};