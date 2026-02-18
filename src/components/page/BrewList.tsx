import React, { useState, useMemo } from "react";
import { useBrewData } from "../../hooks/useBrewData";
import { useDeferredValue } from "react";
import { usePagination } from "../../hooks/usePagination";
import { ItemCard } from "../ItemCard";
import { Button } from "../ui/Button";
import { cn } from '../../lib/utils';
import { type BrewType } from "../../types";
import SkeletonGrid from "./SkeletonGrid";
import { Search, X } from "lucide-react";

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

    const { currentData, currentPage, setCurrentPage, totalPages } = usePagination(filtered, itemsPerPage, "currentPage");

    const changeType = (type: BrewType) => {
        setType(type);
        setCurrentPage(1);
    }

    {/* CONTROLS */ }
    return <div className="contasiner max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="w-full flex flex-wrap justify-left gap-2">
                <div className="relative w-full max-w-[20rem]">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        className="w-full minz-w-80 pl-10  pr-10 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder={`Search...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && <X className="absolute right-3 top-3 text-gray-400 bg-zinc-300/10 hover:bg-zinc-300 p-[2px] rounded-full cursor-pointer" size={18} onClick={() => setSearch("")} />}
                </div>
                <div className="bg-gray-200 dark:bg-zinc-800 p-1 rounded-lg flex">
                    {(['cask', 'formula'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => { changeType(t); setSearch(''); }}
                            className={cn("px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all",
                                type === t ? "bg-white dark:bg-zinc-600 shadow text-green-600 dark:text-green-400" : "text-gray-500"
                            )}
                        >
                            {t}s
                        </button>
                    ))}
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center gap-3 text-sm min-w-40">
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
        {isLoading && <SkeletonGrid count={itemsPerPage} />}
        {error && <div className="py-20 text-center text-red-500">Failed to load data.</div>}
        {currentData && <>
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

        </>}
        {currentData.length === 0 && <>
            <div className="h-120 flex flex-col items-center justify-center p-20 text-gray-500">
                <Search className="mb-4 h-12 w-12 opacity-40 text-zinc-800 dark:text-zinc-100" />
                <p className="text-lg">No data found. Try something else?</p>
            </div>
        </>}

    </div>

};
