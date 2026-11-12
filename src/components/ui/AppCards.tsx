/**
 * @file AppCards.tsx
 * Reusable presentations of a package: grid card, list row, compact row.
 * The whole card is one link to the detail page (a "stretched link": the title
 * link covers the card via an ::after overlay), so nothing nests a button in
 * an anchor. Controls that must stay clickable sit above it with `z-10`.
 */
import { memo, useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Download } from 'lucide-react';
import type { BrewItem } from '../../types';
import { AppIcon } from './AppIcon';
import { Chip } from './kit';
import { cn } from '../../lib/utils';
import { CASK_CATEGORIES, FORMULA_CATEGORIES, getCategoryForToken, getCategoryStyle } from '../../data/categories';

const statusOf = (i: BrewItem) => (i.deprecated ? 'Deprecated' : i.disabled ? 'Disabled' : null);
const versionLabel = (v: string) => (v && v !== 'N/A' ? `v${v}` : 'v—');

/** Title link whose ::after covers the nearest `relative` ancestor. */
export const StretchLink = ({ to, className, children }: { to: string; className?: string; children: ReactNode }) => (
    <Link
        to={to}
        className={cn(
            "text-ink no-underline after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] hover:text-ink",
            className,
        )}
    >
        {children}
    </Link>
);

/** Soft colour wash from the app's own favicon, behind the content (needs an `isolate relative` parent). */
export const FaviconGlow = ({ homepage, large }: { homepage?: string; large?: boolean }) =>
    homepage ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
            <img
                src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(homepage)}&sz=128`}
                alt=""
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className={cn(
                    'absolute top-1/2 -translate-y-1/2 object-contain opacity-10 blur-[44px] saturate-200',
                    large ? '-left-10 h-72 w-72' : '-left-6 h-44 w-44',
                )}
            />
        </div>
    ) : null;

/** Category tag, coloured with the category's own colour. Renders nothing if uncategorised. */
const CategoryChip = ({ item, className }: { item: BrewItem; className?: string }) => {
    const category = useMemo(() => {
        const cats = item.type === 'cask' ? CASK_CATEGORIES : FORMULA_CATEGORIES;
        const id = getCategoryForToken(item, cats);
        const cat = id === 'all' ? undefined : cats.find((c) => c.id === id);
        return cat ? { label: cat.label, style: getCategoryStyle(cat.color) } : null;
    }, [item]);
    if (!category) return null;
    return <Chip className={cn('max-w-[10rem] truncate', category.style.badgeBg, category.style.badgeColor, className)}>{category.label}</Chip>;
};

/** Grid card used on Explore and My Shelf. */
export const AppCard = memo(({ item }: { item: BrewItem }) => {
    const status = statusOf(item);
    return (
        <article className="relative isolate flex flex-col gap-2.5 rounded-[14px] border border-line bg-surface p-3.5 transition-colors hover:bg-chip">
            <FaviconGlow homepage={item.homepage} />
            <div className="flex items-start justify-between gap-2">
                <AppIcon name={item.name} homepage={item.homepage} size={44} />
                {item.package.isFoss && <Chip tone="oss">Open Source</Chip>}
            </div>
            <div className="flex-1">
                <StretchLink to={`/${item.type}/${item.token}`} className="text-base font-bold">{item.name}</StretchLink>
                <p className="mb-0 mt-0.5 line-clamp-2 text-[13px] leading-[1.4] text-muted">{item.desc}</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
                <CategoryChip item={item} />
                <Chip tone="raised" mono className="max-w-[9rem] truncate">{versionLabel(item.version)}</Chip>
                {status && <Chip tone="warn">{status}</Chip>}
            </div>
        </article>
    );
});

/** Dense row used by Explore's list view. */
export const AppRow = memo(({ item }: { item: BrewItem }) => {
    const status = statusOf(item);
    return (
        <div className="relative flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border-b border-line px-2 py-3.5 transition-colors hover:bg-surface">
            <AppIcon name={item.name} homepage={item.homepage} size={48} />
            <div className="min-w-[200px] flex-[1_1_260px]">
                <StretchLink to={`/${item.type}/${item.token}`} className="text-base font-bold">{item.name}</StretchLink>
                {status && <Chip tone="warn" className="ml-2 h-5 text-[11px]">{status}</Chip>}
                <div className="truncate text-sm text-muted">{item.desc}</div>
            </div>
            <CategoryChip item={item} className="hidden sm:inline-flex" />
            <code className="hidden max-w-[300px] truncate rounded-lg bg-chip px-2.5 py-1.5 font-mono text-[13px] text-ink-soft lg:block">{item.installCmd}</code>
            <Chip mono className="hidden max-w-[9rem] truncate sm:inline-flex">{versionLabel(item.version)}</Chip>
            <ChevronRight size={18} className="text-muted" />
        </div>
    );
});

interface CompactProps {
    name: string;
    token: string;
    type: 'cask' | 'formula';
    homepage?: string;
    desc?: string;
    iconSize?: number;
    rank?: number;
    meta?: ReactNode;
    className?: string;
    /** Render as a standalone card (same design as AppCard) instead of a divided row. */
    card?: boolean;
    /** Show a right chevron that fades in on hover. */
    chevron?: boolean;
}

/** Compact row used by Editor's Picks and Top Charts on Discover. */
export const CompactRow = memo(({ name, token, type, homepage, desc, iconSize = 64, rank, meta, className, card, chevron }: CompactProps) => (
    <div className={cn(
        'group relative flex items-center gap-3.5 px-3 py-3 transition-colors',
        card
            ? 'isolate rounded-[14px] border border-line bg-surface px-4 hover:bg-chip'
            : 'rounded-2xl border-b border-line hover:bg-surface',
        className,
    )}>
        {card && <FaviconGlow homepage={homepage} />}
        <AppIcon name={name} homepage={homepage} size={iconSize} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <StretchLink to={`/${type}/${token}`} className="truncate text-base font-semibold">{name}</StretchLink>
            {desc && <div className="truncate text-sm text-muted">{desc}</div>}
            {meta && <div className="mt-1 flex items-center gap-1.5">{meta}</div>}
        </div>
        {rank !== undefined && (
            <span className={cn('text-xl font-extrabold leading-none', rank <= 3 ? 'text-accent-ink' : 'text-muted')}>{rank}</span>
        )}
        {chevron && (
            <ChevronRight
                aria-hidden="true"
                size={20}
                className="shrink-0 -translate-x-1 text-muted opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100"
            />
        )}
    </div>
));

/**
 * Loading placeholder for CompactRow. Mirrors its exact structure (padding,
 * icon size, text line heights, chips row) so the page doesn't shift.
 */
export const CompactRowSkeleton = ({ iconSize = 64, card, rank, className }: Pick<CompactProps, 'iconSize' | 'card' | 'className'> & { rank?: boolean }) => (
    <div
        aria-hidden="true"
        className={cn(
            'flex items-center gap-3.5 px-3 py-3',
            card ? 'rounded-[14px] border border-line bg-surface px-4' : 'rounded-2xl border-b border-line',
            className,
        )}
    >
        <div className="shrink-0 animate-pulse bg-line-strong" style={{ width: iconSize, height: iconSize, borderRadius: '0.5rem' }} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="h-6 w-2/5 animate-pulse rounded-md bg-line-strong" />
            <div className="h-5 w-3/4 animate-pulse rounded-md bg-line-strong" />
            <div className="mt-1 h-6 w-1/3 animate-pulse rounded-full bg-line-strong" />
        </div>
        {rank && <div className="h-5 w-5 animate-pulse rounded-md bg-line-strong" />}
    </div>
);

export const InstallsChip = ({ count }: { count: string }) => (
    <Chip className="h-6 gap-1 px-2 text-xs"><Download size={12} strokeWidth={2.6} />{count}</Chip>
);
