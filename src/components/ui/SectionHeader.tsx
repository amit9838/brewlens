/**
 * @file SectionHeader.tsx
 * Reusable section header with title, optional subtitle, and optional action slot.
 * Styled like an App Store section divider with consistent spacing and typography.
 */

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    action,
    className = '',
}) => (
    <div className={`flex items-end justify-between ${className}`}>
        <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
            )}
        </div>
        {action && (
            <div className="shrink-0 ml-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                {action}
            </div>
        )}
    </div>
);

export default SectionHeader;
