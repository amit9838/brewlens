/**
 * @file Drawer.tsx
 * Sidebar opened from the header menu button (all screen sizes). Holds the
 * Install guide, secondary pages, quick actions and external resources.
 * Focus-trapped; closes on Esc, backdrop click and route change.
 */
import { useEffect, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    BarChart3, BookOpen, ChevronRight, Compass, ExternalLink, Github, Home, Info,
    Moon, Sun, Terminal, X, type LucideIcon,
} from 'lucide-react';
import logo from '../../assets/brewlens_logo.png';
import { useDrawerBehavior } from '../../hooks/useDrawerBehavior';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const PAGES: { label: string; to: string; icon: LucideIcon; end?: boolean }[] = [
    { label: 'Discover', to: '/', icon: Home, end: true },
    { label: 'Explore', to: '/all', icon: Compass },
    { label: 'Charts', to: '/analytics', icon: BarChart3 },
    { label: 'About', to: '/about', icon: Info },
];

const RESOURCES: { label: string; href: string; icon: LucideIcon }[] = [
    { label: 'Homebrew Docs', href: 'https://docs.brew.sh', icon: BookOpen },
    { label: 'GitHub repository', href: 'https://github.com/amit9838/brewlens', icon: Github },
];

const rowBase = 'group flex w-full cursor-pointer items-center gap-3 rounded-2xl border-0 bg-transparent px-3 py-2.5 text-left text-[15px] font-semibold text-ink no-underline transition-colors hover:bg-chip hover:text-ink';
const iconBox = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-chip text-ink-soft transition-colors group-hover:bg-raised';

const Heading = ({ children }: { children: ReactNode }) => (
    <p className="m-0 mb-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{children}</p>
);

export const NavDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
    const panelRef = useDrawerBehavior(isOpen, onClose);
    const { pathname } = useLocation();
    const { theme, toggle } = useTheme();

    useEffect(() => {
        onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <div className={cn('fixed inset-0 z-[90]', isOpen ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!isOpen}>
            <div
                className={cn('absolute inset-0 bg-[rgba(17,17,20,0.45)] transition-opacity duration-200', isOpen ? 'opacity-100' : 'opacity-0')}
                onClick={onClose}
            />
            <div
                id="app-drawer"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                tabIndex={-1}
                className={cn(
                    'absolute inset-y-0 left-0 flex w-[340px] max-w-[85vw] flex-col gap-6 overflow-y-auto bg-canvas p-5 shadow-pop outline-none transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="flex items-center justify-between">
                    <Link to="/" onClick={onClose} className="flex items-center gap-2.5 text-ink no-underline hover:text-ink">
                        <img src={logo} alt="" className="h-9 w-9 rounded-[10px]" />
                        <span className="text-[22px] font-bold tracking-[-0.02em]">Brew<span className="font-light opacity-70">Lens</span></span>
                    </Link>
                    <button type="button" onClick={onClose} aria-label="Close menu" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-chip text-ink hover:bg-line-strong">
                        <X size={20} />
                    </button>
                </div>

                <Link
                    to="/installation"
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-[18px] border border-accent/30 bg-accent-soft p-3.5 no-underline transition-colors hover:border-accent/50 hover:bg-accent-tint"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-tint text-accent-tint-ink"><Terminal size={18} strokeWidth={2} /></span>
                    <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold text-accent-tint-ink">Install Homebrew</span>
                        <span className="block text-xs text-muted">macOS, Linux &amp; WSL — step by step</span>
                    </span>
                    <ChevronRight size={16} className="text-accent-ink transition-transform group-hover:translate-x-0.5" />
                </Link>

                <nav aria-label="Pages">
                    <Heading>Pages</Heading>
                    {PAGES.map((p) => (
                        <NavLink
                            key={p.to}
                            to={p.to}
                            end={p.end}
                            onClick={onClose}
                            className={({ isActive }) => cn(rowBase, isActive && 'bg-accent-tint text-accent-tint-ink hover:bg-accent-tint hover:text-accent-tint-ink')}
                        >
                            <span className={iconBox}><p.icon size={18} /></span>{p.label}
                        </NavLink>
                    ))}
                </nav>

                <div>
                    <Heading>Appearance</Heading>
                    <button type="button" className={rowBase} onClick={toggle}>
                        <span className={iconBox}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</span>
                        <span className="flex-1">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                    </button>
                </div>

                <div>
                    <Heading>Resources</Heading>
                    {RESOURCES.map((r) => (
                        <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer" className={rowBase} onClick={onClose}>
                            <span className={iconBox}><r.icon size={18} /></span>
                            <span className="flex-1">{r.label}</span>
                            <ExternalLink size={14} className="text-muted" />
                        </a>
                    ))}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-xs font-semibold text-muted">
                    <span>v0.4.0 · Open source · MIT</span>
                    <a href="https://github.com/amit9838/brewlens" target="_blank" rel="noopener noreferrer" aria-label="BrewLens on GitHub" className="text-muted hover:text-ink">
                        <Github size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
};
