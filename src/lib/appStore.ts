/**
 * @file appStore.ts
 * Mac App Store screenshots from Apple's public iTunes Lookup API. All bundle ID
 * candidates go in one request; only apps sold on the Mac App Store are found.
 */
import type { AppMedia } from './screenshots';

const LOOKUP_URL = 'https://itunes.apple.com/lookup';

interface LookupResult {
    /** `mac-software` for Mac apps; iPhone/iPad apps sharing the bundle ID come back as `software` */
    kind: string;
    bundleId: string;
    trackViewUrl: string;
    screenshotUrls?: string[];
}

/** Returns the first candidate that is a Mac App Store app with screenshots, or `null`. */
export async function fetchAppStoreMedia(bundleIds: string[]): Promise<AppMedia | null> {
    if (bundleIds.length === 0) return null;
    const url = `${LOOKUP_URL}?entity=macSoftware&bundleId=${bundleIds.map(encodeURIComponent).join(',')}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`App Store lookup failed (${res.status})`);
    const { results = [] }: { results?: LookupResult[] } = await res.json();

    // The lookup also returns iPhone/iPad listings that share a bundle ID; keep Mac apps only.
    const byId = new Map(results.filter((r) => r.kind === 'mac-software').map((r) => [r.bundleId, r]));
    const hit = bundleIds.map((id) => byId.get(id)).find((r) => r?.screenshotUrls?.length);
    if (!hit?.screenshotUrls) return null;
    return { source: 'Mac App Store', url: hit.trackViewUrl, screenshots: hit.screenshotUrls };
}
