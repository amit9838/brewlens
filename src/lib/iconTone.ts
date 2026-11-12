/**
 * @file iconTone.ts
 * Detects favicons that are dark and near-monochrome (e.g. the black GitHub
 * mark) so they can be inverted to stay visible on the dark theme.
 *
 * Google's favicon service sends no CORS headers, so its pixels can't be read
 * from a canvas. We therefore sample a tiny copy of the same image through the
 * wsrv.nl image proxy (CORS-enabled, long-lived cache). Results are cached per
 * URL for the session; any failure counts as "not dark" (icon left unchanged).
 */

const SAMPLE = 24;
const cache = new Map<string, Promise<boolean>>();

const proxied = (url: string) =>
    `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${SAMPLE}&h=${SAMPLE}&output=png`;

function measure(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onerror = () => resolve(false);
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = canvas.height = SAMPLE;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (!ctx) return resolve(false);
                ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
                const { data } = ctx.getImageData(0, 0, SAMPLE, SAMPLE);

                let weight = 0, lum = 0, sat = 0;
                for (let i = 0; i < data.length; i += 4) {
                    const a = data[i + 3] / 255;
                    if (a < 0.2) continue;
                    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
                    const max = Math.max(r, g, b), min = Math.min(r, g, b);
                    lum += (0.2126 * r + 0.7152 * g + 0.0722 * b) * a;
                    sat += (max === 0 ? 0 : (max - min) / max) * a;
                    weight += a;
                }
                if (weight < 20) return resolve(false); // basically empty
                resolve(lum / weight < 0.3 && sat / weight < 0.3);
            } catch {
                resolve(false); // tainted canvas etc.
            }
        };
        img.src = proxied(url);
    });
}

/** Resolves true when the favicon at `url` is dark and near-monochrome. */
export function isDarkMonochrome(url: string): Promise<boolean> {
    let p = cache.get(url);
    if (!p) {
        p = measure(url);
        cache.set(url, p);
    }
    return p;
}
