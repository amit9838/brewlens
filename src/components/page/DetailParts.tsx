/**
 * @file DetailParts.tsx
 * Pieces shared by the cask and formula detail pages.
 */
import { useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Braces, Check, ChevronLeft, Copy, Share, Info } from 'lucide-react';
import type { BrewItem } from '../../types';
import { AppIcon } from '../ui/AppIcon';
import { FaviconGlow, StretchLink } from '../ui/AppCards';
import { BookmarkButton } from '../ui/BookmarkButton';
import { Chip, EmptyState, IconButton, PillLink, Card, CardTitle, Eyebrow } from '../ui/kit';
import { useBrewData } from '../../hooks/useBrewData';
import { useCopy } from '../../hooks/useCopy';
import { useScreenshots } from '../../hooks/useScreenshots';
import { formatCount } from '../../lib/format';
import { getCategoryForToken, getCategoryStyle, CASK_CATEGORIES, FORMULA_CATEGORIES } from '../../data/categories';
import { cn } from '../../lib/utils';
import SkeletonDetails from './SkeletonDetails';

function hashString(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return h;
}

export function DetailFallback({ isLoading, error, token }: { isLoading: boolean; error: unknown; token: string }) {
    if (isLoading) return <SkeletonDetails />;
    return (
        <EmptyState
            icon={<Info size={24} />}
            title={error ? 'No data found' : 'Package not found'}
            text={`We couldn’t load “${token}” from Homebrew. It may have been renamed or removed.`}
            action={<PillLink to="/all" variant="dark" className="text-sm">Browse all packages</PillLink>}
        />
    );
}

/** Install analytics for the 30/90/365-day windows, tolerant of missing data. */
function installStats(item: BrewItem) {
    const install = item.raw?.analytics?.install ?? {};
    const rawName = typeof item.raw?.name === 'string' ? item.raw.name : undefined;
    const pick = (p: string) => install[p]?.[item.token] ?? (rawName ? install[p]?.[rawName] : undefined);
    return [
        { label: '1 month', value: pick('30d') },
        { label: '3 months', value: pick('90d') },
        { label: '1 year', value: pick('365d') },
    ];
}

export function TopBar({ item, apiUrl }: { item: BrewItem; apiUrl: string }) {
    const navigate = useNavigate();
    const { copy, isCopied } = useCopy();
    const canGoBack = typeof window !== 'undefined' && window.history.state?.idx > 0;
    return (
        <div className="-mb-4 -mt-4 flex items-center justify-between gap-3">
            <button
                type="button"
                onClick={() => (canGoBack ? navigate(-1) : navigate('/all'))}
                className="flex h-11 cursor-pointer items-center gap-1 rounded-full border-0 bg-transparent pl-2 pr-3.5 text-[15px] font-semibold text-ink hover:bg-chip"
            >
                <ChevronLeft size={20} strokeWidth={2.2} />{canGoBack ? 'Back' : 'Back to Explore'}
            </button>
            <div className="flex gap-1.5">
                <BookmarkButton item={item} />
                <IconButton aria-label="Copy link to this page" title="Copy link" onClick={() => copy(window.location.href, 'link')}>
                    {isCopied('link') ? <Check size={18} /> : <Share size={18} />}
                </IconButton>
                <a
                    href={apiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View raw JSON from the Homebrew API"
                    title="Raw JSON"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-chip text-ink hover:bg-line-strong"
                >
                    <Braces size={18} />
                </a>
            </div>
        </div>
    );
}

/** Gradient start colour per category colour family (static strings so Tailwind generates them). */
const TINT: Record<string, string> = {
    amber: 'from-amber-500/10', blue: 'from-blue-500/10', cyan: 'from-cyan-500/10', emerald: 'from-emerald-500/10',
    indigo: 'from-indigo-500/10', lime: 'from-lime-500/10', orange: 'from-orange-500/10', pink: 'from-pink-500/10',
    purple: 'from-purple-500/10', rose: 'from-rose-500/10', sky: 'from-sky-500/10', slate: 'from-slate-500/10',
    teal: 'from-teal-500/10', violet: 'from-violet-500/10', zinc: 'from-zinc-500/8',
};

export function Hero({
    item, kicker, categoryId, links,
}: { item: BrewItem; kicker: string; categoryId: string; links: ReactNode }) {
    const { copy, isCopied } = useCopy();
    const cats = item.type === 'cask' ? CASK_CATEGORIES : FORMULA_CATEGORIES;
    const cat = categoryId !== 'all' ? cats.find((c) => c.id === categoryId) : undefined;
    const status = item.deprecated ? 'Deprecated' : item.disabled ? 'Disabled' : null;

    return (
        <header className={cn(
            'relative isolate flex flex-wrap items-center gap-7 rounded-3xl bg-radial-[at_85%_15%] to-surface to-65% p-8',
            cat ? TINT[cat.color] ?? 'from-zinc-500/8' : 'from-accent-soft',
        )}>
            <FaviconGlow homepage={item.homepage} large />
            <AppIcon name={item.name} homepage={item.homepage} size={128} blend />
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[13px] font-medium uppercase tracking-[0.02em] text-muted">{kicker}</span>
                    {cat && (
                        <Link to={`/all?category=${cat.id}&type=${item.type}`} title={`Browse ${item.type}s in ${cat.label}`} className="no-underline">
                            <Chip className={cn(getCategoryStyle(cat.color).badgeBg, getCategoryStyle(cat.color).badgeColor)}>{cat.label}</Chip>
                        </Link>
                    )}
                    {status && <Chip tone="warn">{status}</Chip>}
                </div>
                <h1 className="m-0 text-5xl font-extrabold leading-none tracking-[-0.04em] max-sm:text-4xl">{item.name}</h1>
                <p className="m-0 text-lg text-ink-soft">{item.desc}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                    <div className="flex h-[52px] max-w-full items-center gap-2.5 rounded-full bg-term py-0 pl-[18px] pr-1.5 text-white">
                        <span className="font-mono text-[#6EE7B7]">$</span>
                        <code className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[15px]">{item.installCmd}</code>
                        <button
                            type="button"
                            onClick={() => copy(item.installCmd, 'cmd')}
                            aria-label="Copy install command"
                            className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-accent px-4 text-sm font-bold text-[#111114] transition hover:bg-emerald-400 active:scale-[0.97]"
                        >
                            <Copy size={16} />{isCopied('cmd') ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    {links}
                </div>
            </div>
        </header>
    );
}

export const ExternalLinkPill = ({ href, children }: { href: string; children: ReactNode }) => (
    <PillLink href={href} variant="outline">{children}<ArrowUpRight size={15} strokeWidth={2.2} /></PillLink>
);

/**
 * Screenshots for a cask (Mac App Store, else Flathub), in a horizontal strip.
 * Renders nothing when no source has the app or every image fails to load.
 */
export function ScreenshotsCard({ item }: { item: BrewItem }) {
    const info = useScreenshots(item);
    const [failed, setFailed] = useState<string[]>([]);
    const shots = info?.screenshots.filter((s) => !failed.includes(s)) ?? [];
    if (!info || shots.length === 0) return null;

    return (
        <Card>
            <div className="flex items-baseline justify-between gap-3">
                <CardTitle>Screenshots</CardTitle>
                {/* Flathub pages are for the Linux build, so only the Mac App Store is linked. */}
                {info.source === 'Flathub' ? (
                    <span className="text-[13px] font-semibold text-muted">Source · {info.source}</span>
                ) : (
                    <a
                        href={info.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
                    >
                        Source · {info.source}
                        <ArrowUpRight size={14} strokeWidth={2.2} />
                    </a>
                )}
            </div>
            <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
                {shots.map((src, i) => (
                    <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="shrink-0 snap-start">
                        <img
                            src={src}
                            alt={`${item.name} screenshot ${i + 1}`}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={() => setFailed((f) => [...f, src])}
                            className="aspect-[16/10] h-[clamp(170px,22vw,280px)] w-auto rounded-2xl border border-line bg-raised object-contain"
                        />
                    </a>
                ))}
            </div>
            {info.source !== 'Mac App Store' && (
                <p className="m-0 text-[13px] text-muted">
                    These screenshots are from {info.source} (Linux). The macOS app may look different.
                </p>
            )}
        </Card>
    );
}

export function InstallsCard({ item }: { item: BrewItem }) {
    return (
        <Card>
            <CardTitle>Installs</CardTitle>
            <div className="grid grid-cols-3 gap-2">
                {installStats(item).map((s) => (
                    <div key={s.label} className="rounded-2xl bg-raised p-4">
                        <div className="text-[13px] text-muted">{s.label}</div>
                        <div
                            title={s.value !== undefined ? String(s.value) : undefined}
                            className="mt-1 text-[26px] font-extrabold tracking-[-0.03em]"
                        >
                            {s.value !== undefined ? formatCount(s.value).toUpperCase() : '—'}
                        </div>
                    </div>
                ))}
            </div>
            <p className="m-0 text-[13px] text-muted">From official Homebrew analytics</p>
        </Card>
    );
}

export function MoreInCategory({ item, categoryId }: { item: BrewItem; categoryId: string }) {
    const { data } = useBrewData(item.type);
    const cats = item.type === 'cask' ? CASK_CATEGORIES : FORMULA_CATEGORIES;
    const cat = cats.find((c) => c.id === categoryId);

    // A random pick is chosen once per visit (the seed lives in state) so it doesn't
    // reshuffle on every re-render, but differs from visit to visit and per package.
    const [seed] = useState(() => Math.floor(Math.random() * 2 ** 31));

    const more = useMemo(() => {
        if (!cat || !data) return [];
        const pool = data.filter((c) =>
            c.token !== item.token && !c.deprecated && !c.disabled && !c.token.startsWith('font-')
            && getCategoryForToken(c, cats) === categoryId);

        // Seeded Fisher–Yates: take 4 random items from the pool.
        let t = (seed ^ hashString(item.token)) >>> 0;
        const rand = () => {
            t = (t + 0x6d2b79f5) >>> 0;
            let r = Math.imul(t ^ (t >>> 15), 1 | t);
            r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
            return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        };
        const picked = [...pool];
        const n = Math.min(4, picked.length);
        for (let i = 0; i < n; i++) {
            const j = i + Math.floor(rand() * (picked.length - i));
            [picked[i], picked[j]] = [picked[j], picked[i]];
        }
        return picked.slice(0, n);
    }, [data, cat, cats, categoryId, item.token, seed]);

    if (!cat || !more.length) return null;
    return (
        <Card>
            <div className="flex items-center justify-between gap-3">
                <CardTitle>More in {cat.label}</CardTitle>
                <Link
                    to={`/all?category=${cat.id}&type=${item.type}`}
                    aria-label={`See more in ${cat.label}`}
                    className="shrink-0 whitespace-nowrap text-sm font-semibold text-accent-ink no-underline hover:underline"
                >
                    See more →
                </Link>
            </div>
            <div className="flex flex-col divide-y divide-line">
                {more.map((m) => (
                    <div key={m.id} className="relative -mx-3 flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-chip">
                        <AppIcon name={m.name} homepage={m.homepage} size={40} />
                        <div className="min-w-0 flex-1">
                            <StretchLink to={`/${m.type}/${m.token}`} className="block truncate text-[15px] font-semibold">{m.name}</StretchLink>
                            <div className="truncate text-[13px] text-muted">{m.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export { Eyebrow };
