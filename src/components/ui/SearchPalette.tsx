/**
 * @file SearchPalette.tsx
 * Global ⌘K / Ctrl+K search across every cask and formula, with arrow-key
 * navigation. On the Explore page the shortcut focuses the page's own search
 * input instead (element id `explore-search`).
 */
import { createContext, useCallback, useContext, useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react';
import { useBrewData } from '../../hooks/useBrewData';
import { AppIcon } from './AppIcon';
import { cn } from '../../lib/utils';
import { isMac } from '../../lib/platform';

interface PaletteCtx {
    open: () => void;
}
const Ctx = createContext<PaletteCtx | null>(null);

export function useSearchPalette() {
    const c = useContext(Ctx);
    if (!c) throw new Error('useSearchPalette must be used inside SearchPaletteProvider');
    return c;
}

export function SearchPaletteProvider({ children }: { children: ReactNode }) {
    const [isOpen, setOpen] = useState(false);
    const { pathname } = useLocation();
    const open = useCallback(() => setOpen(true), []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const mod = isMac ? e.metaKey : e.ctrlKey;
            if (mod && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                const local = document.getElementById('explore-search');
                if (pathname === '/all' && local) local.focus();
                else setOpen(true);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [pathname]);

    return (
        <Ctx.Provider value={{ open }}>
            {children}
            {isOpen && <Palette onClose={() => setOpen(false)} />}
        </Ctx.Provider>
    );
}

function Palette({ onClose }: { onClose: () => void }) {
    const navigate = useNavigate();
    const [q, setQ] = useState('');
    const dq = useDeferredValue(q);
    const [sel, setSel] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);

    const { data: casks = [], isLoading: l1 } = useBrewData('cask');
    const { data: formulae = [], isLoading: l2 } = useBrewData('formula');
    const loading = l1 || l2;

    const results = useMemo(() => {
        const term = dq.trim().toLowerCase();
        if (!term) return [];
        const out = [];
        for (const item of [...casks, ...formulae]) {
            if (item._searchString.includes(term)) {
                out.push(item);
                if (out.length >= 60) break;
            }
        }
        // Exact / prefix matches first.
        return out.sort((a, b) => {
            const rank = (i: typeof a) => (i.token.toLowerCase() === term ? 0 : i.name.toLowerCase().startsWith(term) ? 1 : 2);
            return rank(a) - rank(b);
        });
    }, [dq, casks, formulae]);

    useEffect(() => {
        (listRef.current?.children[sel] as HTMLElement | undefined)?.scrollIntoView({ block: 'nearest' });
    }, [sel]);

    const go = (i: number) => {
        const item = results[i];
        if (item) {
            navigate(`/${item.type}/${item.token}`);
            onClose();
        } else if (q.trim()) {
            navigate(`/all?q=${encodeURIComponent(q.trim())}`);
            onClose();
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, Math.max(results.length - 1, 0))); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
        else if (e.key === 'Enter') { e.preventDefault(); go(sel); }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-start justify-center bg-[rgba(17,17,20,0.45)] p-4 pt-[12vh]" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Search packages"
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[640px] overflow-hidden rounded-[24px] bg-canvas shadow-[0_24px_64px_rgba(17,17,20,0.28)]"
            >
                <div className="flex items-center gap-3 border-b border-line px-5">
                    <Search size={20} className="shrink-0 text-muted" />
                    <input
                        autoFocus
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setSel(0); }}
                        onKeyDown={onKeyDown}
                        placeholder="Search casks and formulae…"
                        aria-label="Search casks and formulae"
                        className="h-14 flex-1 border-0 bg-transparent text-base text-ink outline-none"
                    />
                    {loading && q && <Loader2 size={16} className="animate-spin text-muted" />}
                    <kbd className="rounded-md bg-chip px-2 py-1 font-mono text-xs text-ink-soft">ESC</kbd>
                </div>

                {q && results.length > 0 && (
                    <ul ref={listRef} className="m-0 max-h-[50vh] list-none overflow-y-auto p-2">
                        {results.map((item, i) => (
                            <li key={`${item.type}-${item.id}`}>
                                <button
                                    type="button"
                                    onClick={() => go(i)}
                                    onMouseEnter={() => setSel(i)}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center gap-3 rounded-2xl border-0 px-3 py-2.5 text-left',
                                        i === sel ? 'bg-chip' : 'bg-transparent',
                                    )}
                                >
                                    <AppIcon name={item.name} homepage={item.homepage} size={36} />
                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-center gap-2">
                                            <span className="truncate text-sm font-semibold">{item.name}</span>
                                            <span className={cn(
                                                'rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                                                item.type === 'cask' ? 'bg-chip text-ink-soft' : 'bg-accent-soft text-accent-ink',
                                            )}>{item.type}</span>
                                        </span>
                                        <span className="block truncate text-xs text-muted">{item.desc}</span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {q && !results.length && !loading && (
                    <div className="px-5 py-10 text-center text-sm text-muted">No results for “{q}”</div>
                )}

                <div className="flex items-center justify-between border-t border-line px-5 py-2.5 text-xs text-muted">
                    <span>↑↓ navigate · ↵ open · Enter with no match searches Explore</span>
                    {results.length > 0 && <span>{results.length}{results.length === 60 ? '+' : ''} matches</span>}
                </div>
            </div>
        </div>
    );
}
