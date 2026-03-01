import React, { useState, useMemo, useEffect } from "react";
import { useBrewData } from "../../hooks/useBrewData";
import { useDeferredValue } from "react";
import { usePagination } from "../../hooks/usePagination";
import { ItemCard } from "../ItemCard";
import { cn } from '../../lib/utils';
import { type BrewType } from "../../types";
import SkeletonGrid from "./SkeletonGrid";
import ErrorState from "./Error";
import { Search, X} from "lucide-react";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { useModal } from '../contexts/ModalContexts';
import SearchIndexModal from "../ui/SearchIndexModal";


interface Props {
    type: BrewType;
    setType: (type: BrewType) => void;
    search: string;
    setSearch: (search: string) => void;
}

export const BrewList: React.FC<Props> = ({ type, setType, search, setSearch }) => {
    const [itemsPerPage, setItemsPerPage] = useState(24);
    const [newChar, setNewChar] = useState<string>('#');
    const { openModal, closeModal } = useModal();

    // Queries & Derived State
    const { data = [], isLoading, error } = useBrewData(type);
    const deferredSearch = useDeferredValue(search);

    const filtered = useMemo(() => {
        if (!deferredSearch) return data;
        return data.filter(i => i._searchString.includes(deferredSearch.toLowerCase()));
    }, [data, deferredSearch]);

    const pagination = usePagination(filtered, itemsPerPage, "currentPage");
    const { currentData, setCurrentPage, totalPages } = pagination


    useEffect(() => {
        if (newChar === '#') {
            setCurrentPage(1);
            return
        }

        const index = data.findIndex(i => i.name.toLowerCase().startsWith(newChar.toLowerCase()));
        if (index === -1) return;

        const page = Math.ceil((index + 1) / itemsPerPage);
        setCurrentPage(page);
        setTimeout(() => {
            closeModal();
        }, 100);

    }, [newChar, itemsPerPage]);


    const handleOpenIndexSearch = () => {
        openModal(<SearchIndexModal setNewChar={setNewChar} />, { size: 'lg', closeOnBackdropClick: true });
    };


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

            <div className="right px-1">
                <Button
                    onClick={handleOpenIndexSearch}
                    variant="secondary"
                    size="sm"
                    className="w-14">
                    <span className="text-sm font-semibold opacity-90 hover:opacity-100">
                        A-Z
                    </span>
                </Button>
            </div>
        </div>

        {/* GRID */}
        {isLoading && <SkeletonGrid count={itemsPerPage} />}
        {error && <ErrorState error={error} />}
        {currentData && <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentData.map(item => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && <Pagination pagination={pagination} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />}

        </>}
        {currentData.length === 0 && !isLoading && !error && <>
            <div className="h-120 flex flex-col items-center justify-center p-20 text-gray-500">
                <Search className="mb-4 h-12 w-12 opacity-40 text-zinc-800 dark:text-zinc-100" />
                <p className="text-lg">No data found. Try something else?</p>
            </div>
        </>}



    </div>

};
