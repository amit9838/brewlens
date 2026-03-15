import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type BrewItem, type BrewType, type BrewPackage } from "../types";

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
export const normalizeItem = (rawData: any, type: BrewType): BrewItem => {
    const isCask = type === 'cask';
    const id = isCask ? rawData.full_token : rawData.name;
    const name = isCask && Array.isArray(rawData.name) ? rawData.name[0] : rawData.name;

    return {
        id,
        type: type,
        name: name || id,
        token: isCask ? rawData.full_token : rawData.full_name,
        desc: rawData.desc || "No description available.",
        version: isCask ? rawData.version : rawData.versions?.stable || 'N/A',
        homepage: rawData.homepage,
        deprecated: rawData.deprecated,
        disabled: rawData.disabled,
        installCmd: `${API_CONFIG[type].installPrefix} ${id}`,
        package: getSourceCodeStatus(rawData, type),
        raw: rawData,
        _searchString: `${id} ${name} ${rawData.desc || ''}`.toLowerCase()
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


export const getSourceCodeStatus = (rawData: any, type: BrewType): BrewPackage => {
    const isCask = type === 'cask';
    const urlSpecsValues = Object.values(rawData.url_specs ?? {}) as string[];
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
