/**
 * @file useBrewItems.ts
 * A handful of packages by token, without waiting for the full catalogue.
 * Used by Discover for the featured carousel and Editor's Picks.
 */
import { useMemo } from 'react';
import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import { useBrewData } from './useBrewData';
import { fetchBrewData, itemUrl } from '../lib/utils';
import type { BrewItem, BrewType } from '../types';

/** Found items in token order (unknown tokens dropped), once every request has settled. */
function combine(results: UseQueryResult<BrewItem[]>[]) {
    return {
        items: results.flatMap((r) => r.data ?? []),
        isLoading: results.some((r) => r.isPending),
    };
}

/**
 * Returns the packages for `tokens`, in order.
 *
 * If the full list is already cached (a repeat visit), items come straight from it.
 * Otherwise each package is fetched on its own, all in parallel: a few KB each instead of
 * a multi-MB list, so the page can render long before the catalogue arrives. These requests
 * share their cache key with the detail page, so opening one of these packages is instant.
 */
export function useBrewItems(type: BrewType, tokens: string[]) {
    const { data: list } = useBrewData(type);

    const single = useQueries({
        queries: tokens.map((token) => {
            const url = itemUrl(type, token);
            return {
                queryKey: ['brew', type, url],
                queryFn: () => fetchBrewData(type, url),
                enabled: !list, // the full list already has them
                retry: false, // an unknown token is a 404; just leave it out
            };
        }),
        combine,
    });

    const fromList = useMemo(() => {
        if (!list) return null;
        const byToken = new Map(list.map((i) => [i.token, i]));
        return tokens.map((t) => byToken.get(t)).filter((i): i is BrewItem => !!i);
    }, [list, tokens]);

    if (fromList) return { items: fromList, isLoading: false };
    return single;
}
