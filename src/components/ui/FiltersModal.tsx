/**
 * @file FiltersModal.tsx
 * Explore's "Filters & view" dialog. Every change is applied to the list
 * immediately (the modal keeps a local mirror so it re-renders without
 * depending on the parent re-creating the modal content).
 */
import { useState, type ReactNode } from 'react';
import { Check, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { useModal } from '../contexts/ModalContexts';
import { ModalShell } from './Modal';
import { PillButton } from './kit';
import { cn } from '../../lib/utils';
import type { BrewType } from '../../types';

export type ViewMode = 'grid' | 'list';
export interface ExploreSettings {
    filters: string[];
    showFonts: boolean;
    view: ViewMode;
}

/** Filters that exclude each other (picking one clears the other in its group). */
const GROUPS: string[][] = [['oss', 'proprietary'], ['active', 'inactive']];

const Group = ({ title, children }: { title: string; children: ReactNode }) => (
    <fieldset className="m-0 mb-5 min-w-0 border-0 p-0">
        <legend className="mb-2 p-0 text-xs font-bold uppercase tracking-[0.08em] text-muted">{title}</legend>
        <div className="flex flex-col gap-1">{children}</div>
    </fieldset>
);

const Option = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => (
    <button
        type="button"
        role="checkbox"
        aria-checked={on}
        onClick={onClick}
        className={cn(
            'flex h-12 cursor-pointer items-center justify-between rounded-2xl border-0 px-4 text-left text-[15px] font-medium text-ink',
            on ? 'bg-accent-soft' : 'bg-surface hover:bg-chip',
        )}
    >
        {children}
        <span className={cn('flex h-5 w-5 items-center justify-center rounded-md', on ? 'bg-accent text-[#111114]' : 'border border-line-strong')}>
            {on && <Check size={14} strokeWidth={3} />}
        </span>
    </button>
);

interface Props {
    type: BrewType;
    initial: ExploreSettings;
    onChange: (next: ExploreSettings) => void;
}

export default function FiltersModal({ type, initial, onChange }: Props) {
    const { closeModal } = useModal();
    const [state, setState] = useState<ExploreSettings>(initial);
    const { filters, showFonts, view } = state;

    const update = (patch: Partial<ExploreSettings>) => {
        const next = { ...state, ...patch };
        setState(next);
        onChange(next);
    };

    const toggle = (key: string) => {
        if (filters.includes(key)) return update({ filters: filters.filter((k) => k !== key) });
        const group = GROUPS.find((g) => g.includes(key)) ?? [];
        update({ filters: [...filters.filter((k) => !group.includes(k)), key] });
    };

    const count = filters.length + (showFonts ? 1 : 0);

    return (
        <ModalShell
            title="Filters & view"
            subtitle={count ? `${count} filter${count === 1 ? '' : 's'} selected` : 'No filters selected'}
            icon={<SlidersHorizontal size={20} />}
            id="filters-title"
            footer={
                <>
                    <PillButton variant="ghost" className="text-sm" onClick={() => update({ filters: [], showFonts: false })}>Clear filters</PillButton>
                    <PillButton variant="dark" className="ml-auto text-sm" onClick={closeModal}>Done</PillButton>
                </>
            }
        >
            <Group title="View">
                <div className="grid grid-cols-2 gap-2">
                    {([['grid', LayoutGrid, 'Grid'], ['list', List, 'List']] as const).map(([mode, Icon, label]) => (
                        <button
                            key={mode}
                            type="button"
                            aria-pressed={view === mode}
                            onClick={() => update({ view: mode })}
                            className={cn(
                                'flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border-0 text-[15px] font-semibold text-ink',
                                view === mode ? 'bg-invert text-on-invert' : 'bg-surface hover:bg-chip',
                            )}
                        >
                            <Icon size={18} />{label}
                        </button>
                    ))}
                </div>
            </Group>

            <Group title="Source">
                <Option on={filters.includes('oss')} onClick={() => toggle('oss')}>Open Source only</Option>
                <Option on={filters.includes('proprietary')} onClick={() => toggle('proprietary')}>Proprietary</Option>
            </Group>

            <Group title="Status">
                <Option on={filters.includes('active')} onClick={() => toggle('active')}>Active</Option>
                <Option on={filters.includes('inactive')} onClick={() => toggle('inactive')}>Deprecated / Disabled</Option>
            </Group>

            {type === 'cask' && (
                <Group title="Other">
                    <Option on={showFonts} onClick={() => update({ showFonts: !showFonts })}>Include fonts</Option>
                </Group>
            )}
        </ModalShell>
    );
}
