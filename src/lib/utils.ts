import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type BrewItem, type BrewType } from "../types";

// Tailwind Class Merger
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// API Configuration
const API_CONFIG = {
    cask: { url: "https://formulae.brew.sh/api/cask.json", installPrefix: "brew install --cask" },
    formula: { url: "https://formulae.brew.sh/api/formula.json", installPrefix: "brew install" }
};

// Data Normalizer
export const normalizeItem = (item: any, type: BrewType): BrewItem => {
    const isCask = type === 'cask';
    const id = isCask ? item.full_token : item.name;
    const name = isCask && Array.isArray(item.name) ? item.name[0] : item.name;

    return {
        id,
        type: type,
        name: name || id,
        token: isCask ? item.full_token : item.full_name,
        desc: item.desc || "No description available.",
        version: isCask ? item.version : item.versions?.stable || 'N/A',
        homepage: item.homepage,
        deprecated: item.deprecated,
        disabled: item.disabled,
        installCmd: `${API_CONFIG[type].installPrefix} ${id}`,
        raw: item,
        _searchString: `${id} ${name} ${item.desc || ''}`.toLowerCase()
    };
};

export const fetchBrewData = async (type: BrewType, url?: string): Promise<BrewItem[]> => {
    const full_url = url || API_CONFIG[type].url;
    const res = await fetch(full_url);
    if (!res.ok) throw new Error(`Failed to fetch ${type} data from ${full_url}`);
    const json = await res.json();
    // Handle both single objects (individual formula) and arrays (list)
    const data = Array.isArray(json) ? json : [json];
    return data.map((item: any) => normalizeItem(item, type));
};


export const getSourceCodeStatus = (item: BrewItem) => {
    // 1. Collect all potential URLs to check for Open Source domains
    const urlSpecsValues = Object.values(item.raw.url_specs ?? {});
    const websiteUrl = item.homepage || "";

    // Combine them into a single searchable string
    let allTextToSearch = [...urlSpecsValues, websiteUrl].join(" ").toLowerCase();

    if (item.type === "formula") {
        let source_url = item.raw.urls?.head?.url || "";
        allTextToSearch += " " + source_url;
    }
    // 2. Define our Open Source indicators
    const osDomains = ["github.com", "gitlab.com", "bitbucket.org", "codeberg.org"];
    const isOSS = osDomains.some(domain => allTextToSearch.includes(domain));

    if (item.type === "formula") {
        return {
            verified: item.raw.urls?.head?.url ? true : false,
            isOSS,
            url: item.raw.urls?.head?.url || null,
        };
    }

    // 3. Handle the "No Source" case
    if (urlSpecsValues.length === 0) {
        return {
            verified: false,
            isOSS,
            url: null,
        };
    }

    // 4. Return the full status object
    return {
        verified: true,
        isOSS,
        url: `http://${urlSpecsValues[0]}` || null // Returns the first repository link found
    };
};
