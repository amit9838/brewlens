/**
 * @file useTheme.ts
 * Light/dark theme stored in localStorage ("theme"), falling back to the OS
 * preference. Toggles the `dark` class on <html>. The sidebar owns the toggle
 * and is always mounted, so the saved theme is applied on every page load.
 */
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') return saved;
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    return { theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) };
}
