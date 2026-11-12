/**
 * @file AppIcon.tsx
 * Rounded app tile. Shows the package favicon when one loads, otherwise a
 * coloured letter tile (colour is derived from the token so it is stable).
 */
import { memo, useEffect, useState } from 'react';
import { tileColor, tileLetters } from '../../lib/format';
import { isDarkMonochrome } from '../../lib/iconTone';
import { useIsDark } from '../../hooks/useIsDark';

const loaded = new Map<string, boolean>();

interface AppIconProps {
    name: string;
    homepage?: string;
    size?: number;
    className?: string;
    shadow?: boolean;
    /** Let the favicon sit directly on the surrounding card (no tile fill, ring or shadow). */
    blend?: boolean;
}

export const AppIcon = memo(({ name, homepage, size = 56, className = '', shadow = false, blend = false }: AppIconProps) => {
    const url = homepage
        ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(homepage)}&sz=128`
        : null;
    const [failed, setFailed] = useState(!url);
    const isDark = useIsDark();
    // Dark theme only: flag dark, near-monochrome logos (e.g. black GitHub mark) so we can lighten them.
    const [darkMark, setDarkMark] = useState(false);
    useEffect(() => {
        if (!isDark || !url) return;
        let live = true;
        isDarkMonochrome(url).then((v) => live && setDarkMark(v));
        return () => { live = false; };
    }, [isDark, url]);
    const base: React.CSSProperties = {
        width: size,
        height: size,
        borderRadius: '0.5rem',
        boxShadow: shadow && !blend ? '0 12px 32px rgba(17,17,20,0.18)' : undefined,
    };

    if (failed || !url) {
        return (
            <div
                aria-hidden="true"
                className={`flex shrink-0 select-none items-center justify-center font-extrabold text-white ${className}`}
                style={{ ...base, background: tileColor(name), fontSize: size * 0.42 }}
            >
                {tileLetters(name)}
            </div>
        );
    }

    return (
        <div
            aria-hidden="true"
            className={`flex shrink-0 items-center justify-center overflow-hidden ${blend ? '' : 'bg-raised ring-1 ring-line-strong'} ${className}`}
            style={base}
        >
            <img
                src={url}
                alt=""
                loading="lazy"
                decoding="async"
                onLoad={() => loaded.set(url, true)}
                onError={() => setFailed(true)}
                className="object-contain"
                style={{
                    width: size * 0.8,
                    height: size * 0.8,
                    borderRadius: '0.3rem',
                    filter: isDark && darkMark ? 'invert(1)' : undefined,
                }}
            />
        </div>
    );
});
