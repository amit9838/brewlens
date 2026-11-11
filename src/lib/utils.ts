/**
 * @file utils.ts
 * Core utility functions for API fetching, data normalization,
 * open-source status detection, and Tailwind class merging.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BrewItem, BrewType, BrewPackage, RawBrewData } from "../types";
import { OPEN_SOURCE_CASKS } from "../data/curated";

/**
 * Merges Tailwind CSS class names, resolving conflicts via tailwind-merge.
 *
 * @param inputs - Any number of class values (strings, arrays, objects)
 * @returns A single merged class string
 *
 * @example
 * cn('px-4 py-2', condition && 'bg-green-500', 'px-2') // 'py-2 bg-green-500 px-2'
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Homebrew API endpoints and install command prefixes keyed by BrewType. */
const API_CONFIG = {
    cask: { url: "https://formulae.brew.sh/api/cask.json", installPrefix: "brew install --cask" },
    formula: { url: "https://formulae.brew.sh/api/formula.json", installPrefix: "brew install" }
};

/** API URL of a single cask or formula, e.g. `https://formulae.brew.sh/api/cask/firefox.json`. */
export const itemUrl = (type: BrewType, token: string) =>
    `https://formulae.brew.sh/api/${type}/${token}.json`;

/**
 * Normalizes a raw Homebrew API object into a typed `BrewItem`.
 *
 * Handles structural differences between casks and formulae:
 * - Casks use `full_token` as id; formulae use `name`
 * - Cask names are arrays; formula names are strings
 * - Version field differs between types
 *
 * @param rawData - Raw JSON object from the Homebrew API
 * @param type - Whether this is a 'cask' or 'formula'
 * @param keepRaw - Keep the full API object on `raw` (detail pages). List fetches pass
 *   `false` so the parsed catalogue (tens of MB) can be garbage-collected.
 * @returns A normalized `BrewItem` ready for use in the UI
 */
export const normalizeItem = (rawData: RawBrewData, type: BrewType, keepRaw = true): BrewItem => {
    const isCask = type === 'cask';
    const rawName = Array.isArray(rawData.name) ? rawData.name[0] : rawData.name;
    const id = (isCask ? rawData.full_token : rawName) ?? '';
    const name = rawName || id;

    return {
        id,
        type: type,
        name,
        token: (isCask ? rawData.full_token : rawData.full_name) ?? id,
        desc: rawData.desc || "No description available.",
        version: isCask ? rawData.version ?? '' : rawData.versions?.stable || 'N/A',
        homepage: rawData.homepage,
        deprecated: rawData.deprecated,
        disabled: rawData.disabled,
        installCmd: `${API_CONFIG[type].installPrefix} ${id}`,
        package: getSourceCodeStatus(rawData, type),
        ...(keepRaw && { raw: rawData }),
        _searchString: `${id} ${name} ${rawData.desc || ''}`.toLowerCase()
    };
};

/**
 * Fetches and normalizes Homebrew package data from the API.
 *
 * Handles both list endpoints (returns array) and individual item endpoints
 * (returns a single object, which is wrapped in an array for consistency).
 *
 * @param type - 'cask' or 'formula'
 * @param url - Optional override URL (used for individual item fetches)
 * @returns Promise resolving to an array of normalized `BrewItem` objects
 * @throws Error if the HTTP response is not OK
 */
export const fetchBrewData = async (type: BrewType, url?: string): Promise<BrewItem[]> => {
    const full_url = url || API_CONFIG[type].url;
    // A single package is a few KB and is what the page is waiting for; the full lists are
    // several MB. The hint lets the browser give the small requests the bandwidth first.
    const res = await fetch(full_url, { priority: url ? 'high' : 'low' });
    if (!res.ok) throw new Error(`Failed to fetch ${type} data from ${full_url}`);
    const json: RawBrewData | RawBrewData[] = await res.json();
    // Lists come back as arrays and drop `raw`; a single package keeps it for the detail page.
    if (Array.isArray(json)) return json.map((item) => normalizeItem(item, type, false));
    return [normalizeItem(json, type)];
};


const SOURCE_HOSTS = ['github.com', 'gitlab.com', 'bitbucket.org', 'codeberg.org'];

/**
 * The repository page a URL points into, on a known source host, or `null`.
 * `https://github.com/rxhanson/Rectangle/releases/download/v2/x.dmg` → `https://github.com/rxhanson/Rectangle`.
 * A bare owner page (`github.com/mozilla`) is not a repository.
 */
export function repoUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return null;
    }
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    if (!SOURCE_HOSTS.includes(host)) return null;
    // GitLab allows nested groups and puts its own pages after `/-/`; the other hosts are owner/repo.
    const path = parsed.pathname.split('/-/')[0].split('/').filter(Boolean);
    const parts = host === 'gitlab.com' ? path : path.slice(0, 2);
    if (parts.length < 2) return null;
    parts[parts.length - 1] = parts[parts.length - 1].replace(/\.git$/, '');
    return `https://${host}/${parts.join('/')}`;
}

/**
 * Decides whether a package is open source and where its source lives.
 *
 * - Formulae: open source when the API gives a `license` (homebrew/core only accepts
 *   open-source software, so in practice every formula). The source link is the first
 *   repository found in the `head` URL, the homepage or the `stable` download URL.
 * - Casks: the API has no license, so a cask counts only when its homepage is a
 *   repository page, or when it is in the hand-picked `OPEN_SOURCE_CASKS`. For listed
 *   casks the download URL may also give the source link (GitHub releases). A GitHub
 *   download alone proves nothing: many closed-source apps ship from release-only repos.
 *
 * @param rawData - Raw API response object (not a normalized BrewItem)
 * @param type - 'cask' or 'formula'
 * @returns A `BrewPackage`: `isFoss`, `fossUrl` (repository page or ''), and
 *   `verified` (true when `fossUrl` is set)
 */
export const getSourceCodeStatus = (rawData: RawBrewData, type: BrewType): BrewPackage => {
    let isFoss: boolean;
    let source: string | null;

    if (type === 'formula') {
        isFoss = !!rawData.license;
        source = repoUrl(rawData.urls?.head?.url) ?? repoUrl(rawData.homepage) ?? repoUrl(rawData.urls?.stable?.url);
    } else {
        const listed = OPEN_SOURCE_CASKS.has(rawData.full_token ?? '');
        source = repoUrl(rawData.homepage) ?? (listed ? repoUrl(rawData.url) : null);
        isFoss = listed || !!source;
    }

    return { verified: !!source, isFoss, fossUrl: source ?? '' };
};
