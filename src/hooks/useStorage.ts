/**
 * @file useStorage.ts
 * Generic hook for reading and writing to localStorage or sessionStorage
 * with automatic JSON serialization and default-value cleanup.
 */

import { useState } from "react";

type StorageType = "local" | "session";

/**
 * Returns the appropriate Web Storage object.
 * @param type - 'local' for localStorage, 'session' for sessionStorage
 */
function getStorage(type: StorageType): Storage {
    return type === "session" ? sessionStorage : localStorage;
}

/**
 * A `useState`-compatible hook backed by Web Storage.
 *
 * - Reads the initial value from storage on mount (JSON-parsed)
 * - Writes to storage on every update
 * - Removes the key when the value equals `defaultValue` or is empty,
 *   keeping storage clean
 * - Handles JSON parse errors gracefully by falling back to `defaultValue`
 *
 * @param key - Storage key
 * @param defaultValue - Value to use when nothing is stored
 * @param type - 'session' (default) or 'local'
 * @returns `[value, setValue]` tuple matching the useState API
 *
 * @example
 * const [filters, setFilters] = useStorage<string[]>('brewlist_filters', []);
 * const [showFonts, setShowFonts] = useStorage<boolean>('brewlist_showFonts', false);
 */
export function useStorage<T>(
    key: string,
    defaultValue: T,
    type: StorageType = "session"
): [T, (value: T | ((prev: T) => T)) => void] {
    const storage = getStorage(type);

    const [state, setState] = useState<T>(() => {
        try {
            const saved = storage.getItem(key);
            return saved !== null ? JSON.parse(saved) : defaultValue;
        } catch {
            return defaultValue;
        }
    });

    const setValue = (value: T | ((prev: T) => T)) => {
        setState(prev => {
            const next = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
            try {
                if (next === null || next === undefined ||
                    (Array.isArray(next) && (next as unknown[]).length === 0) ||
                    next === defaultValue) {
                    storage.removeItem(key);
                } else {
                    storage.setItem(key, JSON.stringify(next));
                }
            } catch { /* ignore */ }
            return next;
        });
    };

    return [state, setValue];
}
