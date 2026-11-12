/**
 * @file format.ts
 * Small presentation helpers shared across pages.
 */

/** Parses Homebrew's "1,234" analytics strings (or plain numbers). */
export function toNumber(value: string | number | undefined | null): number {
    if (value === undefined || value === null) return NaN;
    if (typeof value === 'number') return value;
    return Number(value.replace(/,/g, ''));
}

/** 1234 → "1.2k", 1_200_000 → "1.2M". Returns "—" for missing values. */
export function formatCount(value: string | number | undefined | null): string {
    const n = toNumber(value);
    if (!Number.isFinite(n)) return '—';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return String(n);
}

/** Tile colours for the letter fallback when a package has no favicon. */
const TILE_COLORS = [
    '#1D8FB8', '#C8643F', '#6D4BD8', '#4A5160', '#E0861A', '#2E7D4F',
    '#0F6CBD', '#3B5BDB', '#D9963A', '#B4462B', '#7A4FBF', '#3C873A',
    '#C6302B', '#24292F', '#0E7490', '#9D174D',
];

/** Deterministic colour for a token so the same app always gets the same tile. */
export function tileColor(seed: string): string {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
    return TILE_COLORS[Math.abs(h) % TILE_COLORS.length];
}

/** One or two letters for an icon tile: "Azure CLI" → "A", "jq" → "jq". */
export function tileLetters(name: string): string {
    const clean = name.trim();
    if (clean.length <= 2) return clean;
    return clean[0].toUpperCase();
}

/** Writes text to the clipboard, falling back to a hidden textarea. */
export async function copyText(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            ta.remove();
            return ok;
        } catch {
            return false;
        }
    }
}

/** Install command for a token, used where we only have analytics rows. */
export function installCommand(type: 'cask' | 'formula', token: string): string {
    return type === 'cask' ? `brew install --cask ${token}` : `brew install ${token}`;
}
