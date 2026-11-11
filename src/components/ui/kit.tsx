/**
 * @file kit.tsx
 * Small design-system primitives used across every page: Chip, Segmented
 * tabs, GetButton, SectionHead, PillButton, IconButton, EmptyState.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Chip({
    children, tone = 'neutral', mono = false, className,
}: { children: ReactNode; tone?: 'neutral' | 'raised' | 'accent' | 'oss' | 'warn' | 'dark'; mono?: boolean; className?: string }) {
    const tones = {
        neutral: 'bg-chip text-ink-soft',
        raised: 'bg-raised text-ink-soft',
        accent: 'bg-accent-tint text-accent-tint-ink',
        oss: 'bg-accent-soft text-accent-ink',
        warn: 'bg-warn-bg text-warn-ink',
        dark: 'bg-invert-soft text-white',
    };
    return (
        <span className={cn(
            'inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[13px] font-semibold',
            mono && 'font-mono font-medium', tones[tone], className,
        )}>
            {children}
        </span>
    );
}

export function Segmented<T extends string>({
    value, onChange, options, label, size = 'md', className,
}: {
    value: T;
    onChange: (v: T) => void;
    options: { value: T; label: ReactNode }[];
    label: string;
    size?: 'md' | 'lg';
    className?: string;
}) {
    return (
        <div role="tablist" aria-label={label} className={cn('flex gap-1 rounded-full bg-chip p-1', className)}>
            {options.map((o) => {
                const active = o.value === value;
                return (
                    <button
                        key={o.value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(o.value)}
                        className={cn(
                            'cursor-pointer whitespace-nowrap rounded-full border-0 font-semibold text-ink transition-colors',
                            size === 'lg' ? 'h-11 px-5 text-[15px]' : 'h-10 px-4 text-sm',
                            active ? 'bg-raised shadow-tab' : 'bg-transparent hover:bg-raised/60',
                        )}
                    >
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}

export function SectionHead({
    eyebrow, title, id, action, level = 2,
}: { eyebrow?: string; title: string; id?: string; action?: ReactNode; level?: 1 | 2 }) {
    const H = level === 1 ? 'h1' : 'h2';
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
                {eyebrow && <div className="text-[15px] font-medium text-muted">{eyebrow}</div>}
                <H id={id} className={cn(
                    'mt-0.5 font-bold tracking-[-0.025em]',
                    level === 1 ? 'text-[40px] font-extrabold tracking-[-0.035em]' : 'text-[30px]',
                )}>
                    {title}
                </H>
            </div>
            {action}
        </div>
    );
}

type PillVariant = 'outline' | 'dark' | 'accent' | 'soft' | 'ghost' | 'danger';

const PILL: Record<PillVariant, string> = {
    outline: 'border border-line-strong bg-raised text-ink hover:bg-surface',
    dark: 'bg-invert text-on-invert hover:opacity-90',
    accent: 'bg-accent text-[#111114] hover:opacity-90',
    soft: 'bg-accent-soft text-accent-ink hover:bg-accent-tint',
    ghost: 'bg-transparent text-ink hover:bg-chip',
    danger: 'bg-transparent text-danger hover:bg-chip',
};

export function pillClass(variant: PillVariant = 'outline', className?: string) {
    return cn(
        'inline-flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-[15px] font-bold transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        PILL[variant], className,
    );
}

export function PillButton({
    variant = 'outline', className, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: PillVariant }) {
    return <button type="button" {...props} className={pillClass(variant, className)} />;
}

export function PillLink({
    variant = 'outline', className, to, href, children, onClick, ...rest
}: { variant?: PillVariant; className?: string; to?: string; href?: string; children: ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
    const cls = pillClass(variant, className);
    if (to) return <Link to={to} className={cls} onClick={onClick}>{children}</Link>;
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>{children}</a>;
}

export function IconButton({
    className, active, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
    return (
        <button
            type="button"
            {...props}
            className={cn(
                'flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 transition-colors',
                active ? 'bg-accent-soft text-accent-ink' : 'bg-chip text-ink hover:bg-line-strong',
                className,
            )}
        />
    );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text?: string; action?: ReactNode }) {
    return (
        <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-chip text-muted">{icon}</span>
            <div className="text-[17px] font-bold">{title}</div>
            {text && <div className="max-w-xs text-sm text-muted">{text}</div>}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
    <section className={cn('flex flex-col gap-4 rounded-3xl bg-surface p-6', className)}>{children}</section>
);

export const CardTitle = ({ children }: { children: ReactNode }) => (
    <h2 className="m-0 text-xl font-bold tracking-[-0.015em]">{children}</h2>
);

export const Eyebrow = ({ children }: { children: ReactNode }) => (
    <div className="text-xs font-bold tracking-[0.06em] text-muted">{children}</div>
);
