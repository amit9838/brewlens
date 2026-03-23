/**
 * @file useBrewData.ts
 * React Query hook for fetching and caching Homebrew package data.
 * Wraps `fetchBrewData` with a 10-minute stale time and no window-focus refetch.
 */

import { useQuery } from "@tanstack/react-query";
import { fetchBrewData } from "../lib/utils";
import type { BrewType } from "../types";

/**
 * Fetches Homebrew cask or formula data with React Query caching.
 *
 * The cache key includes both `type` and `url` so list fetches and
 * individual item fetches are cached independently.
 *
 * @param type - 'cask' or 'formula'
 * @param url - Optional specific API URL (for detail page fetches)
 * @returns React Query result with `data: BrewItem[]`, `isLoading`, `error`
 *
 * @example
 * // List all casks
 * const { data, isLoading } = useBrewData('cask');
 *
 * // Fetch a single formula
 * const { data } = useBrewData('formula', 'https://formulae.brew.sh/api/formula/git.json');
 */
export function useBrewData(type: BrewType, url?: string) {
    return useQuery({
        // Include 'url' in the key so the cache is unique per URL
        queryKey: ['brew', type, url],
        queryFn: () => fetchBrewData(type, url),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });
}