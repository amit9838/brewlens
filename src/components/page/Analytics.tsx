/**
 * @file Analytics.tsx
 * Install analytics leaderboard for casks and formulae (30 / 90 / 365 days).
 */
import { useMemo, useState } from 'react';
import { useAnalytics, PERIOD_LABELS, type Period } from '../../hooks/useAnalytics';
import { useBrewData } from '../../hooks/useBrewData';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { AppIcon } from '../ui/AppIcon';
import { PillButton, SectionHead, Segmented } from '../ui/kit';
import { StretchLink } from '../ui/AppCards';
import { ChevronRight } from 'lucide-react';
import ErrorState from './Error';
import { formatCount, toNumber } from '../../lib/format';
import type { BrewType } from '../../types';

const LIMIT_STEPS = [50, 100, 200, 500];

export default function Analytics() {
    const [type, setType] = useState<BrewType>('cask');
    const [period, setPeriod] = useState<Period>('30d');
    const [limit, setLimit] = useState(50);

    useDocumentMeta({
        title: 'Homebrew Install Analytics — Trending Casks & Formulae | BrewLens',
        description: 'See the most-installed Homebrew casks and formulae by install counts over 30, 90, or 365 days, powered by official Homebrew analytics data.',
    });

    const { data, isLoading, error } = useAnalytics(type, period);
    const { data: catalogue = [] } = useBrewData(type);
    const meta = useMemo(() => new Map(catalogue.map((i) => [i.token, i])), [catalogue]);

    const items = data?.items ?? [];
    const shown = items.slice(0, limit);
    const max = items[0] ? toNumber(items[0].count) : 1;
    const next = LIMIT_STEPS.find((s) => s > limit);
    const top = items[0];
    const noun = type === 'cask' ? 'Cask' : 'Formula';

    return (
        <section aria-labelledby="an-title" className="flex flex-col gap-6">
            <SectionHead
                level={1}
                id="an-title"
                eyebrow="Official Homebrew install analytics"
                title={`Top ${noun} Installs — Last ${PERIOD_LABELS[period]}`}
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <Segmented size="lg" label="Package type" value={type} onChange={(t) => { setType(t); setLimit(50); }}
                            options={[{ value: 'cask', label: 'Mac Apps' }, { value: 'formula', label: 'Command Line' }]} />
                        <Segmented size="lg" label="Time period" value={period} onChange={(p) => { setPeriod(p); setLimit(50); }}
                            options={(['30d', '90d', '365d'] as Period[]).map((p) => ({ value: p, label: PERIOD_LABELS[p] }))} />
                    </div>
                }
            />

            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                <div className="rounded-[20px] bg-invert p-5 text-on-invert">
                    <div className="text-sm opacity-70">Total installs</div>
                    <div className="mt-1.5 text-[32px] font-extrabold tracking-[-0.03em]">{data ? formatCount(data.total_count) : '—'}</div>
                </div>
                <div className="rounded-[20px] bg-surface p-5">
                    <div className="text-sm text-muted">Date range</div>
                    <div className="mt-1.5 text-xl font-bold">{data ? `${data.start_date} → ${data.end_date}` : '—'}</div>
                </div>
                <div className="rounded-[20px] bg-surface p-5">
                    <div className="text-sm text-muted">Most installed</div>
                    <div className="mt-1.5 text-xl font-bold">{top ? `${meta.get(top.token)?.name ?? top.token} · ${formatCount(top.count)}` : '—'}</div>
                </div>
            </div>

            {error && <ErrorState error={error} />}

            {!error && (
                <div className="overflow-hidden rounded-3xl bg-raised shadow-[0_0_0_1px_var(--line)]">
                    <div className="flex gap-4 border-b border-line px-6 py-3.5 text-xs font-bold tracking-[0.06em] text-muted">
                        <span className="w-10">RANK</span>
                        <span className="flex-1">{noun.toUpperCase()}</span>
                        <span className="hidden flex-[0_1_320px] sm:block">INSTALLS</span>
                        <span className="w-5" />
                    </div>

                    {isLoading && Array.from({ length: 8 }).map((_, i) => <div key={i} className="m-3 h-14 animate-pulse rounded-2xl bg-chip" />)}

                    {shown.map((r) => {
                        const m = meta.get(r.token);
                        const name = m?.name ?? r.token;
                        const key = `${type}-${r.token}`;
                        return (
                            <div key={key} className="relative flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line px-6 py-4 transition-colors hover:bg-surface">
                                <span className={`w-10 text-[22px] font-extrabold ${r.number <= 3 ? 'text-accent-ink' : 'text-muted'}`}>{r.number}</span>
                                <div className="flex min-w-[220px] flex-[1_1_260px] items-center gap-3.5">
                                    <AppIcon name={name} homepage={m?.homepage} size={52} />
                                    <div className="min-w-0">
                                        <StretchLink to={`/${type}/${r.token}`} className="block truncate text-base font-bold">{name}</StretchLink>
                                        <div className="truncate font-mono text-[13px] text-muted">{r.token}</div>
                                    </div>
                                </div>
                                <div className="flex min-w-[180px] flex-[0_1_320px] items-center gap-3">
                                    <div className="h-2 flex-1 overflow-hidden rounded bg-chip">
                                        <div className="h-full rounded bg-accent" style={{ width: `${Math.max(2, (toNumber(r.count) / max) * 100)}%` }} />
                                    </div>
                                    <span className="w-16 text-right text-[15px] font-bold" title={`${r.count} installs · ${r.percent}%`}>{formatCount(r.count)}</span>
                                </div>
                                <ChevronRight size={18} className="w-5 text-muted" />
                            </div>
                        );
                    })}

                    {!isLoading && items.length > 0 && (
                        <div className="flex justify-center p-5">
                            <PillButton variant="outline" disabled={!next || items.length <= limit} onClick={() => next && setLimit(next)}>
                                {next && items.length > limit ? `Show top ${next}` : `Showing top ${Math.min(limit, items.length)}`}
                            </PillButton>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
