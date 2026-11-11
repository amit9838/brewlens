/**
 * @file utils.ts
 * Core utility functions for API fetching, data normalization,
 * open-source status detection, and Tailwind class merging.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BrewItem, BrewType, BrewPackage, RawBrewData } from "../types";

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
    const res = await fetch(full_url);
    if (!res.ok) throw new Error(`Failed to fetch ${type} data from ${full_url}`);
    const json: RawBrewData | RawBrewData[] = await res.json();
    // Lists come back as arrays and drop `raw`; a single package keeps it for the detail page.
    if (Array.isArray(json)) return json.map((item) => normalizeItem(item, type, false));
    return [normalizeItem(json, type)];
};


/**
 * Determines the open-source status of a Homebrew package by scanning
 * its URL fields for known OSS hosting domains.
 *
 * Checks: github.com, gitlab.com, bitbucket.org, codeberg.org
 *
 * For casks: inspects `url_specs` values and `homepage`
 * For formulae: additionally inspects `urls.head.url`
 *
 * @param rawData - Raw API response object (not a normalized BrewItem)
 * @param type - 'cask' or 'formula'
 * @returns A `BrewPackage` with `isFoss`, `verified`, and `fossUrl`
 */
export const getSourceCodeStatus = (rawData: RawBrewData, type: BrewType): BrewPackage => {
    const isCask = type === 'cask';
    const urlSpecsValues = Object.values(rawData.url_specs ?? {});
    const websiteUrl = rawData.homepage || "";

    let allTextToSearch = [...urlSpecsValues, websiteUrl].join(" ").toLowerCase();

    if (!isCask) {
        allTextToSearch += " " + (rawData.urls?.head?.url || "");
    }

    const osDomains = ["github.com", "gitlab.com", "bitbucket.org", "codeberg.org"];
    const isFoss = osDomains.some(domain => allTextToSearch.includes(domain));

    if (!isCask) {
        return {
            verified: !!rawData.urls?.head?.url,
            isFoss,
            fossUrl: rawData.urls?.head?.url || "",
        };
    }

    if (urlSpecsValues.length === 0) {
        return { verified: false, isFoss, fossUrl: "" };
    }

    return {
        verified: true,
        isFoss,
        fossUrl: `http://${urlSpecsValues[0]}`,
    };
};
