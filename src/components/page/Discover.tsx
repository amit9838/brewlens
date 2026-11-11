/**
 * @file Discover.tsx
 * Home page: featured hero carousel, editor's picks, "My Shelf" (bookmarks +
 * recently viewed), top charts and category browser.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Bot, ChevronLeft, ChevronRight, Code, Cpu, Database, Film, GitBranch, Globe, Network, Palette,
    Rocket, Sparkles, Terminal, Trash2, Zap, type LucideIcon,
} from 'lucide-react';
import { useBrewData } from '../../hooks/useBrewData';
import { useBrewItems } from '../../hooks/useBrewItems';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useBookmarks } from '../contexts/BookmarksContext';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { useModal } from '../contexts/ModalContexts';
import BookmarksModal from '../ui/BookmarksModal';
import { AppIcon } from '../ui/AppIcon';
import { AppCard, CompactRow, CompactRowSkeleton, InstallsChip, StretchLink } from '../ui/AppCards';
import { Chip, EmptyState, PillButton, Segmented, SectionHead } from '../ui/kit';
import { EDITORS_PICKS_TOKENS, FEATURED_CASKS } from '../../data/curated';
import { CASK_CATEGORIES, getCategoryForToken } from '../../data/categories';
import { formatCount, tileColor, toNumber } from '../../lib/format';
import type { BrewItem } from '../../types';

const CATEGORIES: { id: string; label: string; desc: string; icon: LucideIcon; ink: string; type: 'cask' | 'formula' }[] = [
    { id: 'dev-tools', label: 'Dev Tools', desc: 'Terminals, IDEs & editors', icon: Terminal, ink: '#1D4ED8', type: 'cask' },
    { id: 'ai-tools', label: 'AI & LLM', desc: 'LLM runners & assistants', icon: Bot, ink: '#5B21B6', type: 'cask' },
    { id: 'design', label: 'Design & Creative', desc: 'Photo, vector, 3D & media', icon: Palette, ink: '#9D174D', type: 'cask' },
    { id: 'media', label: 'Media & Games', desc: 'Players, streaming & gaming', icon: Film, ink: '#B91C1C', type: 'cask' },
    { id: 'browsers', label: 'Internet', desc: 'Browsers, chat, VPN & security', icon: Globe, ink: '#0E7490', type: 'cask' },
    { id: 'productivity', label: 'Productivity', desc: 'Notes, office & system tools', icon: Zap, ink: '#166534', type: 'cask' },
    { id: 'languages', label: 'Languages & Build', desc: 'Compilers, runtimes & build', icon: Code, ink: '#0F766E', type: 'formula' },
    { id: 'databases', label: 'Databases', desc: 'SQL, NoSQL & caching', icon: Database, ink: '#92400E', type: 'formula' },
    { id: 'devops', label: 'DevOps & Infra', desc: 'Containers, K8s & cloud CLIs', icon: Rocket, ink: '#065F46', type: 'formula' },
    { id: 'cli-tools', label: 'CLI Tools', desc: 'Shell enhancers & text tools', icon: Cpu, ink: '#2E2E33', type: 'formula' },
    { id: 'networking', label: 'Networking', desc: 'DNS, proxies & diagnostics', icon: Network, ink: '#1E40AF', type: 'formula' },
    { id: 'git', label: 'Git & VCS', desc: 'Version control & collaboration', icon: GitBranch, ink: '#166534', type: 'formula' },
];

/** Tinted tile that reads well in both themes from a single ink colour. */
const tint = (ink: string) =>
    ({ '--c': ink } as React.CSSProperties);
const tintClass = 'bg-[color-mix(in_srgb,var(--c)_14%,transparent)] text-[var(--c)] dark:text-[color-mix(in_srgb,var(--c)_55%,white)]';

/** Still installable: not deprecated or disabled by Homebrew. */
const isAvailable = (item: BrewItem) => !item.deprecated && !item.disabled;

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ items }: { items: BrewItem[] }) {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    const slides = useMemo(() => {
        const byToken = new Map(items.map((i) => [i.token, i]));
        return FEATURED_CASKS.map((t) => byToken.get(t)).filter(Boolean) as BrewItem[];
    }, [items]);
    const total = slides.length;

    useEffect(() => {
        if (paused || total < 2) return;
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
        const t = setInterval(() => setActive((a) => (a + 1) % total), 6000);
        return () => clearInterval(t);
    }, [paused, total]);

    const wrap = 'min-h-[360px] flex-[1_1_100%] lg:flex-[0_0_65%]';
    const item = slides[active];
    if (!item) {
        return (
            <div className={`relative ${wrap} overflow-hidden rounded-[28px] border border-line bg-chip`} aria-hidden="true">
                <div className="absolute left-4 top-4 h-8 w-36 animate-pulse rounded-full bg-line-strong" />
                <div className="absolute right-4 top-4 flex gap-2"><div className="h-9 w-9 animate-pulse rounded-full bg-line-strong" /><div className="h-9 w-9 animate-pulse rounded-full bg-line-strong" /></div>
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-4 pb-4">
                    <div className="flex flex-col gap-2.5 px-2">
                        <div className="flex gap-2"><div className="h-7 w-24 animate-pulse rounded-full bg-line-strong" /><div className="h-7 w-44 animate-pulse rounded-full bg-line-strong" /></div>
                        <div className="h-[30px] w-3/5 animate-pulse rounded-lg bg-line-strong" />
                    </div>
                    <div className="h-[68px] animate-pulse rounded-[18px] bg-line-strong" />
                    <div className="flex justify-center gap-1.5">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-1.5 w-1.5 rounded-full bg-line-strong" />)}</div>
                </div>
            </div>
        );
    }

    const base = tileColor(item.name);
    const catId = getCategoryForToken(item, CASK_CATEGORIES);
    const catLabel = CASK_CATEGORIES.find((c) => c.id === catId)?.label ?? 'Featured';
    const step = (d: number) => setActive((a) => (a + d + total) % total);
    const ctl = 'relative z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-[rgba(17,17,20,0.55)] text-white backdrop-blur-md';

    return (
        <article
            aria-roledescription="carousel"
            aria-label={`Featured app: ${item.name}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className={`relative ${wrap} overflow-hidden rounded-[28px] border border-line transition-transform hover:scale-[1.005]`}
            style={{ background: `linear-gradient(135deg, ${base} 0%, color-mix(in srgb, ${base} 55%, #000) 100%)` }}
        >
            {item.homepage && (
                <img
                    src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(item.homepage)}&sz=128`}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-8 h-[300px] w-[300px] object-contain opacity-50 blur-[70px] saturate-150"
                />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.22),transparent_55%)]" />

            <div className="absolute left-4 top-4 flex h-8 items-center gap-2 rounded-full bg-[rgba(17,17,20,0.55)] px-3 text-[13px] font-semibold text-white backdrop-blur-md">
                <Sparkles size={14} fill="#FFB547" stroke="#FFB547" />Featured app
            </div>
            <div className="absolute right-4 top-4 flex gap-2">
                <button type="button" onClick={() => step(-1)} aria-label="Previous featured app" className={ctl}><ChevronLeft size={18} /></button>
                <button type="button" onClick={() => step(1)} aria-label="Next featured app" className={ctl}><ChevronRight size={18} /></button>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-4 pb-4">
                <div className="flex flex-col gap-2.5 px-2">
                    <div className="flex flex-wrap gap-2">
                        <span className="flex h-7 items-center rounded-full border border-white/25 bg-[rgba(17,17,20,0.5)] px-2.5 text-xs font-semibold text-white">{catLabel}</span>
                        {item.package.isFoss && (
                            <span className="flex h-7 items-center rounded-full border border-emerald-300/50 bg-emerald-400/20 px-2.5 text-xs font-semibold text-emerald-100">Open Source</span>
                        )}
                        <span className="flex h-7 items-center rounded-full border border-white/25 bg-[rgba(17,17,20,0.5)] px-2.5 font-mono text-xs font-semibold text-white">{item.installCmd}</span>
                    </div>
                    <h2 className="m-0 line-clamp-2 text-[clamp(22px,2.6vw,30px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                        {item.desc}
                    </h2>
                </div>
                <div className="flex items-center gap-3 rounded-[18px] bg-[rgba(17,17,20,0.55)] px-3.5 py-3 backdrop-blur-xl">
                    <AppIcon name={item.name} homepage={item.homepage} size={44} />
                    <div className="min-w-0 flex-1">
                        <StretchLink to={`/cask/${item.token}`} className="block truncate text-base font-bold !text-white hover:!text-white">{item.name}</StretchLink>
                        <div className="truncate font-mono text-xs text-zinc-300">v{item.version}</div>
                    </div>
                    <ChevronRight size={20} className="text-white/80" />
                </div>
                <div className="relative z-10 flex justify-center gap-1.5" role="tablist" aria-label="Featured apps">
                    {slides.map((s, i) => (
                        <button
                            key={s.token}
                            type="button"
                            role="tab"
                            aria-selected={i === active}
                            aria-label={`Show ${s.name}`}
                            onClick={() => setActive(i)}
                            className={`h-1.5 cursor-pointer rounded-full border-0 transition-all ${i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/45'}`}
                        />
                    ))}
                </div>
            </div>
        </article>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Discover() {
    useDocumentMeta({
        title: 'BrewLens — The Homebrew App Store',
        description: 'Browse, search, and discover Homebrew casks and formulae in your browser. Trending apps, categories, bookmarks, and Brewfile tools — no terminal required.',
    });

    const { data: casks = [] } = useBrewData('cask');
    const { data: formulae = [] } = useBrewData('formula');
    const { bookmarks } = useBookmarks();
    const { recentItems, clearRecent } = useRecentlyViewed();
    const { openModal } = useModal();

    const [shelfPick, setShelfPick] = useState<'bm' | 'rv' | null>(null);
    // Until the visitor picks a tab, show whichever shelf has something in it.
    const shelf: 'bm' | 'rv' = shelfPick ?? (!bookmarks.length && recentItems.length ? 'rv' : 'bm');
    const setShelf = setShelfPick;
    const [chartTab, setChartTab] = useState<'all' | 'cask' | 'formula'>('all');

    const caskByToken = useMemo(() => new Map(casks.map((c) => [c.token, c])), [casks]);
    const formulaByToken = useMemo(() => new Map(formulae.map((f) => [f.token, f])), [formulae]);

    // Featured and picks are fetched on their own, so they render without waiting for the full lists.
    // Each section appears once all of its items have settled, so rows don't reorder as they arrive.
    // Deprecated and disabled casks are left out; the curated draws include spares for that.
    const featured = useBrewItems('cask', FEATURED_CASKS);
    const pickItems = useBrewItems('cask', EDITORS_PICKS_TOKENS);
    const slides = useMemo(() => (featured.isLoading ? [] : featured.items.filter(isAvailable).slice(0, 5)), [featured]);
    const picks = useMemo(() => (pickItems.isLoading ? [] : pickItems.items.filter(isAvailable).slice(0, 5)), [pickItems]);

    const { data: caskStats } = useAnalytics('cask', '30d');
    const { data: formulaStats } = useAnalytics('formula', '30d');

    const chart = useMemo(() => {
        const rows = [
            ...(chartTab !== 'formula' ? caskStats?.items.slice(0, 12) ?? [] : []),
            ...(chartTab !== 'cask' ? formulaStats?.items.slice(0, 12) ?? [] : []),
        ].sort((a, b) => toNumber(b.count) - toNumber(a.count)).slice(0, 12);
        return rows.map((r) => {
            const meta = (r.type === 'cask' ? caskByToken : formulaByToken).get(r.token);
            return { ...r, name: meta?.name ?? r.token, homepage: meta?.homepage, desc: meta?.desc };
        });
    }, [chartTab, caskStats, formulaStats, caskByToken, formulaByToken]);

    return (
        <>
            {/* FEATURE + EDITOR'S PICKS */}
            <section id="top" className="flex flex-wrap items-stretch gap-8">
                <Hero items={slides} />
                <aside id="picks" aria-labelledby="picks-title" className="flex min-w-0 flex-[2_1_420px] flex-col">
                    <div className="text-[15px] font-medium text-muted">Hand-picked by our editors</div>
                    <h2 id="picks-title" className="mb-1 mt-0.5 text-[30px] font-bold tracking-[-0.025em]">Editor’s Picks</h2>
                    <div className="flex flex-1 flex-col">
                    {picks.length === 0 && Array.from({ length: 5 }).map((_, i) => <CompactRowSkeleton key={i} iconSize={56} className="flex-1" />)}
                    {picks.map((p) => (
                        <CompactRow
                            key={p.id}
                            name={p.name} token={p.token} type="cask" homepage={p.homepage}
                            desc={p.desc} iconSize={56} chevron className="flex-1"
                            meta={<><Chip mono className="h-6 max-w-[8rem] truncate px-2 text-xs">v{p.version}</Chip><Chip className="h-6 px-2 text-xs">Cask</Chip>{p.package.isFoss && <Chip tone="oss" className="h-6 px-2 text-xs">Open Source</Chip>}</>}
                        />
                    ))}
                    </div>
                </aside>
            </section>

            {/* MY SHELF */}
            <section id="shelf" aria-labelledby="shelf-title" className="flex flex-col gap-4">
                <SectionHead
                    eyebrow="Your bookmarks and recently viewed apps"
                    title="My Shelf"
                    id="shelf-title"
                    action={
                        <div className="flex flex-wrap items-center gap-2">
                            {shelf === 'rv' && recentItems.length > 0 && (
                                <PillButton variant="ghost" className="h-10 text-sm text-muted" onClick={clearRecent}><Trash2 size={15} />Clear history</PillButton>
                            )}
                            {shelf === 'bm' && bookmarks.length > 0 && (
                                <PillButton variant="ghost" className="h-10 text-sm" onClick={() => openModal(() => <BookmarksModal />, { size: 'lg' })}>Manage</PillButton>
                            )}
                            <Segmented
                                label="Shelf"
                                value={shelf}
                                onChange={setShelf}
                                options={[{ value: 'bm', label: 'Bookmarks' }, { value: 'rv', label: 'Recently Viewed' }]}
                            />
                        </div>
                    }
                />
                {shelf === 'bm' ? (
                    bookmarks.length ? (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
                            {bookmarks.slice(0, 8).map((b) => <AppCard key={b.id} item={b} />)}
                        </div>
                    ) : (
                        <div className="rounded-[20px] bg-surface"><EmptyState icon={<Sparkles size={22} />} title="No bookmarks yet" text="Tap the bookmark on any app to keep it on your shelf." /></div>
                    )
                ) : recentItems.length ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
                        {recentItems.slice(0, 12).map((r) => (
                            <div key={r.id} className="relative flex items-center gap-3.5 rounded-[18px] bg-surface p-3.5 transition-colors hover:bg-chip">
                                <AppIcon name={r.name} homepage={r.homepage} size={56} />
                                <div className="min-w-0 flex-1">
                                    <StretchLink to={`/${r.type}/${r.token}`} className="block truncate text-base font-semibold">{r.name}</StretchLink>
                                    <div className="truncate text-sm text-muted">{r.desc}</div>
                                    <div className="mt-0.5 truncate font-mono text-xs text-muted">v{r.version}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[20px] bg-surface"><EmptyState icon={<Sparkles size={22} />} title="Nothing here yet" text="Apps you open will show up here for three days." /></div>
                )}
            </section>

            {/* TOP CHARTS */}
            <section id="charts" aria-labelledby="charts-title" className="flex flex-col gap-4">
                <SectionHead
                    eyebrow="Most installed in the last 30 days"
                    title="Top Charts"
                    id="charts-title"
                    action={
                        <div className="flex items-center gap-3">
                            <Link to="/analytics" className="text-sm font-semibold text-accent-ink no-underline hover:underline">See full charts →</Link>
                            <Segmented
                                label="Chart type"
                                value={chartTab}
                                onChange={setChartTab}
                                options={[{ value: 'all', label: 'All' }, { value: 'cask', label: 'Mac Apps' }, { value: 'formula', label: 'Command Line' }]}
                            />
                        </div>
                    }
                />
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
                    {chart.length === 0 && Array.from({ length: 12 }).map((_, i) => <CompactRowSkeleton key={i} iconSize={60} card rank />)}
                    {chart.map((r, i) => (
                        <CompactRow
                            key={`${r.type}-${r.token}`}
                            rank={i + 1} iconSize={60} card
                            name={r.name} token={r.token} type={r.type} homepage={r.homepage} desc={r.desc ?? '\u00A0'}
                            meta={<><InstallsChip count={formatCount(r.count)} /><Chip className="h-6 px-2 text-xs">{r.type === 'cask' ? 'Cask' : 'Formula'}</Chip></>}
                        />
                    ))}
                </div>
            </section>

            {/* CATEGORIES */}
            <section id="categories" aria-labelledby="cat-title" className="flex flex-col gap-4">
                <SectionHead eyebrow="Casks for your Mac, formulae for your terminal" title="Browse by Category" id="cat-title" />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {CATEGORIES.map((c) => (
                        <Link
                            key={c.id}
                            to={`/all?category=${c.id}&type=${c.type}`}
                            className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-4 text-ink no-underline transition-colors hover:bg-chip hover:text-ink"
                        >
                            <span style={tint(c.ink)} className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${tintClass}`}><c.icon size={18} strokeWidth={2.2} /></span>
                            <span>
                                <span className="block text-[15px] font-semibold">{c.label}</span>
                                <span className="mt-0.5 block text-[13px] text-muted">{c.desc}</span>
                            </span>
                            <span className={`text-[11px] font-bold tracking-[0.06em] ${c.type === 'cask' ? 'text-[#1D4ED8] dark:text-[#93B4FF]' : 'text-accent-ink'}`}>{c.type.toUpperCase()}</span>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
