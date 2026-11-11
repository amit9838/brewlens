/**
 * @file flathub.ts
 * Screenshots from Flathub, for cross-platform apps that also ship for Linux.
 *
 * Flathub's search is POST-only and blocked by CORS, so we download its list of
 * app IDs once (~90 KB, GET) and match locally, most reliable first:
 *   1. a cask bundle ID, ignoring case (`com.spotify.client` → `com.spotify.Client`)
 *   2. the ID's last part equals the cask name or token (`com.slack.Slack`)
 *   3. the only ID under the homepage's reversed domain (`obsproject.com` → `com.obsproject.Studio`)
 * Matches from 2 and 3 are accepted only if the app's Flathub homepage has the
 * same domain as the cask's homepage.
 */
import type { AppMedia } from './screenshots';

const API = 'https://flathub.org/api/v2';

/** Fetch at most this many app details per cask. */
const MAX_CANDIDATES = 3;

/** Screenshot width to pick from the sizes Flathub offers (sharp at the gallery height). */
const TARGET_WIDTH = 1248;

interface Candidate {
    id: string;
    /** Must the Flathub homepage match the cask's? */
    verify: boolean;
}

interface Appstream {
    urls?: { homepage?: string | null };
    screenshots?: { sizes?: { src: string; width: string }[] }[];
}

let appIds: Promise<string[]> | null = null;

/**
 * Every Flathub app ID, fetched once per session (and again after a failure).
 * Exported so callers can start the download early, in parallel with other lookups.
 */
export function flathubAppIds(): Promise<string[]> {
    appIds ??= fetch(`${API}/appstream`)
        .then((res) => {
            if (!res.ok) throw new Error(`Flathub app list failed (${res.status})`);
            return res.json() as Promise<string[]>;
        })
        .catch((e) => {
            appIds = null;
            throw e;
        });
    return appIds;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** `https://www.slack.com/downloads` → `slack.com` (last two labels; good enough here). */
function siteDomain(url: string | null | undefined): string {
    try {
        return new URL(url ?? '').hostname.toLowerCase().split('.').slice(-2).join('.');
    } catch {
        return '';
    }
}

function candidates(ids: string[], bundleIds: string[], names: string[], domain: string): Candidate[] {
    const byLower = new Map(ids.map((id) => [id.toLowerCase(), id]));
    const found: Candidate[] = [];
    const add = (id: string | undefined, verify: boolean) => {
        if (id && !found.some((c) => c.id === id)) found.push({ id, verify });
    };

    for (const b of bundleIds) add(byLower.get(b.toLowerCase()), false);

    if (domain) {
        const wanted = new Set(names.map(norm));
        for (const id of ids) if (wanted.has(norm(id.split('.').pop() ?? ''))) add(id, true);

        const prefix = domain.split('.').reverse().join('.').toLowerCase() + '.';
        const underDomain = ids.filter((id) => id.toLowerCase().startsWith(prefix));
        if (underDomain.length === 1) add(underDomain[0], true);
    }
    return found.slice(0, MAX_CANDIDATES);
}

/** The size closest to `TARGET_WIDTH` for each screenshot. */
function pickSizes(app: Appstream): string[] {
    return (app.screenshots ?? []).flatMap((s) => {
        const sizes = s.sizes ?? [];
        if (sizes.length === 0) return [];
        const best = sizes.reduce((a, b) =>
            Math.abs(Number(b.width) - TARGET_WIDTH) < Math.abs(Number(a.width) - TARGET_WIDTH) ? b : a);
        return [best.src];
    });
}

export async function fetchFlathubMedia({ bundleIds, name, token, homepage }: {
    bundleIds: string[];
    name: string;
    token: string;
    homepage?: string;
}): Promise<AppMedia | null> {
    const domain = siteDomain(homepage);
    const list = candidates(await flathubAppIds(), bundleIds, [name, token], domain);

    for (const { id, verify } of list) {
        const res = await fetch(`${API}/appstream/${encodeURIComponent(id)}`);
        if (!res.ok) continue;
        const app: Appstream = await res.json();
        if (verify && siteDomain(app.urls?.homepage) !== domain) continue;
        const screenshots = pickSizes(app);
        if (screenshots.length) return { source: 'Flathub', url: `https://flathub.org/apps/${id}`, screenshots };
    }
    return null;
}
