// contexts/SearchContext.tsx
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { BrewType } from '../../types';

interface SearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isSearchFocused: boolean;
    setSearchFocused: (focused: boolean) => void;
    brewType: BrewType;
    setBrewType: (type: BrewType) => void;
    openQuickSearch: () => void;
    registerQuickSearchHandler: (handler: () => void) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read from URL
    const searchQuery = searchParams.get('q') || '';
    const brewTypeFromUrl = searchParams.get('type') as BrewType | 'cask';
    const [brewType, setBrewTypeState] = useState<BrewType>(brewTypeFromUrl === 'formula' ? 'formula' : 'cask');

    const [isSearchFocused, setSearchFocused] = useState(false);
    const [quickSearchHandler, setQuickSearchHandler] = useState<(() => void) | null>(null);

    // Keep URL in sync with brewType
    const setBrewType = useCallback((type: BrewType = 'cask') => {
        setBrewTypeState(type);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('type', type);
        setSearchParams(newParams, { replace: true });
    }, [searchParams, setSearchParams]);

    // Keep URL in sync with searchQuery (preserve other params)
    const setSearchQuery = useCallback((query: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (query) {
            newParams.set('q', query);
        } else {
            newParams.delete('q');
        }
        setSearchParams(newParams, { replace: true });
    }, [searchParams, setSearchParams]);

    // Sync internal brewType when URL changes (e.g., browser back/forward)
    React.useEffect(() => {
        const typeFromUrl = searchParams.get('type') as BrewType | null;
        if (typeFromUrl === 'formula' || typeFromUrl === 'cask') {
            setBrewTypeState(typeFromUrl);
        }
    }, [searchParams]);

    const openQuickSearch = useCallback(() => {
        quickSearchHandler?.();
    }, [quickSearchHandler]);

    const registerQuickSearchHandler = useCallback((handler: () => void) => {
        setQuickSearchHandler(() => handler);
    }, []);

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            isSearchFocused,
            setSearchFocused,
            brewType,
            setBrewType,
            openQuickSearch,
            registerQuickSearchHandler,
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) throw new Error('useSearch must be used within SearchProvider');
    return context;
};