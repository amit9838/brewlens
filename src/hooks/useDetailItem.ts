/**
 * @file useDetailItem.ts
 * Shared logic for the cask and formula detail pages: reads the token from
 * the route, fetches the single package and records it as recently viewed.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { BrewItem, BrewType } from '../types';
import { useBrewData } from './useBrewData';
import { itemUrl } from '../lib/utils';
import { useRecentlyViewed } from '../components/contexts/RecentlyViewedContext';

/** Resolves the route, fetches the single package and records the view. */
export function useDetailItem(expected: BrewType) {
    const { pathname } = useLocation();
    const parts = pathname.split('/').filter(Boolean);
    const token = decodeURIComponent(parts[parts.length - 1] ?? '');
    const apiUrl = itemUrl(expected, token);
    const { data = [], isLoading, error } = useBrewData(expected, apiUrl);
    const item: BrewItem | undefined = data[0];
    const { trackView } = useRecentlyViewed();

    useEffect(() => {
        if (item) trackView(item);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item?.id]);

    return { token, apiUrl, item, isLoading, error };
}
