/**
 * @file useIsDark.ts
 * Reactive "is the dark theme active" flag, driven by the `dark` class on <html>.
 */
import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => {
    const mo = new MutationObserver(cb);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
};
const snapshot = () => document.documentElement.classList.contains('dark');

export const useIsDark = () => useSyncExternalStore(subscribe, snapshot, () => false);
