import React from 'react';
import { Search } from "lucide-react";

interface SearchIndexModalProps {
    setNewChar: (search: string) => void;
}

const SearchIndexModal: React.FC<SearchIndexModalProps> = ({ setNewChar }) => {
    const characters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).concat(['#']);

    return (
        <div className="relative  max-w-2xl md:min-w-[30rem]  min-w-[20rem] p-2 md:p-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-red">
                <div className="flex items-center gap-2 text-green-600">
                    {/* Search Icon */}
                    <Search size={24} />
                    <h2 className="text-2xl font-bold tracking-tight">Search Index</h2>
                </div>
            </div>

            {/* A-Z Grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-3">
                {characters.map((char) => {
                    return (
                        <button
                            key={char}
                            onClick={() => setNewChar(char)}
                            className="h-14 flex items-center justify-center rounded-xl text-xl font-bold transition-all duration-200 bg-white border border-slate-200/40 text-slate-500 dark:bg-zinc-800 dark:border-gray-700/30 dark:text-slate-300  hover:bg-green-500 hover:shadow-md  hover:text-white cursor-pointer"
                        >
                            {char}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchIndexModal;