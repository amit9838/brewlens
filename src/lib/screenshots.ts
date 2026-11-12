/**
 * @file screenshots.ts
 * Optional screenshots for a cask. Sources, in order:
 *   1. Mac App Store (iTunes Lookup API), matched by bundle ID — see `appStore.ts`
 *   2. Flathub (Linux builds of cross-platform apps) — see `flathub.ts`
 * Casks don't carry a bundle ID field, but their uninstall / zap stanzas name it
 * (`quit: "com.spotify.client"`, `~/Library/Preferences/com.spotify.client.plist`),
 * so candidates are pulled from there. Returns `null` when no source has the app.
 */
import type { BrewItem, RawBrewData } from '../types';
import { fetchAppStoreMedia } from './appStore';
import { fetchFlathubMedia, flathubAppIds } from './flathub';

export interface AppMedia {
    /** Where the screenshots come from */
    source: 'Mac App Store' | 'Flathub';
    /** The app's page on that source */
    url: string;
    /** Screenshot image URLs, in the source's order */
    screenshots: string[];
}

/** At most this many bundle ID candidates per cask (one iTunes request). */
const MAX_IDS = 10;

/** Reverse-DNS identifiers such as `com.spotify.client` (at least three parts). */
const BUNDLE_ID = /\b[A-Za-z]{2,4}\.[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g;

/** File-name suffixes that follow a bundle ID in zap paths. */
const SUFFIX = /\.(plist|binarycookies|savedState|ShipIt|helper.*)$/;

/** Number of `.app` bundles a cask installs. */
function appCount(artifacts: unknown[]): number {
    return artifacts.reduce<number>((n, a) => {
        const apps = a && typeof a === 'object' ? (a as { app?: unknown }).app : undefined;
        return n + (Array.isArray(apps) ? apps.filter((x) => typeof x === 'string').length : 0);
    }, 0);
}

/** True for casks that install exactly one app: suites (e.g. Microsoft Office) are skipped. */
export function hasSingleApp(raw: RawBrewData): boolean {
    return appCount(raw.artifacts ?? []) === 1;
}

/** Candidate bundle IDs for a cask, most likely first (uninstall stanzas come before zap paths). */
export function caskBundleIds(raw: RawBrewData): string[] {
    const ids: string[] = [];
    for (const match of JSON.stringify(raw.artifacts ?? []).matchAll(BUNDLE_ID)) {
        const id = match[0].replace(SUFFIX, '').replace(/\.$/, '');
        if (id.startsWith('com.apple.') || ids.includes(id)) continue;
        ids.push(id);
        if (ids.length === MAX_IDS) break;
    }
    return ids;
}

/**
 * Tries each source in turn. A source that fails (network, rate limit) is skipped; if
 * nothing is found and a source failed, this throws so the miss isn't cached as "none".
 */
export async function fetchScreenshots(item: BrewItem): Promise<AppMedia | null> {
    const raw = item.raw ?? {};
    const bundleIds = caskBundleIds(raw);
    // Start Flathub's ID list now so the fallback doesn't wait for the App Store lookup.
    // Its failure surfaces (and is handled) inside `fetchFlathubMedia`.
    flathubAppIds().catch(() => {});
    const sources = [
        () => fetchAppStoreMedia(bundleIds),
        () => fetchFlathubMedia({ bundleIds, name: item.name, token: item.token, homepage: item.homepage }),
    ];

    let failed: unknown = null;
    for (const source of sources) {
        try {
            const media = await source();
            if (media) return media;
        } catch (e) {
            failed = e;
        }
    }
    if (failed) throw failed;
    return null;
}
