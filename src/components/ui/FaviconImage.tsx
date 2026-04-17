/**
 * @file FaviconImage.tsx
 * Reusable favicon image with lazy loading and a fallback placeholder.
 * Uses Google's S2 favicon service keyed on the package homepage URL.
 * Falls back to a letter-avatar derived from the package name on error.
 */
import { useState } from "react";

interface FaviconImageProps {
    homepage?: string;
    name: string;
    size?: number;          // px — applied to both img and placeholder
    className?: string;
}

export const FaviconImage: React.FC<FaviconImageProps> = ({
    homepage,
    name,
    size = 32,
    className = "",
}) => {
    const faviconUrl = homepage
        ? `https://www.google.com/s2/favicons?domain=${homepage}&sz=64`
        : null;

    const [errored, setErrored] = useState(!faviconUrl);

    // Letter-avatar fallback — use first char of name, upper-cased
    const letter = name.trim()[0]?.toUpperCase() ?? "?";

    if (errored || !faviconUrl) {
        return (
            <div
                className={`flex items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-zinc-300 font-semibold select-none shrink-0 ${className}`}
                style={{ width: size, height: size, fontSize: size * 0.45 }}
                aria-hidden="true"
            >
                {letter}
            </div>
        );
    }

    return (
        <img
            src={faviconUrl}
            loading="lazy"
            onError={() => setErrored(true)}
            alt=""
            aria-hidden="true"
            className={`rounded-full bg-gray-100 dark:bg-zinc-700 object-contain shrink-0 ${className}`}
            style={{ width: size, height: size }}
        />
    );
};
