/**
 * @file useAnalytics.ts
 * Official Homebrew install analytics for casks and formulae.
 */
import { useQuery } from '@tanstack/react-query';
import type { BrewType } from '../types';

export type Period = '30d' | '90d' | '365d';

export const PERIOD_LABELS: Record<Period, string> = {
    '30d': '30 Days',
    '90d': '90 Days',
    '365d': '365 Days',
};

export interface AnalyticsRow {
    number: number;
    /** Token of the cask or formula */
    token: string;
    type: BrewType;
    count: string;
    percent: string;
}

export interface AnalyticsData {
    total_count: number;
    start_date: string;
    end_date: string;
    items: AnalyticsRow[];
}

const URLS: Record<BrewType, (p: Period) => string> = {
    cask: (p) => `https://formulae.brew.sh/api/analytics/cask-install/${p}.json`,
    formula: (p) => `https://formulae.brew.sh/api/analytics/install/${p}.json`,
};

async function fetchAnalytics(type: BrewType, period: Period): Promise<AnalyticsData> {
    const res = await fetch(URLS[type](period));
    if (!res.ok) throw new Error(`Failed to load ${type} analytics`);
    const json = await res.json();
    const raw: { number: number; cask?: string; formula?: string; count: string | number; percent: string | number }[] =
        Array.isArray(json.items) ? json.items : [];
    return {
        total_count: json.total_count,
        start_date: json.start_date,
        end_date: json.end_date,
        items: raw.map((i) => ({
            number: i.number,
            token: i.cask ?? i.formula ?? '',
            type,
            count: String(i.count),
            percent: String(i.percent),
        })),
    };
}

export function useAnalytics(type: BrewType, period: Period = '30d', enabled = true) {
    return useQuery({
        queryKey: ['analytics', type, period],
        queryFn: () => fetchAnalytics(type, period),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        enabled,
    });
}

/** Star count for the BrewLens repository, shown in the header. */
export function useGitHubStars() {
    return useQuery({
        queryKey: ['github-stars'],
        queryFn: async () => {
            const res = await fetch('https://api.github.com/repos/amit9838/brewlens');
            if (!res.ok) throw new Error('GitHub API unavailable');
            const json = await res.json();
            return Number(json.stargazers_count) || 0;
        },
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        retry: false,
    });
}
