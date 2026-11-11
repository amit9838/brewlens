/**
 * @file useScreenshots.ts
 * Lazily fetches optional screenshots for one cask (Mac App Store, then Flathub).
 * Only casks that install a single app are looked up; the request never retries
 * and resolves to `null` when no source has the app.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchScreenshots, hasSingleApp } from '../lib/screenshots';
import type { BrewItem } from '../types';

/**
 * @param item - The package; formulae and `undefined` never fetch
 * @returns `AppMedia`, or `null` while loading, on failure, or when not found
 */
export function useScreenshots(item: BrewItem | undefined) {
    const eligible = !!item && item.type === 'cask' && hasSingleApp(item.raw ?? {});

    const { data } = useQuery({
        queryKey: ['screenshots', item?.token],
        queryFn: () => fetchScreenshots(item!),
        enabled: eligible,
        staleTime: 1000 * 60 * 60 * 24, // listings change rarely
        retry: false,
    });
    return data ?? null;
}
