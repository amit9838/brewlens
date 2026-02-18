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

export const fetchBrewData = async (type: BrewType): Promise<BrewItem[]> => {
    const res = await fetch(API_CONFIG[type].url);
    if (!res.ok) throw new Error(`Failed to fetch ${type}s`);
    const json = await res.json();
    return json.map((item: any) => normalizeItem(item, type));
};