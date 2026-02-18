import React, { useState, useMemo } from "react";
import { useBrewData } from "../../hooks/useBrewData";
import { useDeferredValue } from "react";
import { usePagination } from "../../hooks/usePagination";
import { ItemCard } from "../ItemCard";
import { Button } from "../ui/Button";
import { cn } from '../../lib/utils';
import { type BrewType } from "../../types";
import SkeletonGrid from "./SkeletonGrid";

interface Props {
    type: BrewType;
    setType: (type: BrewType) => void;
    search: string;
    setSearch: (search: string) => void;
}

export const BrewList: React.FC<Props> = ({ type, setType, search, setSearch }) => {
    const [itemsPerPage, setItemsPerPage] = useState(24);

    // Queries & Derived State
    const { data = [], isLoading, error } = useBrewData(type);
    const deferredSearch = useDeferredValue(search);

    const filtered = useMemo(() => {
        if (!deferredSearch) return data;
        return data.filter(i => i._searchString.includes(deferredSearch.toLowerCase()));
    }, [data, deferredSearch]);

    const { currentData, currentPage, setCurrentPage, totalPages } = usePagination(filtered, itemsPerPage);

    {/* CONTROLS */ }
    return <>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="bg-gray-200 dark:bg-zinc-800 p-1 rounded-lg flex">
                {(['cask', 'formula'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => { setType(t); setSearch(''); }}
                        className={cn("px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                            type === t ? "bg-white dark:bg-zinc-600 shadow text-green-600 dark:text-green-400" : "text-gray-500"
                        )}
                    >
                        {t}s
                    </button>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500">Items per page:</span>
                    <select
                        className="bg-transparent font-medium cursor-pointer outline-none"
                        value={itemsPerPage}
                        onChange={e => setItemsPerPage(Number(e.target.value))}
                    >
                        {[12, 24, 48].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            )}
        </div>

        {/* GRID */}
        {
            isLoading ? (
                <SkeletonGrid count={itemsPerPage} />
            ) : error ? (
                <div className="py-20 text-center text-red-500">Failed to load data.</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentData.map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-4 pt-8">
                            <Button variant="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</Button>
                            <span className="py-2 text-sm font-mono text-zinc-500">Page {currentPage} of {totalPages}</span>
                            <Button variant="secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
                        </div>
                    )}

                </>
            )
        }
    </>

};
