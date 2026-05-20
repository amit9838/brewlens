/**
 * @file SearchIndexModal.tsx
 * Standardized A-Z alphabetical index modal.
 */
import React from 'react';
import { Search } from "lucide-react";
import { ModalHeader, ModalBody } from './Modal';

interface SearchIndexModalProps {
    setNewChar: (search: string) => void;
}

const SearchIndexModal: React.FC<SearchIndexModalProps> = ({ setNewChar }) => {
    const characters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).concat(['#']);

    return (
        <>
            <ModalHeader 
                title="Search Index" 
                subtitle="Jump to apps starting with a specific letter"
                icon={<Search size={20} />}
            />
            
            <ModalBody>
                <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
                    {characters.map((char) => (
                        <button
                            key={char}
                            onClick={() => setNewChar(char)}
                            className="aspect-square flex items-center justify-center rounded-2xl text-lg font-bold transition-all duration-200 bg-gray-50 dark:bg-zinc-800 border border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-white cursor-pointer active:scale-95"
                        >
                            {char}
                        </button>
                    ))}
                </div>
            </ModalBody>
        </>
    );
};

export default SearchIndexModal;