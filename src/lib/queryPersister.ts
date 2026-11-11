/**
 * @file queryPersister.ts
 * Keeps the package lists and analytics in IndexedDB between visits, so a repeat
 * visit renders the catalogue at once and React Query refreshes it in the background.
 * Used by `PersistQueryClientProvider` in `App.tsx`.
 */
import { defaultShouldDehydrateQuery, type Query } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';
import { del, get, set } from 'idb-keyval';

/** Saved data older than this is thrown away instead of shown. */
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days

/**
 * Bump this whenever the shape of a saved query changes (`BrewItem`, `normalizeItem`,
 * `AnalyticsData`), so old data is discarded rather than read with the wrong shape.
 */
const CACHE_VERSION = 'v2'; // v2: new open-source detection (getSourceCodeStatus)

/** Only the full lists (`['brew', type]`, no URL) and analytics are worth saving. */
function shouldPersist(query: Query): boolean {
    if (!defaultShouldDehydrateQuery(query)) return false; // successful queries only
    const [scope, , url] = query.queryKey;
    // `url == null`, not `=== undefined`: a restored key went through JSON, which turns
    // `['brew', 'cask', undefined]` into `['brew', 'cask', null]`.
    return (scope === 'brew' && url == null) || scope === 'analytics';
}

const persister = createAsyncStoragePersister({
    // idb-keyval stores into one IndexedDB object store. If IndexedDB is unavailable
    // (some private modes), reads and writes fail and the app just works without the cache.
    storage: { getItem: get, setItem: set, removeItem: del },
    key: 'brewlens_query_cache',
});

export const persistOptions: Omit<PersistQueryClientOptions, 'queryClient'> = {
    persister,
    maxAge: CACHE_MAX_AGE,
    buster: CACHE_VERSION,
    dehydrateOptions: { shouldDehydrateQuery: shouldPersist },
};
