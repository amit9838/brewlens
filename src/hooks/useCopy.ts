/**
 * @file useCopy.ts
 * Copy-to-clipboard with a short-lived "copied" key, so a list of buttons
 * can show "Copied" on just the one that was pressed.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText } from '../lib/format';

export function useCopy(resetMs = 1600) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    const copy = useCallback(async (text: string, key: string = text) => {
        const ok = await copyText(text);
        if (!ok) return;
        setCopiedKey(key);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopiedKey(null), resetMs);
    }, [resetMs]);

    const isCopied = useCallback((key: string) => copiedKey === key, [copiedKey]);

    return { copy, isCopied, copiedKey };
}
