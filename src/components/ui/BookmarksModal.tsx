/**
 * @file BookmarksModal.tsx
 * One dialog with three tabs: Saved, Import and Brewfile.
 * Import accepts raw Brewfile lines or plain tokens/names and resolves them
 * against the full cask + formula catalogue.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Check, Trash2 } from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarksContext';
import { useModal } from '../contexts/ModalContexts';
import { useBrewData } from '../../hooks/useBrewData';
import { useCopy } from '../../hooks/useCopy';
import { buildBrewfile } from '../../lib/brewfile';
import { AppIcon } from './AppIcon';
import { ModalShell } from './Modal';
import { Chip, EmptyState, PillButton, PillLink, Segmented } from './kit';

type View = 'saved' | 'import' | 'brewfile';

function parseTokens(input: string): string[] {
    const out: string[] = [];
    for (const line of input.split('\n')) {
        const t = line.trim();
        if (!t || t.startsWith('#')) continue;
        const m = t.match(/^(?:cask|brew)\s+["'](.+?)["']/i);
        if (m) {
            out.push(m[1].toLowerCase());
            continue;
        }
        for (const p of t.split(/[\s,]+/)) {
            const clean = p.replace(/['"]/g, '').toLowerCase();
            if (clean && !['cask', 'brew', 'install'].includes(clean)) out.push(clean);
        }
    }
    return Array.from(new Set(out));
}

export default function BookmarksModal() {
    const { bookmarks, toggleBookmark, clearBookmarks } = useBookmarks();
    const { closeModal } = useModal();
    const { copy, isCopied } = useCopy();
    const [view, setView] = useState<View>('saved');
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');

    const { data: casks = [] } = useBrewData('cask');
    const { data: formulae = [] } = useBrewData('formula');

    const tokens = useMemo(() => parseTokens(text), [text]);
    const brewfile = bookmarks.length ? buildBrewfile(bookmarks) : '# Your shelf is empty — add bookmarks first';
    const n = bookmarks.length;

    const doImport = () => {
        if (!tokens.length) return;
        const all = [...casks, ...formulae];
        const have = new Set(bookmarks.map((b) => b.id));
        let added = 0;
        for (const t of tokens) {
            const item = all.find((i) => i.token.toLowerCase() === t || i.name.toLowerCase() === t);
            if (item && !have.has(item.id)) {
                toggleBookmark(item);
                have.add(item.id);
                added++;
            }
        }
        setText('');
        setMessage(`Import complete — ${added} ${added === 1 ? 'app' : 'apps'} added from ${tokens.length} identified.`);
    };

    const downloadBrewfile = () => {
        const url = URL.createObjectURL(new Blob([brewfile + '\n'], { type: 'text/plain' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Brewfile';
        a.click();
        URL.revokeObjectURL(url);
    };

    const footer = view === 'saved' ? (
        <>
            {n > 0 && <PillButton variant="danger" className="h-11 px-3.5 text-sm font-semibold" onClick={clearBookmarks}>Clear all</PillButton>}
            <PillLink to="/all" variant="outline" className="ml-auto text-sm" onClick={closeModal}>View all</PillLink>
            {n > 0 && <PillButton variant="dark" className="text-sm" onClick={() => setView('brewfile')}>Generate Brewfile</PillButton>}
        </>
    ) : view === 'import' ? (
        <>
            <PillButton variant="outline" className="text-sm" onClick={() => setView('saved')}>Cancel</PillButton>
            <PillButton variant="dark" className="ml-auto text-sm" disabled={!tokens.length} onClick={doImport}>
                {tokens.length ? `Import ${tokens.length} ${tokens.length === 1 ? 'app' : 'apps'}` : 'Import'}
            </PillButton>
        </>
    ) : (
        <>
            <PillButton variant="outline" className="text-sm" disabled={!n} onClick={() => copy(brewfile, 'brewfile')}>
                {isCopied('brewfile') ? 'Copied' : 'Copy'}
            </PillButton>
            <PillButton variant="dark" className="ml-auto text-sm" disabled={!n} onClick={downloadBrewfile}>Download Brewfile</PillButton>
        </>
    );

    return (
        <ModalShell
            title="Bookmarks"
            subtitle={`${n} saved ${n === 1 ? 'app' : 'apps'}`}
            icon={<Bookmark size={20} fill="currentColor" />}
            footer={footer}
            id="bm-title"
        >
            <Segmented
                label="Bookmarks view"
                value={view}
                onChange={(v) => { setView(v); setMessage(''); }}
                options={[{ value: 'saved', label: 'Saved' }, { value: 'import', label: 'Import' }, { value: 'brewfile', label: 'Brewfile' }]}
                className="[&>button]:flex-1"
            />

            <div className="pt-4">
                {view === 'saved' && (n > 0 ? (
                    <ul className="m-0 flex list-none flex-col p-0">
                        {bookmarks.map((b) => (
                            <li key={b.id} className="flex items-center gap-3.5 border-b border-line py-3">
                                <AppIcon name={b.name} homepage={b.homepage} size={48} />
                                <div className="min-w-0 flex-1">
                                    <Link to={`/${b.type}/${b.token}`} onClick={closeModal} className="block truncate text-[15px] font-bold text-ink hover:underline">{b.name}</Link>
                                    <div className="mt-0.5 flex items-center gap-1.5">
                                        <code className="truncate font-mono text-[12.5px] text-muted">{b.token}</code>
                                        <span className="rounded-full bg-chip px-[7px] py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-soft">{b.type}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    aria-label={`Remove ${b.name} from bookmarks`}
                                    onClick={() => toggleBookmark(b)}
                                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted hover:bg-chip"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyState
                        icon={<Bookmark size={24} />}
                        title="No bookmarks yet"
                        text="Tap the bookmark on any app to save it here, or import a list you already have."
                        action={<PillButton variant="dark" className="text-sm" onClick={() => setView('import')}>Import a list</PillButton>}
                    />
                ))}

                {view === 'import' && (
                    <div className="flex flex-col gap-3">
                        <label htmlFor="bm-import" className="text-[15px] font-semibold">Paste app names, tokens or a Brewfile</label>
                        <textarea
                            id="bm-import"
                            rows={7}
                            value={text}
                            onChange={(e) => { setText(e.target.value); setMessage(''); }}
                            placeholder={'Example:\nvisual-studio-code\nspotify\niterm2\ngit'}
                            className="w-full resize-y rounded-2xl border border-line-strong bg-surface px-4 py-3.5 font-mono text-sm leading-relaxed text-ink outline-none focus:border-accent"
                        />
                        <div className="text-[13px] text-muted">One per line or separated by spaces. Unknown names are skipped.</div>
                        {message && (
                            <div role="status" className="flex items-center gap-2.5 rounded-2xl bg-accent-soft px-3.5 py-3 text-sm font-semibold text-accent-ink">
                                <Check size={18} strokeWidth={2.6} />{message}
                            </div>
                        )}
                    </div>
                )}

                {view === 'brewfile' && (
                    <div className="flex flex-col gap-3">
                        <div className="text-sm text-ink-soft">
                            Install everything on your shelf in one go with <Chip mono tone="neutral" className="h-6 text-xs">brew bundle</Chip>
                        </div>
                        <pre className="m-0 whitespace-pre-wrap rounded-2xl bg-term px-[18px] py-4 font-mono text-[13.5px] leading-[1.7] text-zinc-200">{brewfile}</pre>
                    </div>
                )}
            </div>
        </ModalShell>
    );
}
